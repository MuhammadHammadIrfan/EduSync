import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting advised leave requests fetch');

    // Get authenticated session
    const session = await getServerSession(req, res, authOptions);
    console.log('Session:', session ? 'Valid' : 'Invalid');

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get userId from query or session and ensure it's an integer
    const userId = parseInt(req.query.userId || session.user.id, 10);
    console.log('UserId for advised requests:', userId);

    // Check role
    if (session.user.role !== 'faculty' && session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Not authorized' });
    }

    // Verify the user is accessing their own data - both converted to strings for comparison
    const sessionUserId = String(session.user.id);
    const requestUserId = String(userId);

    if (sessionUserId !== requestUserId && session.user.role !== 'admin') {
      console.log(
        `User mismatch: session ID ${sessionUserId} vs requested ID ${requestUserId}`
      );
      return res
        .status(403)
        .json({ error: 'Forbidden - Not authorized to access this data' });
    }

    try {
      // Get sections where this faculty is the advisor
      console.log('Fetching sections where faculty is advisor:', userId);
      const advisedSections = await prisma.section.findMany({
        where: { advisorId: userId },
        select: { id: true },
      });

      const sectionIds = advisedSections.map((section) => section.id);
      console.log('Found advised section IDs:', sectionIds);

      // No sections advised
      if (sectionIds.length === 0) {
        console.log('No sections found for this advisor');
        return res.status(200).json([]);
      }

      try {
        // Get leave requests for sections where this faculty is the advisor
        console.log('Fetching leave requests for sections:', sectionIds);
        const leaveRequests = await prisma.leaveRequest.findMany({
          where: {
            sectionId: { in: sectionIds },
          },
          include: {
            faculty: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            department: {
              select: {
                id: true,
                name: true,
              },
            },
            class: {
              select: {
                id: true,
                name: true,
              },
            },
            section: {
              select: {
                id: true,
                name: true,
              },
            },
            course: {
              select: {
                id: true,
                name: true,
                course_code: true,
              },
            },
          },
          orderBy: [
            { status: 'asc' }, // Pending first
            { created_at: 'desc' }, // Then newest first
          ],
        });

        console.log('Found leave requests:', leaveRequests.length);

        // Format leave requests
        const formattedLeaveRequests = leaveRequests.map((request) => ({
          id: request.id,
          faculty_id: request.facultyId,
          faculty_name: request.faculty.name,
          faculty_email: request.faculty.email,
          leave_date: request.leave_date.toISOString(),
          reason: request.reason,
          status: request.status,
          submitted_at: request.created_at.toISOString(),
          updated_at: request.updated_at.toISOString(),
          department: request.department.name,
          departmentId: request.department.id,
          class: request.class.name,
          classId: request.class.id,
          section: request.section.name,
          sectionId: request.section.id,
          course: request.course.name,
          courseId: request.course.id,
          course_code: request.course.course_code,
          can_update: request.status === 'Pending', // Only pending requests can be updated
        }));

        return res.status(200).json(formattedLeaveRequests);
      } catch (leaveRequestError) {
        console.error('Error in leave requests query:', leaveRequestError);
        throw leaveRequestError; // Re-throw to be caught by outer try-catch
      }
    } catch (sectionError) {
      console.error('Error in section query:', sectionError);
      throw sectionError; // Re-throw to be caught by outer try-catch
    }
  } catch (error) {
    console.error('Error fetching advised leave requests:', error);
    console.error('Error stack:', error.stack);
    return res
      .status(500)
      .json({ error: 'Failed to fetch advised leave requests' });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting Prisma client:', disconnectError);
    }
  }
}
