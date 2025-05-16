import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated session
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get userId from query or session
    const userId = parseInt(req.query.userId || session.user.id, 10);

    // Check role
    if (session.user.role !== 'faculty' && session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Not authorized' });
    }

    // Verify the user is accessing their own data
    if (
      session.user.id.toString() !== userId.toString() &&
      session.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ error: 'Forbidden - Not authorized to access this data' });
    }

    // Get class schedule for faculty
    const schedules = await prisma.classSchedule.findMany({
      where: { facultyId: userId },
      include: {
        course: true,
        class: true,
        section: true,
      },
      orderBy: [{ day_of_week: 'asc' }, { start_time: 'asc' }],
    });

    // Define day of week order for sorting
    const dayOrder = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    // Format response
    // Replace the mock student count with a database query
    const formattedSchedules = await Promise.all(
      schedules.map(async (schedule) => {
        // Get actual student count for this section
        const studentCount = await prisma.student.count({
          where: {
            sectionId: schedule.sectionId,
            classId: schedule.classId,
          },
        });

        return {
          id: schedule.id,
          courseId: schedule.courseId,
          course: schedule.course.name,
          course_code: schedule.course.course_code,
          facultyId: schedule.facultyId,
          faculty: 'Dr. Ahmed Khan', // This would be the faculty name - we already know it's the current user
          classId: schedule.classId,
          class_name: schedule.class.name,
          sectionId: schedule.sectionId,
          section_name: schedule.section.name,
          location: schedule.section.room_no,
          day_of_week: schedule.day_of_week,
          day_order: dayOrder.indexOf(schedule.day_of_week),
          start_time: schedule.start_time
            .toISOString()
            .split('T')[1]
            .substring(0, 8),
          end_time: schedule.end_time
            .toISOString()
            .split('T')[1]
            .substring(0, 8),
          student_count: studentCount, // Real count from database
        };
      })
    );

    // Sort by day of week and start time
    formattedSchedules.sort((a, b) => {
      if (a.day_order !== b.day_order) {
        return a.day_order - b.day_order;
      }
      return a.start_time.localeCompare(b.start_time);
    });

    return res.status(200).json(formattedSchedules);
  } catch (error) {
    console.error('Error fetching class schedule:', error);
    return res.status(500).json({ error: 'Failed to fetch class schedule' });
  } finally {
    await prisma.$disconnect();
  }
}
