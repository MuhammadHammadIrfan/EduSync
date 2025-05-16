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

    switch (req.method) {
      case 'GET':
        return await getMessages(req, res);
      case 'POST':
        return await sendMessage(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in messages API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

// Get messages with pagination
async function getMessages(req, res) {
  const { filter, page = 1, limit = 10 } = req.query;

  // Parse pagination parameters
  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);

  if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
    return res.status(400).json({ error: 'Invalid pagination parameters' });
  }

  // Get admin ID from session (in a real app)
  // For demo, we'll use a hardcoded admin ID
  const adminId = 1; // Replace with actual admin ID from session

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
    // If no valid filter specified, return empty result
    return res.status(200).json({ data: [], total: 0 });
  }

  try {
    // Get total count for pagination
    const total = await prisma.message.count({ where });

    // Get paginated messages
    const messages = await prisma.message.findMany({
      where,
      orderBy: { sent_at: 'desc' },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    // Enhance messages with sender and receiver names and department info
    const enhancedMessages = await Promise.all(
      messages.map(async (message) => {
        let senderName = '';
        let receiverName = '';
        let departmentName = '';
        let departmentId = null;

        // Get sender info
        if (message.sender_type === 'student') {
          const student = await prisma.student.findUnique({
            where: { id: message.sender_id },
            include: { department: true },
          });

          if (student) {
            senderName = student.name;
            departmentId = student.departmentId;
            departmentName = student.department?.name;
          } else {
            senderName = 'Unknown Student';
          }
        } else if (message.sender_type === 'faculty') {
          const faculty = await prisma.faculty.findUnique({
            where: { id: message.sender_id },
            include: { department: true },
          });

          if (faculty) {
            senderName = faculty.name;
            departmentId = faculty.departmentId;
            departmentName = faculty.department?.name;
          } else {
            senderName = 'Unknown Faculty';
          }
        } else if (message.sender_type === 'admin') {
          const admin = await prisma.admin.findUnique({
            where: { id: message.sender_id },
          });
          senderName = admin ? admin.name : 'Admin';
        }

        // Get receiver info
        if (message.receiver_type === 'student') {
          const student = await prisma.student.findUnique({
            where: { id: message.receiver_id },
            include: { department: true },
          });

          if (student) {
            receiverName = student.name;
            if (!departmentId) {
              departmentId = student.departmentId;
              departmentName = student.department?.name;
            }
          } else {
            receiverName = 'Unknown Student';
          }
        } else if (message.receiver_type === 'faculty') {
          const faculty = await prisma.faculty.findUnique({
            where: { id: message.receiver_id },
            include: { department: true },
          });

          if (faculty) {
            receiverName = faculty.name;
            if (!departmentId) {
              departmentId = faculty.departmentId;
              departmentName = faculty.department?.name;
            }
          } else {
            receiverName = 'Unknown Faculty';
          }
        } else if (message.receiver_type === 'admin') {
          const admin = await prisma.admin.findUnique({
            where: { id: message.receiver_id },
          });
          receiverName = admin ? admin.name : 'Admin';
        }

        return {
          ...message,
          sender_name: senderName,
          receiver_name: receiverName,
          department_id: departmentId,
          department_name: departmentName,
        };
      })
    );

    return res.status(200).json({
      data: enhancedMessages,
      total,
      page: pageNumber,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

// Send a new message
async function sendMessage(req, res) {
  const {
    receiver_type,
    receiver_ids,
    departmentId,
    sendToAllInDept,
    subject,
    body,
  } = req.body;

  // Basic validation
  if (!subject || !body) {
    return res
      .status(400)
      .json({ error: 'Subject and message body are required' });
  }

  // If sending to all in department, we need a department ID
  if (sendToAllInDept && !departmentId) {
    return res
      .status(400)
      .json({
        error:
          'Department ID is required when sending to all users in a department',
      });
  }

  // If not sending to all, we need specific receivers
  if (
    !sendToAllInDept &&
    (!receiver_ids || !Array.isArray(receiver_ids) || receiver_ids.length === 0)
  ) {
    return res
      .status(400)
      .json({ error: 'At least one recipient is required' });
  }

  // Get admin ID from session (in a real app)
  // For demo, we'll use a hardcoded admin ID
  const adminId = 1; // Replace with actual admin ID from session

  try {
    let recipients = [];

    // If sending to all users in a department
    if (sendToAllInDept) {
      if (receiver_type === 'student' || receiver_type === 'both') {
        // Get all students in the department
        const students = await prisma.student.findMany({
          where: { departmentId },
        });
        recipients = [
          ...recipients,
          ...students.map((s) => ({ id: s.id, type: 'student' })),
        ];
      }

      if (receiver_type === 'faculty' || receiver_type === 'both') {
        // Get all faculty in the department
        const facultyMembers = await prisma.faculty.findMany({
          where: { departmentId },
        });
        recipients = [
          ...recipients,
          ...facultyMembers.map((f) => ({ id: f.id, type: 'faculty' })),
        ];
      }
    } else {
      // Use the provided receiver_ids
      recipients = receiver_ids.map((id) => ({
        id: parseInt(id),
        type: receiver_type,
      }));
    }

    // Create messages for each recipient
    const createdMessages = [];

    for (const recipient of recipients) {
      // Create message
      const message = await prisma.message.create({
        data: {
          sender_id: adminId,
          sender_type: 'admin',
          receiver_id: recipient.id,
          receiver_type: recipient.type,
          subject,
          body,
        },
      });

      createdMessages.push(message);
    }

    if (createdMessages.length === 0) {
      return res.status(404).json({ error: 'No valid recipients found' });
    }

    return res.status(201).json({
      message: `${createdMessages.length} messages sent successfully`,
      sentCount: createdMessages.length,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
