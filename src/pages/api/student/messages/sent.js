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

    // Find sent messages
    const messages = await prisma.message.findMany({
      where: {
        sender_id: userId,
        sender_type: 'student',
      },
      orderBy: {
        sent_at: 'desc',
      },
    });

    // Format messages with recipient info
    const formattedMessages = await Promise.all(
      messages.map(async (message) => {
        let recipientName = 'Unknown';
        let recipientEmail = '';

        // Get recipient info based on receiver_type
        if (message.receiver_type === 'faculty') {
          const faculty = await prisma.faculty.findUnique({
            where: { id: message.receiver_id },
          });
          if (faculty) {
            recipientName = faculty.name;
            recipientEmail = faculty.email;
          }
        } else if (message.receiver_type === 'admin') {
          const admin = await prisma.admin.findUnique({
            where: { id: message.receiver_id },
          });
          if (admin) {
            recipientName = admin.name;
            recipientEmail = admin.email;
          }
        } else if (message.receiver_type === 'student') {
          const student = await prisma.student.findUnique({
            where: { id: message.receiver_id },
          });
          if (student) {
            recipientName = student.name;
            recipientEmail = student.email;
          }
        }

        return {
          id: message.id,
          subject: message.subject,
          content: message.body,
          sent_at: message.sent_at.toISOString(),
          recipient_id: message.receiver_id,
          recipient_type: message.receiver_type,
          recipient_name: recipientName,
          recipient_email: recipientEmail,
        };
      })
    );

    return res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    return res.status(200).json([]); // Return empty array instead of error
  } finally {
    await prisma.$disconnect();
  }
}
