import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated session
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check role
    if (session.user.role !== 'faculty' && session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Not authorized' });
    }

    const { facultyId, classId, attendanceData } = req.body;

    // Verify the user is submitting their own data
    if (
      session.user.id.toString() !== facultyId.toString() &&
      session.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ error: 'Forbidden - Not authorized to submit this data' });
    }

    // Verify this class is taught by this faculty
    const classSchedule = await prisma.classSchedule.findFirst({
      where: {
        id: parseInt(classId, 10),
        facultyId: parseInt(facultyId, 10),
      },
      include: {
        course: true,
        section: true,
      },
    });

    if (!classSchedule) {
      return res
        .status(404)
        .json({ error: 'Class not found or not taught by this faculty' });
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verify all students belong to the correct section
    const studentIds = attendanceData.map((record) => record.id);

    // Get students in this section
    const validStudents = await prisma.student.findMany({
      where: {
        id: { in: studentIds },
        sectionId: classSchedule.sectionId,
        classId: classSchedule.classId,
      },
      select: { id: true },
    });

    // Create a set of valid student IDs for quick lookup
    const validStudentIds = new Set(validStudents.map((s) => s.id));

    // Filter out any invalid student IDs (not in this section)
    const validAttendanceData = attendanceData.filter((record) =>
      validStudentIds.has(record.id)
    );

    if (validAttendanceData.length < attendanceData.length) {
      console.warn(
        `Filtered out ${
          attendanceData.length - validAttendanceData.length
        } invalid student IDs`
      );
    }

    // Create attendance records
    const attendancePromises = validAttendanceData.map(async (record) => {
      try {
        // Check if an attendance record already exists for this student, course, and date
        const existingRecord = await prisma.attendance.findFirst({
          where: {
            studentId: record.id,
            courseId: classSchedule.courseId,
            date: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        });

        // Map the status string to enum value
        let statusEnum;
        switch (record.status.toLowerCase()) {
          case 'present':
            statusEnum = 'Present';
            break;
          case 'absent':
            statusEnum = 'Absent';
            break;
          case 'late':
            statusEnum = 'Late';
            break;
          default:
            statusEnum = 'Present';
        }

        if (existingRecord) {
          // Update existing record
          return prisma.attendance.update({
            where: { id: existingRecord.id },
            data: { status: statusEnum },
          });
        } else {
          // Create new record
          return prisma.attendance.create({
            data: {
              studentId: record.id,
              courseId: classSchedule.courseId,
              date: today,
              status: statusEnum,
            },
          });
        }
      } catch (err) {
        console.error(
          `Error processing attendance for student ID ${record.id}:`,
          err
        );
        return null;
      }
    });

    // Execute all database operations
    const results = await Promise.all(attendancePromises);
    const successfulUpdates = results.filter((r) => r !== null);

    // Log information about the attendance submission
    console.log(
      `Attendance saved for ${successfulUpdates.length} students in ${classSchedule.course.name} (${classSchedule.section.name})`
    );

    return res.status(200).json({
      success: true,
      message: 'Attendance saved successfully',
      count: successfulUpdates.length,
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    return res.status(500).json({
      error: 'Failed to save attendance',
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}
