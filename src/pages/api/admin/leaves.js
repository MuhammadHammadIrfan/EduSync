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
        return await getLeaveRequests(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in leave requests API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

// Get all leave requests
async function getLeaveRequests(req, res) {
  try {
    const leaveRequests = await prisma.leaveRequest.findMany({
      include: {
        faculty: true,
        department: true,
        class: true,
        section: true,
        course: true,
      },
      orderBy: [
        { status: 'asc' }, // Pending first
        { leave_date: 'asc' },
      ],
    });

    return res.status(200).json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
}
