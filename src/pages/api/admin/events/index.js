import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // GET - fetch events
    if (req.method === 'GET') {
      const { audienceTypes, eventDates } = req.query;

      let whereClause = {};

      // Filter by audience type
      if (audienceTypes && audienceTypes.length > 0) {
        whereClause.audiences = {
          some: {
            audience_type: {
              in: Array.isArray(audienceTypes)
                ? audienceTypes
                : [audienceTypes],
            },
          },
        };
      }

      // Filter by event dates
      if (eventDates && eventDates.length > 0) {
        const dates = Array.isArray(eventDates) ? eventDates : [eventDates];

        if (dates.length > 0) {
          whereClause.event_date = {
            in: dates.map((date) => new Date(date)),
          };
        }
      }

      // Replace lines 41-57 (the findMany query and related code) with this:

      // Get pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10; // 10 events per page
      const skip = (page - 1) * limit;

      // Get events with pagination
      const [events, totalCount] = await prisma.$transaction([
        prisma.event.findMany({
          where: whereClause,
          include: {
            audiences: true,
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { event_date: 'asc' },
          skip: skip,
          take: limit,
        }),
        prisma.event.count({
          where: whereClause,
        }),
      ]);

      // Transform the data for frontend
      const transformedEvents = events.map((event) => {
        // Find the primary audience (first one, or 'all' if none)
        const primaryAudience =
          event.audiences && event.audiences.length > 0
            ? event.audiences[0]
            : { audience_type: 'all', audience_id: null };

        return {
          id: event.id,
          title: event.title,
          description: event.description,
          event_date: event.event_date.toISOString(),
          created_by_admin: event.created_by_admin,
          admin: event.admin,
          audience_type: primaryAudience.audience_type,
          audience_id: primaryAudience.audience_id,
          // Include all audiences for reference
          audiences: event.audiences,
        };
      });

      // Return paginated response
      return res.status(200).json({
        events: transformedEvents,
        pagination: {
          total: totalCount,
          page: page,
          limit: limit,
          pages: Math.ceil(totalCount / limit),
        },
      });
  
      return res.status(200).json(transformedEvents);
    }

    // POST - create event
    else if (req.method === 'POST') {
      const {
        title,
        description,
        event_date,
        audience_type = 'all',
        audience_id,
      } = req.body;

      if (!title || !description || !event_date) {
        return res
          .status(400)
          .json({ message: 'Title, description, and event date are required' });
      }

      const adminId = session.user.id;

      // Create event with audience in a transaction
      const event = await prisma.$transaction(async (tx) => {
        // Create the event
        const newEvent = await tx.event.create({
          data: {
            title,
            description,
            event_date: new Date(event_date),
            created_by_admin: adminId,
            audiences: {
              create: {
                audience_type,
                audience_id: audience_id ? parseInt(audience_id, 10) : 0,
              },
            },
          },
          include: {
            audiences: true,
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        return newEvent;
      });

      // Transform for response
      const primaryAudience =
        event.audiences && event.audiences.length > 0
          ? event.audiences[0]
          : { audience_type: 'all', audience_id: null };

      const transformedEvent = {
        id: event.id,
        title: event.title,
        description: event.description,
        event_date: event.event_date.toISOString(),
        created_by_admin: event.created_by_admin,
        admin: event.admin,
        audience_type: primaryAudience.audience_type,
        audience_id: primaryAudience.audience_id,
        audiences: event.audiences,
      };

      return res.status(201).json(transformedEvent);
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Error fetching events' });
  } finally {
    await prisma.$disconnect();
  }
}
