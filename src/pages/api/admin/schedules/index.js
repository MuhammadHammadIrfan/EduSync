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

    switch (req.method) {
      case 'GET':
        return await getSchedules(req, res);
      case 'POST':
        return await createSchedule(req, res);
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

// Get class schedules with optional filters
async function getSchedules(req, res) {
  const { departmentId, classId, sectionId, facultyId, day } = req.query;

  // Build filter conditions
  const where = {};

  if (day) {
    where.day_of_week = day;
  }

  if (facultyId) {
    where.facultyId = parseInt(facultyId, 10);
  } else {
    // Section view filters
    if (departmentId) {
      where.class = {
        departmentId: parseInt(departmentId, 10),
      };
    }

    if (classId) {
      where.classId = parseInt(classId, 10);
    }

    if (sectionId) {
      where.sectionId = parseInt(sectionId, 10);
    }
  }

  try {
    const schedules = await prisma.classSchedule.findMany({
      where,
      include: {
        course: true,
        faculty: true,
        class: true,
        section: true,
      },
      orderBy: [{ day_of_week: 'asc' }, { start_time: 'asc' }],
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
    end_time,
  } = req.body;

  // Validate required fields
  if (
    !courseId ||
    !facultyId ||
    !classId ||
    !sectionId ||
    !day_of_week ||
    !start_time ||
    !end_time
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create the schedule
    const schedule = await prisma.classSchedule.create({
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

    return res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    return res.status(500).json({ error: 'Failed to create schedule' });
  }
}
