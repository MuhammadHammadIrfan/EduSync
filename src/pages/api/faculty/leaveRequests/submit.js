import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { generateLeaveRequestMessage } from '../../../../../utils/gemini';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting leave request submission...');

    // Get authenticated session
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check role
    if (session.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Forbidden - Not authorized' });
    }

    const {
      facultyId,
      startDate,
      reason,
      departmentId,
      classId,
      sectionId,
      courseId,
    } = req.body;

    console.log('Request body:', {
      facultyId,
      startDate,
      reason,
      departmentId,
      classId,
      sectionId,
      courseId,
    });

    // Verify the user is submitting their own data
    if (session.user.id.toString() !== facultyId.toString()) {
      return res
        .status(403)
        .json({ error: 'Forbidden - Not authorized to submit this data' });
    }

    console.log('Fetching section information for sectionId:', sectionId);

    // Get section information including advisor ID
    const sectionInfo = await prisma.section.findUnique({
      where: { id: parseInt(sectionId, 10) },
      include: {
        advisor: true,
      },
    });

    if (!sectionInfo) {
      return res.status(404).json({ error: 'Section not found' });
    }

    console.log('Section info:', JSON.stringify(sectionInfo, null, 2));
    console.log('Section advisor ID:', sectionInfo.advisorId);

    // Get faculty information
    const faculty = await prisma.faculty.findUnique({
      where: { id: parseInt(facultyId, 10) },
      include: {
        department: true,
      },
    });

    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    console.log('Faculty info:', {
      name: faculty.name,
      email: faculty.email,
      department: faculty.department.name,
    });

    // Get class information
    const classInfo = await prisma.class.findUnique({
      where: { id: parseInt(classId, 10) },
    });

    if (!classInfo) {
      return res.status(404).json({ error: 'Class not found' });
    }

    console.log('Class info:', { name: classInfo.name });

    // Get course information
    const courseInfo = await prisma.course.findUnique({
      where: { id: parseInt(courseId, 10) },
    });

    if (!courseInfo) {
      return res.status(404).json({ error: 'Course not found' });
    }

    console.log('Course info:', {
      name: courseInfo.name,
      code: courseInfo.course_code,
    });

    // Create leave request
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        facultyId: parseInt(facultyId, 10),
        departmentId: parseInt(departmentId, 10),
        classId: parseInt(classId, 10),
        sectionId: parseInt(sectionId, 10),
        courseId: parseInt(courseId, 10),
        leave_date: new Date(startDate),
        reason,
        status: 'Pending',
      },
    });

    console.log('Leave request created:', leaveRequest.id);

    // Prepare data for Gemini message generation
    const leaveData = {
      faculty: {
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
      },
      department: {
        id: faculty.department.id,
        name: faculty.department.name,
      },
      className: classInfo.name,
      section: sectionInfo.name,
      course: {
        id: courseInfo.id,
        name: courseInfo.name,
        code: courseInfo.course_code,
      },
      leaveDate: startDate,
      reason,
      status: 'Pending',
    };

    console.log('Data for Gemini:', JSON.stringify(leaveData, null, 2));

    // Generate message with Gemini
    console.log('Generating message with Gemini...');
    const messageContent = await generateLeaveRequestMessage(leaveData);
    console.log('Generated message content:', messageContent);

    // Send notification to the section advisor (not a random faculty)
    const advisorId = sectionInfo.advisorId;

    if (advisorId && advisorId !== faculty.id) {
      console.log(`Sending notification to section advisor (ID: ${advisorId})`);

      await prisma.message.create({
        data: {
          sender_id: faculty.id,
          sender_type: 'faculty',
          receiver_id: advisorId,
          receiver_type: 'faculty',
          subject: messageContent.subject,
          body: messageContent.body,
        },
      });

      console.log('Notification sent to advisor successfully');
    } else {
      console.log('Section advisor is same as requesting faculty or not set');
    }

    return res.status(201).json({
      id: leaveRequest.id,
      message: 'Leave request submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting leave request:', error);
    console.error('Error details:', error.stack);
    return res
      .status(500)
      .json({
        error: 'Failed to submit leave request',
        details: error.message,
      });
  } finally {
    await prisma.$disconnect();
  }
}
