import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    // Authentication check
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'PUT') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    const leaveId = parseInt(id);

    if (isNaN(leaveId)) {
      return res.status(400).json({ error: 'Invalid leave request ID' });
    }

    // Check if leave request exists
    const existingLeave = await prisma.leaveRequest.findUnique({
      where: { id: leaveId },
    });

    if (!existingLeave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    // Update the leave request status to Rejected
    const updatedLeave = await prisma.leaveRequest.update({
      where: { id: leaveId },
      data: { status: 'Rejected' },
      include: {
        faculty: true,
        department: true,
        class: true,
        section: true,
        course: true,
      },
    });

    return res.status(200).json(updatedLeave);
  } catch (error) {
    console.error('Error rejecting leave request:', error);
    return res.status(500).json({ error: 'Failed to reject leave request' });
  } finally {
    await prisma.$disconnect();
  }
}
