import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';


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

    // Check role
    if (session.user.role !== 'student' && session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Not authorized' });
    }

    // Get userId from query or session
    const userId = parseInt(req.query.userId || session.user.id, 10);

    // Verify the user is accessing their own data
    if (
      session.user.id.toString() !== userId.toString() &&
      session.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ error: 'Forbidden - Not authorized to access this data' });
    }

    const student = await prisma.student.findUnique({
      where: { id: userId },
      include: {
        department: true,
        class: {
          include: {
            ClassEnrollment: {
              include: {
                course: {
                  include: {
                    schedules: {
                      include: {
                        faculty: true,
                        section: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        section: true,
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Ensure this is correctly mapping the ClassEnrollment data

    // Replace the current enrolledCourses mapping in the profile object

    const profile = {
      id: student.id,
      studentId: student.id.toString(),
      name: student.name,
      email: student.email,
      department: student.department.name,
      class: student.class.name,
      section: student.section.name,
      enrollmentDate: student.created_at
        ? new Date(student.created_at).toLocaleDateString()
        : 'N/A',
      // Default payment info since it's not in the database yet
      paymentStatus: 'Pending',
      invoiceNumber: 'INV-' + student.id + '-2025',
      feeAmount: '2,500.00',
      feeDueDate: 'May 30, 2025',
      enrolledCourses:
        student.class.ClassEnrollment?.map((enrollment) => {
          // Get schedules for this course that match the student's section
          const courseSchedules =
            enrollment.course.schedules
              ?.filter((s) => s.sectionId === student.sectionId)
              ?.map((s) => {
                const startTime = new Date(s.start_time).toLocaleTimeString(
                  'en-US',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                );
                const endTime = new Date(s.end_time).toLocaleTimeString(
                  'en-US',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                );
                return `${s.day_of_week} ${startTime}-${endTime}`;
              }) || [];

          // Get faculty names for this course
          const facultyNames =
            [
              ...new Set(
                enrollment.course.schedules
                  ?.filter(
                    (s) => s.sectionId === student.sectionId && s.faculty
                  )
                  ?.map((s) => s.faculty.name)
              ),
            ] || [];

          return {
            id: enrollment.course.id,
            name: enrollment.course.name,
            code: enrollment.course.course_code || '',
            creditHours: enrollment.course.credit_hours || 0,
            schedule: courseSchedules,
            faculty: facultyNames.length > 0 ? facultyNames[0] : 'Not assigned',
          };
        }) || [],
    };
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
}