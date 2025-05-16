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

    // Find received messages
    const messages = await prisma.message.findMany({
      where: {
        receiver_id: userId,
        receiver_type: 'student',
      },
      orderBy: {
        sent_at: 'desc',
      },
    });

    // Format messages with sender info
    const formattedMessages = await Promise.all(
      messages.map(async (message) => {
        let senderName = 'Unknown';
        let senderEmail = '';

        // Get sender info based on sender_type
        if (message.sender_type === 'faculty') {
          const faculty = await prisma.faculty.findUnique({
            where: { id: message.sender_id },
          });
          if (faculty) {
            senderName = faculty.name;
            senderEmail = faculty.email;
          }
        } else if (message.sender_type === 'admin') {
          const admin = await prisma.admin.findUnique({
            where: { id: message.sender_id },
          });
          if (admin) {
            senderName = admin.name;
            senderEmail = admin.email;
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
          read: false, // We'll add read status in a future update
        };
      })
    );

    return res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Error fetching received messages:', error);
    return res.status(200).json([]); // Return empty array instead of error
  } finally {
    await prisma.$disconnect();
  }
}
