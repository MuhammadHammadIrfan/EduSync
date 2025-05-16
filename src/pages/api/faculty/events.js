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

    // Get faculty data to determine their department
    const faculty = await prisma.faculty.findUnique({
      where: { id: userId },
      select: {
        departmentId: true,
      },
    });

    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Get current date
    const today = new Date();

    // Find all events that:
    // 1. Have a future date
    // 2. Are relevant to the faculty (by audience type)
    const events = await prisma.event.findMany({
      where: {
        event_date: {
          gte: today,
        },
        audiences: {
          some: {
            OR: [
              { audience_type: 'faculty' },
              { audience_type: 'all' },
              {
                audience_type: 'department',
                audience_id: faculty.departmentId,
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

    // Transform events data
    const formattedEvents = events.map((event) => {
      // Determine if the event is for faculty's department
      const isDepartmentSpecific = event.audiences.some(
        (a) =>
          a.audience_type === 'department' &&
          a.audience_id === faculty.departmentId
      );

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
        title: event.title,
        description: event.description,
        event_date: event.event_date.toISOString(),
        date: date,
        time: time,
        formattedDate: eventDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        category: 'Academic', // You can extend this field from your schema
        location: 'Main Campus', // You can extend this field from your schema
        organizer: event.admin.name,
        department_id: isDepartmentSpecific ? faculty.departmentId : null,
        is_mandatory: false, // You can extend this field from your schema
        registration_required: false, // You can extend this field from your schema
        tags: ['event'], // You can extend this field from your schema
      };
    });

    return res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Failed to fetch events' });
  } finally {
    await prisma.$disconnect();
  }
}
