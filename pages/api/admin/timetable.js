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
        return await getSchedules(req, res);
      case 'POST':
        return await createSchedule(req, res);
      case 'PUT':
        return await updateSchedule(req, res);
      case 'DELETE':
        return await deleteSchedule(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in timetable API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get class schedules with optional filters
async function getSchedules(req, res) {
  const { 
    view_type, 
    departmentId, 
    classId, 
    sectionId, 
    facultyId, 
    day 
  } = req.query;
  
  // Build filter conditions
  const where = {};
  
  if (day) {
    where.day_of_week = day;
  }
  
  if (view_type === 'student') {
    // Student view filters
    if (departmentId && !classId) {
      where.class = {
        departmentId: parseInt(departmentId)
      };
    }
    
    if (classId) {
      where.classId = parseInt(classId);
    }
    
    if (sectionId) {
      where.sectionId = parseInt(sectionId);
    }
  } else {
    // Faculty view filters
    if (facultyId) {
      where.facultyId = parseInt(facultyId);
    }
    
    if (departmentId) {
      where.faculty = {
        departmentId: parseInt(departmentId)
      };
    }
  }
  
  try {
    const schedules = await prisma.classSchedule.findMany({
      where,
      include: {
        course: true,
        faculty: true,
        class: true,
        section: true
      },
      orderBy: [
        { day_of_week: 'asc' },
        { start_time: 'asc' }
      ]
    });
    
    return res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return res.status(500).json({ error: 'Failed to fetch schedules' });
  }
}

// Create a new class schedule
async function createSchedule(req, res) {
  const { 
    courseId, 
    facultyId, 
    classId, 
    sectionId, 
    day_of_week, 
    start_time, 
    end_time 
  } = req.body;
  
  // Validate required fields
  if (!courseId || !facultyId || !classId || !sectionId || !day_of_week || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Check for scheduling conflicts
    const conflictCheck = await prisma.classSchedule.findFirst({
      where: {
        day_of_week,
        OR: [
          {
            // Faculty already teaching at this time
            facultyId: parseInt(facultyId),
            start_time: { lte: end_time },
            end_time: { gte: start_time }
          },
          {
            // Section already has a class at this time
            sectionId: parseInt(sectionId),
            start_time: { lte: end_time },
            end_time: { gte: start_time }
          }
        ]
      }
    });
    
    if (conflictCheck) {
      return res.status(400).json({ 
        error: 'Scheduling conflict detected. Faculty or section already has a class at this time.' 
      });
    }
    
    // Create the schedule
    const schedule = await prisma.classSchedule.create({
      data: {
        courseId: parseInt(courseId),
        facultyId: parseInt(facultyId),
        classId: parseInt(classId),
        sectionId: parseInt(sectionId),
        day_of_week,
        start_time,
        end_time
      },
      include: {
        course: true,
        faculty: true,
        class: true,
        section: true
      }
    });
    
    return res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    return res.status(500).json({ error: 'Failed to create schedule' });
  }
}

// Update an existing class schedule
async function updateSchedule(req, res) {
  const { id } = req.query;
  const { 
    courseId, 
    facultyId, 
    classId, 
    sectionId, 
    day_of_week, 
    start_time, 
    end_time 
  } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Schedule ID is required' });
  }
  
  const scheduleId = parseInt(id);
  
  try {
    // Check if schedule exists
    const existingSchedule = await prisma.classSchedule.findUnique({
      where: { id: scheduleId }
    });
    
    if (!existingSchedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    // Check for scheduling conflicts
    const conflictCheck = await prisma.classSchedule.findFirst({
      where: {
        id: { not: scheduleId },
        day_of_week,
        OR: [
          {
            // Faculty already teaching at this time
            facultyId: parseInt(facultyId),
            start_time: { lte: end_time },
            end_time: { gte: start_time }
          },
          {
            // Section already has a class at this time
            sectionId: parseInt(sectionId),
            start_time: { lte: end_time },
            end_time: { gte: start_time }
          }
        ]
      }
    });
    
    if (conflictCheck) {
      return res.status(400).json({ 
        error: 'Scheduling conflict detected. Faculty or section already has a class at this time.' 
      });
    }
    
    // Update the schedule
    const updatedSchedule = await prisma.classSchedule.update({
      where: { id: scheduleId },
      data: {
        courseId: parseInt(courseId),
        facultyId: parseInt(facultyId),
        classId: parseInt(classId),
        sectionId: parseInt(sectionId),
        day_of_week,
        start_time,
        end_time
      },
      include: {
        course: true,
        faculty: true,
        class: true,
        section: true
      }
    });
    
    return res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return res.status(500).json({ error: 'Failed to update schedule' });
  }
}

// Delete a class schedule
async function deleteSchedule(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Schedule ID is required' });
  }
  
  const scheduleId = parseInt(id);
  
  try {
    // Check if schedule exists
    const existingSchedule = await prisma.classSchedule.findUnique({
      where: { id: scheduleId }
    });
    
    if (!existingSchedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    // Delete the schedule
    await prisma.classSchedule.delete({
      where: { id: scheduleId }
    });
    
    return res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return res.status(500).json({ error: 'Failed to delete schedule' });
  }
}
