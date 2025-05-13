import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  // Check if user is authenticated (implement proper auth check)
  // const isAuthenticated = true; // Replace with actual auth check
  // if (!isAuthenticated) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  try {
    switch (req.method) {
      case 'GET':
        return await getMessages(req, res);
      case 'POST':
        return await sendMessage(req, res);
      case 'DELETE':
        return await deleteMessage(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in messages API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get messages with optional filters
async function getMessages(req, res) {
  const { filter } = req.query;
  
  // Admin ID (in a real app, would come from auth)
  const adminId = 1;
  
  // Build filter conditions
  const where = {};
  
  if (filter === 'inbox') {
    // Messages received by admin
    where.receiver_id = adminId;
    where.receiver_type = 'admin';
  } else if (filter === 'sent') {
    // Messages sent by admin
    where.sender_id = adminId;
    where.sender_type = 'admin';
  } else {
    // All messages (both sent and received)
    where.OR = [
      { sender_id: adminId, sender_type: 'admin' },
      { receiver_id: adminId, receiver_type: 'admin' }
    ];
  }
  
  try {
    const messages = await prisma.message.findMany({
      where,
      orderBy: {
        sent_at: 'desc'
      }
    });
    
    // Enhance messages with sender and receiver names
    const enhancedMessages = await Promise.all(messages.map(async (message) => {
      let senderName = '';
      let receiverName = '';
      
      // Get sender name
      if (message.sender_type === 'student') {
        const student = await prisma.student.findUnique({
          where: { id: message.sender_id }
        });
        senderName = student ? student.name : 'Unknown Student';
      } else if (message.sender_type === 'faculty') {
        const faculty = await prisma.faculty.findUnique({
          where: { id: message.sender_id }
        });
        senderName = faculty ? faculty.name : 'Unknown Faculty';
      } else if (message.sender_type === 'admin') {
        const admin = await prisma.admin.findUnique({
          where: { id: message.sender_id }
        });
        senderName = admin ? admin.name : 'Unknown Admin';
      }
      
      // Get receiver name
      if (message.receiver_type === 'student') {
        const student = await prisma.student.findUnique({
          where: { id: message.receiver_id }
        });
        receiverName = student ? student.name : 'Unknown Student';
      } else if (message.receiver_type === 'faculty') {
        const faculty = await prisma.faculty.findUnique({
          where: { id: message.receiver_id }
        });
        receiverName = faculty ? faculty.name : 'Unknown Faculty';
      } else if (message.receiver_type === 'admin') {
        const admin = await prisma.admin.findUnique({
          where: { id: message.receiver_id }
        });
        receiverName = admin ? admin.name : 'Unknown Admin';
      }
      
      return {
        ...message,
        sender_name: senderName,
        receiver_name: receiverName
      };
    }));
    
    return res.status(200).json(enhancedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

// Send a new message
async function sendMessage(req, res) {
  const { 
    receiver_type,
    receiver_id,
    subject,
    body
  } = req.body;
  
  // Validate required fields
  if (!receiver_type || !receiver_id || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Admin ID (in a real app, would come from auth)
  const adminId = 1;
  
  try {
    // Verify that the recipient exists
    let recipientExists = false;
    
    if (receiver_type === 'student') {
      const student = await prisma.student.findUnique({
        where: { id: parseInt(receiver_id) }
      });
      recipientExists = !!student;
    } else if (receiver_type === 'faculty') {
      const faculty = await prisma.faculty.findUnique({
        where: { id: parseInt(receiver_id) }
      });
      recipientExists = !!faculty;
    } else if (receiver_type === 'admin') {
      const admin = await prisma.admin.findUnique({
        where: { id: parseInt(receiver_id) }
      });
      recipientExists = !!admin;
    }
    
    if (!recipientExists) {
      return res.status(404).json({ error: 'Recipient not found' });
    }
    
    // Create the message
    const message = await prisma.message.create({
      data: {
        sender_id: adminId,
        sender_type: 'admin',
        receiver_id: parseInt(receiver_id),
        receiver_type,
        subject,
        body
      }
    });
    
    // Get admin name
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });
    
    // Get recipient name
    let recipientName = '';
    if (receiver_type === 'student') {
      const student = await prisma.student.findUnique({
        where: { id: parseInt(receiver_id) }
      });
      recipientName = student ? student.name : 'Unknown Student';
    } else if (receiver_type === 'faculty') {
      const faculty = await prisma.faculty.findUnique({
        where: { id: parseInt(receiver_id) }
      });
      recipientName = faculty ? faculty.name : 'Unknown Faculty';
    } else if (receiver_type === 'admin') {
      const recipient = await prisma.admin.findUnique({
        where: { id: parseInt(receiver_id) }
      });
      recipientName = recipient ? recipient.name : 'Unknown Admin';
    }
    
    // Return the message with sender and receiver names
    const enhancedMessage = {
      ...message,
      sender_name: admin ? admin.name : 'Admin',
      receiver_name: recipientName
    };
    
    return res.status(201).json(enhancedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}

// Delete a message
async function deleteMessage(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Message ID is required' });
  }
  
  const messageId = parseInt(id);
  
  try {
    // Check if message exists
    const existingMessage = await prisma.message.findUnique({
      where: { id: messageId }
    });
    
    if (!existingMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Admin ID (in a real app, would come from auth)
    const adminId = 1;
    
    // Check if the admin is the sender or receiver
    if (!(
      (existingMessage.sender_id === adminId && existingMessage.sender_type === 'admin') ||
      (existingMessage.receiver_id === adminId && existingMessage.receiver_type === 'admin')
    )) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }
    
    // Delete the message
    await prisma.message.delete({
      where: { id: messageId }
    });
    
    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ error: 'Failed to delete message' });
  }
}
