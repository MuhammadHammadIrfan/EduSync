import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

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

    // Check if we're filtering for leave-related messages
    const filter = req.query.filter;

    // Build where clause for message query
    let whereClause = {
      receiver_id: userId,
      receiver_type: 'faculty',
    };

    // If filtering for leave-related messages
    if (filter === 'leave') {
      whereClause.subject = {
        contains: 'Leave Request',
        mode: 'insensitive',
      };
    }

    // Get messages for this faculty
    const messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: { sent_at: 'desc' },
    });

    // Enhanced message data with sender details
    const enhancedMessages = await Promise.all(
      messages.map(async (message) => {
        let senderName = 'Unknown';
        let senderEmail = '';

        if (message.sender_type === 'faculty') {
          const sender = await prisma.faculty.findUnique({
            where: { id: message.sender_id },
            select: { name: true, email: true },
          });
          if (sender) {
            senderName = sender.name;
            senderEmail = sender.email;
          }
        } else if (message.sender_type === 'admin') {
          const sender = await prisma.admin.findUnique({
            where: { id: message.sender_id },
            select: { name: true, email: true },
          });
          if (sender) {
            senderName = sender.name;
            senderEmail = sender.email;
          }
        } else if (message.sender_type === 'student') {
          const sender = await prisma.student.findUnique({
            where: { id: message.sender_id },
            select: { name: true, email: true },
          });
          if (sender) {
            senderName = sender.name;
            senderEmail = sender.email;
          }
        }

        // Check if this is a leave request message and attach leave request data if possible
        let leaveRequestData = null;
        if (message.subject.includes('Leave Request')) {
          // Try to find related leave request
          const leaveRequest = await prisma.leaveRequest.findFirst({
            where: {
              facultyId: userId,
              // Look for leave requests updated around the same time as the message
              updated_at: {
                gte: new Date(new Date(message.sent_at).getTime() - 60000), // Within a minute before message
                lte: new Date(new Date(message.sent_at).getTime() + 60000), // Within a minute after message
              },
            },
            include: {
              course: {
                select: { name: true, course_code: true },
              },
            },
            orderBy: { updated_at: 'desc' },
          });

          if (leaveRequest) {
            leaveRequestData = {
              id: leaveRequest.id,
              status: leaveRequest.status,
              leaveDate: leaveRequest.leave_date,
              course: leaveRequest.course,
            };
          }
        }

        return {
          id: message.id,
          subject: message.subject,
          content: message.body,
          sent_at: message.sent_at.toISOString(),
          sender_id: message.sender_id,
          sender_type: message.sender_type,
          sender_name: senderName,
          sender_email: senderEmail,
          read: false, // Message read status would require additional tracking
          leaveRequest: leaveRequestData, // Attach leave request data if relevant
        };
      })
    );

    return res.status(200).json(enhancedMessages);
  } catch (error) {
    console.error('Error fetching received messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
