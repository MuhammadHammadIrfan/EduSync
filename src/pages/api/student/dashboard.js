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
      console.log('No session in dashboard API');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check role
    if (session.user.role !== 'student') {
      return res.status(403).json({ error: 'Forbidden - Not a student' });
    }

    // Get userId from query or session
    const userId = parseInt(req.query.userId || session.user.id, 10);

    // Verify the user is accessing their own data
    if (
      session.user.id.toString() !== userId.toString() &&
      session.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ error: 'Forbidden - Not authorized to access this data' });
    }

    // Get today's date and day of week
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
    const todayName = dayNames[today.getDay()];

    // Get student with all necessary related data
    const student = await prisma.student.findUnique({
      where: { id: userId },
      include: {
        department: true,
        class: true,
        section: true,
        attendance: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get class enrollments (courses for this class)
    const classEnrollments = await prisma.classEnrollment.findMany({
      where: { classId: student.classId },
      include: {
        course: true,
      },
    });

    // Get schedules for these courses that match the student's section
    const courseIds = classEnrollments.map((e) => e.courseId);
    const schedules = await prisma.classSchedule.findMany({
      where: {
        courseId: { in: courseIds },
        sectionId: student.sectionId,
      },
      include: {
        course: true,
        faculty: true,
        section: true,
      },
    });

    // Get upcoming events from the Event table that are relevant to this student
    const upcomingEvents = await prisma.event.findMany({
      where: {
        event_date: { gte: today },
        OR: [
          {
            audiences: {
              some: {
                audience_type: 'student',
                audience_id: userId,
              },
            },
          },
          {
            audiences: {
              some: {
                audience_type: 'class',
                audience_id: student.classId,
              },
            },
          },
          {
            audiences: {
              some: {
                audience_type: 'department',
                audience_id: student.departmentId,
              },
            },
          },
          {
            audiences: {
              some: {
                audience_type: 'all',
              },
            },
          },
        ],
      },
      orderBy: {
        event_date: 'asc',
      },
      take: 5,
    });

    // Format today's classes
    const todaysClasses = schedules
      .filter((schedule) => schedule.day_of_week === todayName)
      .map((schedule) => {
        // Format the times
        const startTime = new Date(schedule.start_time).toLocaleTimeString(
          'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }
        );

        const endTime = new Date(schedule.end_time).toLocaleTimeString(
          'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }
        );

        return {
          id: schedule.id,
          name: schedule.course.name,
          code: schedule.course.course_code,
          time: `${startTime} - ${endTime}`,
          room: schedule.section.room_no || 'Room not assigned',
          facultyName: schedule.faculty?.name || 'Not assigned',
        };
      });

    // Format course attendance data
    const courseAttendanceMap = {};

    // First, get all courses student is enrolled in
    for (const enrollment of classEnrollments) {
      courseAttendanceMap[enrollment.courseId] = {
        id: enrollment.courseId,
        name: enrollment.course.name,
        code: enrollment.course.course_code,
        attended: 0,
        total: 0,
        percentage: 0,
      };
    }

    // Then count attendance records
    for (const record of student.attendance) {
      if (!courseAttendanceMap[record.courseId]) continue;

      courseAttendanceMap[record.courseId].total++;

      if (record.status === 'Present' || record.status === 'Late') {
        courseAttendanceMap[record.courseId].attended++;
      }
    }

    // Calculate percentages
    const courseAttendance = Object.values(courseAttendanceMap).map(
      (course) => {
        course.percentage =
          course.total > 0
            ? Math.round((course.attended / course.total) * 100)
            : 0;
        return course;
      }
    );

    // Format the schedule by day
    const scheduleByDay = {};
    dayNames.forEach((day) => {
      scheduleByDay[day] = [];
    });

    schedules.forEach((schedule) => {
      const day = schedule.day_of_week;

      const startTime = new Date(schedule.start_time).toLocaleTimeString(
        'en-US',
        {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }
      );

      const endTime = new Date(schedule.end_time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      scheduleByDay[day].push({
        id: schedule.id,
        name: schedule.course.name,
        code: schedule.course.course_code,
        time: `${startTime} - ${endTime}`,
        room: schedule.section.room_no || 'Room not assigned',
        facultyName: schedule.faculty?.name || 'Not assigned',
      });
    });

    // Format events data
    const formattedEvents = upcomingEvents.map((event) => {
      const eventDate = new Date(event.event_date);
      const date = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const time = eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        date,
        time,
        location: 'Campus',
      };
    });

    // Return the response with all the formatted data
    res.status(200).json({
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        departmentName: student.department?.name || 'N/A',
        className: student.class?.name || 'N/A',
        sectionName: student.section?.name || 'N/A',
      },
      todaysClasses,
      courseAttendance,
      upcomingEvents: formattedEvents,
      schedule: dayNames
        .map((day) => ({
          day,
          classes: scheduleByDay[day],
        }))
        .filter((daySchedule) => daySchedule.classes.length > 0),
    });
  } catch (error) {
    console.error('Error fetching student dashboard data:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
