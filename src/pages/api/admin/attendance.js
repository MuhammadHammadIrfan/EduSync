import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    // Authentication check
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        return await getAttendance(req, res);
      case 'PUT':
        return await updateAttendance(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in attendance API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

// Get attendance records with optional filters
async function getAttendance(req, res) {
  const { departmentId, classId, sectionId, courseId, date } = req.query;

  // All filters are required
  if (!departmentId || !classId || !sectionId || !courseId) {
    return res
      .status(200)
      .json({
        records: [],
        summary: { present: 0, absent: 0, late: 0, total: 0 },
      });
  }

  try {
    // Build filter conditions for attendance records
    const where = {
      courseId: parseInt(courseId),
      student: {
        departmentId: parseInt(departmentId),
        classId: parseInt(classId),
        sectionId: parseInt(sectionId),
      },
    };

    // Add date filter if provided
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    // Get attendance records
    const records = await prisma.attendance.findMany({
      where,
      include: {
        student: true,
        course: true,
      },
      orderBy: [{ date: 'desc' }, { studentId: 'asc' }],
    });

    // Calculate summary statistics
    const summary = {
      present: records.filter((r) => r.status === 'Present').length,
      absent: records.filter((r) => r.status === 'Absent').length,
      late: records.filter((r) => r.status === 'Late').length,
      total: records.length,
    };

    return res.status(200).json({ records, summary });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({ error: 'Failed to fetch attendance' });
  }
}

// Update attendance status
async function updateAttendance(req, res) {
  const { id } = req.query;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Attendance ID is required' });
  }

  if (!status || !['Present', 'Absent', 'Late'].includes(status)) {
    return res
      .status(400)
      .json({ error: 'Valid status is required (Present, Absent, or Late)' });
  }

  const attendanceId = parseInt(id);

  try {
    // Check if attendance record exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id: attendanceId },
    });

    if (!existingAttendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    // Update the attendance status
    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: { status },
      include: {
        student: true,
        course: true,
      },
    });

    return res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    return res.status(500).json({ error: 'Failed to update attendance' });
  }
}
