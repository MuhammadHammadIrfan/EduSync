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

    // Only allow DELETE method
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    return await deleteMessage(parseInt(id), req, res);
  } catch (error) {
    console.error('Error in message API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

// Delete a message
async function deleteMessage(messageId, req, res) {
  try {
    // Get admin ID from session (in a real app)
    // For demo, we'll use a hardcoded admin ID
    const adminId = 1; // Replace with actual admin ID from session

    // Check if message exists
    const existingMessage = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!existingMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if the admin is the sender or receiver
    if (
      !(
        (existingMessage.sender_id === adminId &&
          existingMessage.sender_type === 'admin') ||
        (existingMessage.receiver_id === adminId &&
          existingMessage.receiver_type === 'admin')
      )
    ) {
      return res
        .status(403)
        .json({ error: 'Not authorized to delete this message' });
    }

    // Delete the message
    await prisma.message.delete({
      where: { id: messageId },
    });

    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ error: 'Failed to delete message' });
  }
}
