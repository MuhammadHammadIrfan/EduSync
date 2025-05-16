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

    // Check role
    if (session.user.role !== 'student' && session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Not authorized' });
    }

    // Verify the user is accessing their own data
    if (
      session.user.id.toString() !== userId.toString() &&
      session.user.role !== 'admin'
    ) {
      return res.status(403).json({
        error: 'Forbidden - Not authorized to access this data',
      });
    }

    // Get optional courseId filter
    const courseId = req.query.courseId
      ? parseInt(req.query.courseId, 10)
      : null;

    // Get student's class and section first to ensure proper context
    const student = await prisma.student.findUnique({
      where: { id: userId },
      select: { classId: true, sectionId: true },
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

    // Get course IDs the student's class is enrolled in
    const courseIds = classEnrollments.map((e) => e.courseId);

    // Build query for attendance - only include attendance for courses the student's class is enrolled in
    const attendanceQuery = {
      where: {
        studentId: userId,
        courseId: courseId ? { equals: courseId } : { in: courseIds },
      },
      include: {
        course: true,
      },
      orderBy: { date: 'desc' },
    };

    const attendanceRecords = await prisma.attendance.findMany(attendanceQuery);

    // Transform records for frontend
    const transformedRecords = attendanceRecords.map((record) => {
      return {
        id: record.id,
        date: record.date.toISOString(),
        status: record.status || 'Unknown',
        courseId: record.courseId,
        courseName: record.course?.name || 'Unknown Course',
        courseCode: record.course?.course_code || 'N/A',
      };
    });

    return res.status(200).json(transformedRecords);
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}
