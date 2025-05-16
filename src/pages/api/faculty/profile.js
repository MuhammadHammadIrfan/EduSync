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

    // Get userId from query or session
    const userId = parseInt(req.query.userId || session.user.id, 10);

    // Check role
    if (session.user.role !== 'faculty' && session.user.role !== 'admin') {
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

    // Find faculty data
    const faculty = await prisma.faculty.findUnique({
      where: { id: userId },
      include: {
        department: {
          select: {
            name: true,
            code: true,
          },
        },
        courses: {
          include: {
            course: {
              select: {
                name: true,
                course_code: true,
                credit_hours: true,
                departmentId: true,
              },
            },
          },
        },
        sections: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Format response data
    const formattedFaculty = {
      id: faculty.id,
      name: faculty.name,
      email: faculty.email,
      department: faculty.department.name,
      departmentId: faculty.departmentId,
      designation: 'Associate Professor', // You can add this field to your schema later
      specialization: 'Computer Science', // You can add this field to your schema later
      office_hours: 'Monday, Wednesday: 2-4 PM', // You can add this field to your schema later
      office_location: 'CS Building, Room 305', // You can add this field to your schema later
      phone: '+1234567890', // You can add this field to your schema later
      courses: faculty.courses.map((entry) => ({
        id: entry.course.id,
        name: entry.course.name,
        course_code: entry.course.course_code,
        credit_hours: entry.course.credit_hours,
      })),
      sections: faculty.sections.map((section) => ({
        id: section.id,
        name: section.name,
        class_name: section.class.name,
      })),
    };

    return res.status(200).json(formattedFaculty);
  } catch (error) {
    console.error('Error fetching faculty profile:', error);
    return res.status(500).json({ error: 'Failed to fetch faculty profile' });
  } finally {
    await prisma.$disconnect();
  }
}
