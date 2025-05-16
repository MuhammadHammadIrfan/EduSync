import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // GET - fetch courses
  if (req.method === 'GET') {
    try {
      const { departmentId, search } = req.query;

      let whereClause = {};

      if (departmentId) {
        whereClause.departmentId = parseInt(departmentId, 10);
      }

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { course_code: { contains: search, mode: 'insensitive' } },
        ];
      }

      const courses = await prisma.course.findMany({
        where: whereClause,
        include: {
          department: true,
        },
        orderBy: { name: 'asc' },
      });

      return res.status(200).json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      return res.status(500).json({ message: 'Error fetching courses' });
    } finally {
          await prisma.$disconnect();
      }
  }
  // POST - create course
  else if (req.method === 'POST') {
    try {
      const { name, course_code, departmentId, credit_hours } = req.body;

      if (!name || !course_code || !departmentId || !credit_hours) {
        return res.status(400).json({
          message:
            'Course name, code, department ID, and credit hours are required',
        });
      }

      // Check if course code already exists
      const existingCourse = await prisma.course.findUnique({
        where: { course_code },
      });

      if (existingCourse) {
        return res.status(409).json({ message: 'Course code already exists' });
      }

      const newCourse = await prisma.course.create({
        data: {
          name,
          course_code,
          departmentId: parseInt(departmentId, 10),
          credit_hours: parseInt(credit_hours, 10),
        },
        include: {
          department: true,
        },
      });

      return res.status(201).json(newCourse);
    } catch (error) {
      console.error('Error creating course:', error);
      return res.status(500).json({ message: 'Error creating course' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
