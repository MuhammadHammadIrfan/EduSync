import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import {
  generateLeaveStatusUpdateMessage,
  generateStudentLeaveNotification,
} from '../../../../../utils/gemini.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Begin processing leave request status update');

    // Get authenticated session
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if faculty role
    if (session.user.role !== 'faculty' && session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Not authorized' });
    }

    const { leaveRequestId, status, comments } = req.body;

    console.log(
      `Updating leave request ${leaveRequestId} to status: ${status}, comments: ${
        comments || 'none'
      }`
    );

    // Ensure leaveRequestId is proper and parsed
    const parsedLeaveRequestId = parseInt(leaveRequestId, 10);
    if (isNaN(parsedLeaveRequestId)) {
      return res.status(400).json({ error: 'Invalid leave request ID' });
    }

    // Validate status
    if (!['Approved', 'Rejected'].includes(status)) {
      return res
        .status(400)
        .json({ error: 'Invalid status. Must be Approved or Rejected' });
    }

    // Get the leave request with all related entities
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: parsedLeaveRequestId },
      include: {
        faculty: {
          include: {
            department: true,
          },
        },
        department: true,
        class: true,
        section: true,
        course: true,
      },
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    console.log(
      `Found leave request for faculty ${leaveRequest.faculty.name}, course ${leaveRequest.course.name}`
    );

    // Verify the faculty is the advisor for this section
    const sectionInfo = await prisma.section.findUnique({
      where: { id: leaveRequest.sectionId },
      select: { advisorId: true },
    });

    if (!sectionInfo) {
      return res
        .status(404)
        .json({ error: 'Section not found for this leave request' });
    }

    // Only section advisor or admin can update status
    const isAdvisor = sectionInfo.advisorId === parseInt(session.user.id, 10);
    const isAdmin = session.user.role === 'admin';

    if (!isAdvisor && !isAdmin) {
      return res.status(403).json({
        error:
          'Forbidden - Only section advisor or admin can update leave request status',
      });
    }

    // Update the leave request status
    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { id: parsedLeaveRequestId },
      data: {
        status,
        updated_at: new Date(),
      },
    });

    console.log(`Updated leave request status to ${status}`);

    // Prepare data for Gemini message generation
    const leaveData = {
      faculty: {
        id: leaveRequest.faculty.id,
        name: leaveRequest.faculty.name,
        email: leaveRequest.faculty.email,
      },
      department: {
        id: leaveRequest.department.id,
        name: leaveRequest.department.name,
      },
      className: leaveRequest.class.name,
      section: leaveRequest.section.name,
      course: {
        id: leaveRequest.course.id,
        name: leaveRequest.course.name,
        code: leaveRequest.course.course_code,
      },
      leaveDate: leaveRequest.leave_date,
      reason: leaveRequest.reason,
      status,
      comments,
    };

    try {
      // 1. Generate status update message for the faculty using Gemini
      console.log('Generating faculty notification message with Gemini');
      const facultyMessage = await generateLeaveStatusUpdateMessage(leaveData);

      // Create default message in case Gemini fails
      const defaultFacultyMessage = {
        subject: `Leave Request ${status}`,
        body: `Dear ${leaveRequest.faculty.name},\n\nYour leave request for ${
          leaveRequest.course.course_code
        } (${leaveRequest.course.name}) on ${new Date(
          leaveRequest.leave_date
        ).toLocaleDateString()} has been ${status.toLowerCase()}.\n\n${
          comments ? `Comments: ${comments}\n\n` : ''
        }Regards,\nAcademic Department`,
      };

      // Send status update notification to the requesting faculty
      console.log('Creating message for faculty');
      await prisma.message.create({
        data: {
          sender_id: parseInt(session.user.id, 10),
          sender_type: 'faculty',
          receiver_id: leaveRequest.facultyId,
          receiver_type: 'faculty',
          subject: facultyMessage.subject || defaultFacultyMessage.subject,
          body: facultyMessage.body || defaultFacultyMessage.body,
          sent_at: new Date(),
        },
      });

      console.log('Faculty notification sent successfully');

      // Only notify students if the leave request is APPROVED
      // In the student notification section:
      if (status === 'Approved') {
        console.log('Status is approved, fetching students to notify');

        try {
          // 2. Generate notification for students
          console.log('Generating student notification message with Gemini');
          const studentMessage = await generateStudentLeaveNotification(
            leaveData
          );
          console.log('Generated student notification:', studentMessage);

          // Create default message in case Gemini fails
          const defaultStudentMessage = {
            subject: `Class Cancellation: ${
              leaveRequest.course.course_code
            } on ${new Date(leaveRequest.leave_date).toLocaleDateString()}`,
            body: `Dear Students,\n\nThis is to inform you that the ${
              leaveRequest.course.course_code
            } (${leaveRequest.course.name}) class scheduled on ${new Date(
              leaveRequest.leave_date
            ).toLocaleDateString()} has been cancelled due to faculty leave.\n\nFaculty: ${
              leaveRequest.faculty.name
            }\nDepartment: ${leaveRequest.department.name}\nClass: ${
              leaveRequest.class.name
            }\nSection: ${
              leaveRequest.section.name
            }\n\nPlease plan accordingly.\n\nRegards,\nAcademic Department`,
          };

          // 3. Fetch all students from the section
          console.log(
            `Section ID: ${leaveRequest.sectionId}, Class ID: ${leaveRequest.classId}`
          );
          const sectionStudents = await prisma.student.findMany({
            where: {
              sectionId: leaveRequest.sectionId,
              classId: leaveRequest.classId,
            },
            select: { id: true, name: true, email: true },
          });

          console.log(
            `Found ${sectionStudents.length} students for this section/class`
          );

          // Debug block to check if we can find any students
          if (sectionStudents.length === 0) {
            // Let's check if there are any students at all
            const anyStudents = await prisma.student.count();
            console.log(`Total students in the database: ${anyStudents}`);

            // Check if there are students with just the sectionId
            const sectionOnlyStudents = await prisma.student.count({
              where: { sectionId: leaveRequest.sectionId },
            });
            console.log(
              `Students in just this section (${leaveRequest.sectionId}): ${sectionOnlyStudents}`
            );

            // Check if there are students with just the classId
            const classOnlyStudents = await prisma.student.count({
              where: { classId: leaveRequest.classId },
            });
            console.log(
              `Students in just this class (${leaveRequest.classId}): ${classOnlyStudents}`
            );

            // Try a more flexible query to see if we can find students
            console.log(
              'Attempting to find students with a more flexible query...'
            );
            const flexibleQueryStudents = await prisma.student.findMany({
              take: 5, // Just get a few for testing
              select: { id: true, name: true, sectionId: true, classId: true },
            });
            console.log('Sample students:', flexibleQueryStudents);
          } else {
            console.log('First few students:', sectionStudents.slice(0, 2));
          }

          // 4. Create messages for all students in the section
          if (sectionStudents && sectionStudents.length > 0) {
            console.log(
              `Preparing messages for ${sectionStudents.length} students`
            );

            const studentMessages = sectionStudents.map((student) => ({
              sender_id: parseInt(session.user.id, 10), // Fix: Parse to integer
              sender_type: 'faculty',
              receiver_id: student.id,
              receiver_type: 'student',
              subject: studentMessage.subject || defaultStudentMessage.subject,
              body: studentMessage.body || defaultStudentMessage.body,
              sent_at: new Date(),
            }));

            console.log(`First student message sample:`, studentMessages[0]);

            try {
              // Create all student notifications in bulk
              const result = await prisma.message.createMany({
                data: studentMessages,
              });

              console.log(
                `Created ${result.count} student notification messages successfully`
              );
            } catch (createError) {
              console.error(
                'Error creating student messages in bulk:',
                createError
              );
              console.error('Error details:', createError.message);

              // Try creating messages one by one as fallback
              console.log('Trying to create messages individually instead...');
              let successCount = 0;

              for (const msgData of studentMessages) {
                try {
                  await prisma.message.create({
                    data: {
                      ...msgData,
                      sender_id: parseInt(msgData.sender_id, 10), // Ensure integer here too
                    },
                  });
                  successCount++;
                } catch (individualError) {
                  console.error(
                    `Failed to create message for student ${msgData.receiver_id}:`,
                    individualError
                  );
                }
              }

              console.log(
                `Created ${successCount} out of ${studentMessages.length} messages individually`
              );
            }
          } else {
            console.warn(
              `No students found for section ${leaveRequest.sectionId} and class ${leaveRequest.classId}`
            );
          }
        } catch (studentNotificationError) {
          console.error(
            'Error in student notification process:',
            studentNotificationError
          );
          console.error('Error stack:', studentNotificationError.stack);
        }
      }
    } catch (notificationError) {
      // Add this catch block to properly close the try block
      console.error('Error in notification process:', notificationError);
      console.error('Notification error stack:', notificationError.stack);
      // Continue execution to return success for the status update
    }

    return res.status(200).json({
      message: `Leave request ${status.toLowerCase()} successfully`,
      leaveRequest: updatedLeaveRequest,
    });
  } catch (error) {
    console.error('Error updating leave request status:', error);
    console.error('Error stack:', error.stack);
    return res
      .status(500)
      .json({ error: 'Failed to update leave request status' });
  } finally {
    await prisma.$disconnect();
  }
}
