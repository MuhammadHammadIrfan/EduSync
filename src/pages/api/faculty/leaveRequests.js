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

    // Get leave requests for this faculty
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { facultyId: userId },
      include: {
        faculty: {
          select: {
            name: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
        class: {
          select: {
            name: true,
          },
        },
        section: {
          select: {
            name: true,
          },
        },
        course: {
          select: {
            name: true,
            course_code: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Format leave requests
    const formattedLeaveRequests = leaveRequests.map((request) => ({
      id: request.id,
      faculty_id: request.facultyId,
      start_date: request.leave_date.toISOString(),
      end_date: new Date(
        request.leave_date.getTime() + 24 * 60 * 60 * 1000
      ).toISOString(), // Next day as end date
      reason: request.reason,
      status: request.status,
      submitted_at: request.created_at.toISOString(),
      approved_by: null, // This would come from an admin or department head
      approved_at: null, // This would be set when approved
      comments: null, // This would be set when approved/rejected
      department: request.department.name,
      class: request.class.name,
      section: request.section.name,
      course: request.course.name,
      course_code: request.course.course_code,
    }));

    return res.status(200).json(formattedLeaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return res.status(500).json({ error: 'Failed to fetch leave requests' });
  } finally {
    await prisma.$disconnect();
  }
}
