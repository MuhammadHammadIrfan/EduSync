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

    // Get userId from query or session - MOVED THIS UP
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

    // Get student data to determine their department, class
    const student = await prisma.student.findUnique({
      where: { id: userId },
      select: {
        departmentId: true,
        classId: true,
      },
    });

    if (!student) {
      // Return empty array instead of error
      return res.status(200).json([]);
    }

    // Get current date
    const today = new Date();

    // Try to find events
    let events = [];
    try {
      // Find all events that are relevant to the student
      events = await prisma.event.findMany({
        where: {
          event_date: {
            gte: today,
          },
          audiences: {
            some: {
              OR: [
                { audience_type: 'student' },
                { audience_type: 'all' },
                {
                  audience_type: 'department',
                  audience_id: student.departmentId,
                },
                {
                  audience_type: 'class',
                  audience_id: student.classId,
                },
              ],
            },
          },
        },
        include: {
          admin: {
            select: {
              name: true,
            },
          },
          audiences: true,
        },
        orderBy: { event_date: 'asc' },
      });
    } catch (error) {
      console.error('Error finding events:', error);
      // If model doesn't exist yet, return empty array
      return res.status(200).json([]);
    }

    // If no events found, return empty array
    if (!events || events.length === 0) {
      return res.status(200).json([]);
    }

    // Transform events data
    const formattedEvents = events.map((event) => {
      // Determine if the event is for student's department
      const isDepartmentSpecific =
        event.audiences?.some(
          (a) =>
            a.audience_type === 'department' &&
            a.audience_id === student.departmentId
        ) || false;

      // Format date and time
      const eventDate = new Date(event.event_date);
      const date = eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const time = eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        id: event.id,
        title: event.title || 'Untitled Event',
        description: event.description || 'No description available',
        event_date: event.event_date.toISOString(),
        date: date,
        time: time,
        formattedDate: eventDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        category: event.category || 'Academic',
        location: event.location || 'Main Campus',
        organizer: event.admin?.name || 'University Administration',
        department_id: isDepartmentSpecific ? student.departmentId : null,
        is_mandatory: event.is_mandatory || false,
        registration_required: event.registration_required || false,
        tags: event.tags || ['event'],
      };
    });

    return res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return empty array instead of error
    return res.status(200).json([]);
  } finally {
    await prisma.$disconnect();
  }
}
