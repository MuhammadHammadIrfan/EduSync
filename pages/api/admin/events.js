import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  // Check if user is authenticated (implement proper auth check)
  // const isAuthenticated = true; // Replace with actual auth check
  // if (!isAuthenticated) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  try {
    switch (req.method) {
      case 'GET':
        return await getEvents(req, res);
      case 'POST':
        return await createEvent(req, res);
      case 'PUT':
        return await updateEvent(req, res);
      case 'DELETE':
        return await deleteEvent(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in events API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get events with optional filters
async function getEvents(req, res) {
  const { title, audience_type, date_from, date_to } = req.query;
  
  // Build filter conditions
  const where = {};
  
  if (title) {
    where.title = {
      contains: title,
      mode: 'insensitive'
    };
  }
  
  // Date range filter
  if (date_from || date_to) {
    where.event_date = {};
    
    if (date_from) {
      where.event_date.gte = new Date(date_from);
    }
    
    if (date_to) {
      where.event_date.lte = new Date(date_to);
    }
  }
  
  // Audience type filter
  if (audience_type) {
    where.audiences = {
      some: {
        audience_type: audience_type
      }
    };
  }
  
  try {
    const events = await prisma.event.findMany({
      where,
      include: {
        admin: true,
        audiences: true
      },
      orderBy: {
        event_date: 'asc'
      }
    });
    
    // Transform the data to include audience_type and audience_id directly in the event
    const transformedEvents = events.map(event => {
      const audience = event.audiences.length > 0 ? event.audiences[0] : null;
      
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        created_by_admin: event.created_by_admin,
        created_at: event.created_at,
        updated_at: event.updated_at,
        admin: event.admin ? {
          id: event.admin.id,
          name: event.admin.name,
          email: event.admin.email
        } : null,
        audience_type: audience ? audience.audience_type : 'all',
        audience_id: audience ? audience.audience_id : null
      };
    });
    
    return res.status(200).json(transformedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}

// Create a new event
async function createEvent(req, res) {
  const { 
    title, 
    description, 
    event_date, 
    audience_type = 'all', 
    audience_id 
  } = req.body;
  
  // Validate required fields
  if (!title || !description || !event_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Get current admin ID (should come from authentication)
  const adminId = 1; // TEMP: Hard-coded for mock
  
  try {
    // Create event and its audience in a transaction
    const event = await prisma.$transaction(async (prisma) => {
      // Create the event
      const newEvent = await prisma.event.create({
        data: {
          title,
          description,
          event_date: new Date(event_date),
          created_by_admin: adminId,
          admin: {
            connect: { id: adminId }
          }
        }
      });
      
      // Create the audience record
      await prisma.eventAudience.create({
        data: {
          eventId: newEvent.id,
          audience_type,
          audience_id: audience_id ? parseInt(audience_id) : 0
        }
      });
      
      return newEvent;
    });
    
    // Fetch the complete event with its audience
    const completeEvent = await prisma.event.findUnique({
      where: { id: event.id },
      include: {
        admin: true,
        audiences: true
      }
    });
    
    // Transform to include audience info directly
    const audience = completeEvent.audiences.length > 0 ? completeEvent.audiences[0] : null;
    
    const transformedEvent = {
      ...completeEvent,
      audience_type: audience ? audience.audience_type : 'all',
      audience_id: audience ? audience.audience_id : null
    };
    
    return res.status(201).json(transformedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ error: 'Failed to create event' });
  }
}

// Update an existing event
async function updateEvent(req, res) {
  const { id } = req.query;
  const { 
    title, 
    description, 
    event_date, 
    audience_type, 
    audience_id 
  } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Event ID is required' });
  }
  
  const eventId = parseInt(id);
  
  try {
    // Update event and audience in a transaction
    await prisma.$transaction(async (prisma) => {
      // Update the event
      await prisma.event.update({
        where: { id: eventId },
        data: {
          title,
          description,
          event_date: event_date ? new Date(event_date) : undefined,
          updated_at: new Date()
        }
      });
      
      // If audience type is provided, update or create the audience record
      if (audience_type) {
        // Get existing audience
        const existingAudience = await prisma.eventAudience.findFirst({
          where: { eventId }
        });
        
        if (existingAudience) {
          // Update existing audience
          await prisma.eventAudience.update({
            where: { id: existingAudience.id },
            data: {
              audience_type,
              audience_id: audience_id ? parseInt(audience_id) : 0
            }
          });
        } else {
          // Create new audience
          await prisma.eventAudience.create({
            data: {
              eventId,
              audience_type,
              audience_id: audience_id ? parseInt(audience_id) : 0
            }
          });
        }
      }
    });
    
    // Fetch the updated event
    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        admin: true,
        audiences: true
      }
    });
    
    // Transform to include audience info directly
    const audience = updatedEvent.audiences.length > 0 ? updatedEvent.audiences[0] : null;
    
    const transformedEvent = {
      ...updatedEvent,
      audience_type: audience ? audience.audience_type : 'all',
      audience_id: audience ? audience.audience_id : null
    };
    
    return res.status(200).json(transformedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ error: 'Failed to update event' });
  }
}

// Delete an event
async function deleteEvent(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Event ID is required' });
  }
  
  const eventId = parseInt(id);
  
  try {
    // Delete event and related audiences in a transaction
    await prisma.$transaction(async (prisma) => {
      // Delete related audiences first
      await prisma.eventAudience.deleteMany({
        where: { eventId }
      });
      
      // Delete the event
      await prisma.event.delete({
        where: { id: eventId }
      });
    });
    
    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ error: 'Failed to delete event' });
  }
}
