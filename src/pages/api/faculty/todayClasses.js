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

    // Get today's day name
    const today = new Date();
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const todayDayName = dayNames[today.getDay()];

    // Get today's classes
    const todayClasses = await prisma.classSchedule.findMany({
      where: {
        facultyId: userId,
        day_of_week: todayDayName,
      },
      include: {
        course: true,
        class: true,
        section: true,
      },
      orderBy: { start_time: 'asc' },
    });

    // Format response
    // Replace the mock student count with a database query
    const formattedClasses = await Promise.all(
      todayClasses.map(async (cls) => {
        // Get actual student count for this section
        const studentCount = await prisma.student.count({
          where: {
            sectionId: cls.sectionId,
            classId: cls.classId,
          },
        });

        return {
          id: cls.id,
          course: cls.course.name,
          course_code: cls.course.course_code,
          class_name: cls.class.name,
          section_name: cls.section.name,
          student_count: studentCount, // Real count from database
          start_time: cls.start_time
            .toISOString()
            .split('T')[1]
            .substring(0, 5),
          end_time: cls.end_time.toISOString().split('T')[1].substring(0, 5),
          location: cls.section.room_no,
          department: cls.course.department?.name || 'Computer Science',
        };
      })
    );

    return res.status(200).json(formattedClasses);
  } catch (error) {
    console.error("Error fetching today's classes:", error);
    return res.status(500).json({ error: "Failed to fetch today's classes" });
  } finally {
    await prisma.$disconnect();
  }
}
