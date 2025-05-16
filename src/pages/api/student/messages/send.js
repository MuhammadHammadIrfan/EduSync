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
    if (session.user.role !== 'student') {
      return res.status(403).json({ error: 'Forbidden - Not authorized' });
    }

    const { receiver_id, receiver_type, subject, body } = req.body;

    // Validate required fields
    if (!receiver_id || !receiver_type || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new message
    const message = await prisma.message.create({
      data: {
        sender_id: parseInt(session.user.id, 10),
        sender_type: 'student',
        receiver_id: parseInt(receiver_id, 10),
        receiver_type: receiver_type,
        subject: subject,
        body: body,
      },
    });

    return res.status(201).json({
      id: message.id,
      subject: message.subject,
      sent_at: message.sent_at.toISOString(),
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  } finally {
    await prisma.$disconnect();
  }
}
