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

    // Get userId from query or session - MOVED THIS UP
    const userId = parseInt(req.query.userId || session.user.id, 10);

    // Check role and authorization - FIX ORDER
    if (session.user.role !== 'student' && session.user.role !== 'admin') {
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

    // Get student data to determine their class and section
    const student = await prisma.student.findUnique({
      where: { id: userId },
      select: {
        classId: true,
        sectionId: true,
      },
    });

    if (!student) {
      // Return empty array instead of error
      return res.status(200).json([]);
    }

    // Get class schedules for the student's class and section
    const schedules = await prisma.classSchedule.findMany({
      where: {
        classId: student.classId,
        sectionId: student.sectionId,
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            course_code: true,
          },
        },
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
        section: {
          select: {
            room_no: true,
          },
        },
      },
    });

    // If no schedules found, return empty array
    if (!schedules || schedules.length === 0) {
      return res.status(200).json([]);
    }

    // Format the schedules
    const formattedSchedules = schedules.map((schedule) => ({
      id: schedule.id,
      courseId: schedule.courseId,
      course: schedule.course?.name || 'Unknown Course',
      course_code: schedule.course?.course_code || 'N/A',
      facultyId: schedule.facultyId,
      faculty: schedule.faculty?.name || 'Unknown Faculty',
      location: schedule.section?.room_no || 'TBD',
      day_of_week: schedule.day_of_week || 'Monday',
      start_time: schedule.start_time
        ? schedule.start_time.toISOString().split('T')[1].substring(0, 8)
        : '09:00:00',
      end_time: schedule.end_time
        ? schedule.end_time.toISOString().split('T')[1].substring(0, 8)
        : '10:30:00',
    }));

    return res.status(200).json(formattedSchedules);
  } catch (error) {
    console.error('Error fetching class schedule:', error);
    // Return empty array instead of error
    return res.status(200).json([]);
  } finally {
    await prisma.$disconnect();
  }
}
