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
    const classId = req.query.classId ? parseInt(req.query.classId, 10) : null;

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

    // If classId is provided, get student list for that class
    if (classId) {
      // First verify this class is taught by this faculty
      const classSchedule = await prisma.classSchedule.findFirst({
        where: {
          id: classId,
          facultyId: userId,
        },
        include: {
          section: true,
          class: true,
          course: true,
        },
      });

      if (!classSchedule) {
        return res
          .status(404)
          .json({ error: 'Class not found or not taught by this faculty' });
      }

      // Get students in this section
      // Replace the mock students with real database query
      // Get students in this section with all needed details
      const students = await prisma.student.findMany({
        where: {
          sectionId: classSchedule.sectionId,
          classId: classSchedule.classId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          // Include any other fields you need
        },
      });

      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if attendance has been recorded today for this class
      const existingAttendance = await prisma.attendance.findMany({
        where: {
          courseId: classSchedule.courseId,
          studentId: {
            in: students.map((s) => s.id),
          },
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      // Format student data with attendance status if available
      const studentsWithAttendance = students.map((student) => {
        const attendance = existingAttendance.find(
          (a) => a.studentId === student.id
        );
        return {
          id: student.id,
          name: student.name,
          studentId: `STU-${student.id}`, // Format student ID better
          email: student.email,
          status: attendance ? attendance.status.toLowerCase() : 'present', // Default to present if not recorded
        };
      });

      return res.status(200).json(studentsWithAttendance);
    }
    // Otherwise, return list of classes taught today
    else {
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
      const formattedClasses = await Promise.all(
        todayClasses.map(async (cls) => {
          // Calculate student count
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
            student_count: studentCount,
            start_time: cls.start_time
              .toISOString()
              .split('T')[1]
              .substring(0, 5),
            end_time: cls.end_time.toISOString().split('T')[1].substring(0, 5),
            location: cls.section.room_no,
          };
        })
      );

      return res.status(200).json(formattedClasses);
    }
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return res.status(500).json({ error: 'Failed to fetch attendance data' });
  } finally {
    await prisma.$disconnect();
  }
}
