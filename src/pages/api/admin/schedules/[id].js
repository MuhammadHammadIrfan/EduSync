import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    // Authentication check
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;

    if (!id || isNaN(parseInt(id, 10))) {
      return res.status(400).json({ error: 'Valid ID is required' });
    }

    const scheduleId = parseInt(id, 10);

    switch (req.method) {
      case 'GET':
        return await getSchedule(scheduleId, res);
      case 'PUT':
        return await updateSchedule(scheduleId, req, res);
      case 'DELETE':
        return await deleteSchedule(scheduleId, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in schedules API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

// Get a single schedule
async function getSchedule(id, res) {
  try {
    const schedule = await prisma.classSchedule.findUnique({
      where: { id },
      include: {
        course: true,
        faculty: true,
        class: true,
        section: true,
      },
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    return res.status(200).json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return res.status(500).json({ error: 'Failed to fetch schedule' });
  }
}

// Update an existing schedule
async function updateSchedule(id, req, res) {
  const {
    courseId,
    facultyId,
    classId,
    sectionId,
    day_of_week,
    start_time,
    end_time,
  } = req.body;

  try {
    // Update the schedule
    const updatedSchedule = await prisma.classSchedule.update({
      where: { id },
      data: {
        courseId: parseInt(courseId, 10),
        facultyId: parseInt(facultyId, 10),
        classId: parseInt(classId, 10),
        sectionId: parseInt(sectionId, 10),
        day_of_week,
        start_time: new Date(`1970-01-01T${start_time}`),
        end_time: new Date(`1970-01-01T${end_time}`),
      },
      include: {
        course: true,
        faculty: true,
        class: true,
        section: true,
      },
    });

    return res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return res.status(500).json({ error: 'Failed to update schedule' });
  }
}

// Delete a schedule
async function deleteSchedule(id, res) {
  try {
    await prisma.classSchedule.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return res.status(500).json({ error: 'Failed to delete schedule' });
  }
}
