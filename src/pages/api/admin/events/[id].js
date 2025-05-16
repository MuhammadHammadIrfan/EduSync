import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  const eventId = parseInt(id, 10);

  if (isNaN(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  // PUT - update event
  if (req.method === 'PUT') {
    try {
      const { title, description, event_date, audience_type, audience_id } =
        req.body;

      // Validate required fields
      if (!title || !description || !event_date) {
        return res
          .status(400)
          .json({ message: 'Title, description, and event date are required' });
      }

      // Update event and audience in transaction
      await prisma.$transaction(async (tx) => {
        // Update event
        await tx.event.update({
          where: { id: eventId },
          data: {
            title,
            description,
            event_date: new Date(event_date),
            updated_at: new Date(),
          },
        });

        // Handle audience
        if (audience_type) {
          const existingAudience = await tx.eventAudience.findFirst({
            where: { eventId },
          });

          if (existingAudience) {
            await tx.eventAudience.update({
              where: { id: existingAudience.id },
              data: {
                audience_type,
                audience_id: audience_id ? parseInt(audience_id, 10) : 0,
              },
            });
          } else {
            await tx.eventAudience.create({
              data: {
                eventId,
                audience_type,
                audience_id: audience_id ? parseInt(audience_id, 10) : 0,
              },
            });
          }
        }
      });

      // Get updated event
      const updatedEvent = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          eventAudience: true,
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Transform for response
      const transformedEvent = {
        id: updatedEvent.id,
        title: updatedEvent.title,
        description: updatedEvent.description,
        event_date: updatedEvent.event_date.toISOString(),
        created_by_admin: updatedEvent.created_by_admin,
        admin: updatedEvent.admin,
        audience_type: updatedEvent.eventAudience?.audience_type || 'all',
        audience_id: updatedEvent.eventAudience?.audience_id || null,
      };

      return res.status(200).json(transformedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      return res.status(500).json({ message: 'Error updating event' });
    } finally {
      await prisma.$disconnect();
    }
  }

  // DELETE - delete event
  else if (req.method === 'DELETE') {
    try {
      await prisma.$transaction(async (tx) => {
        // Delete event audiences first
        await tx.eventAudience.deleteMany({
          where: { eventId },
        });

        // Delete the event
        await tx.event.delete({
          where: { id: eventId },
        });
      });

      return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      return res.status(500).json({ message: 'Error deleting event' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
