import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    // Verify authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const { departmentId } = req.query;

      let whereClause = {};
      if (departmentId) {
        whereClause.departmentId = parseInt(departmentId, 10);
      }

      const classes = await prisma.class.findMany({
        where: whereClause,
        include: {
          department: true,
        },
        orderBy: { name: 'asc' },
      });

      return res.status(200).json(classes);
    } else if (req.method === 'POST') {
      const { name, departmentId } = req.body;

      if (!name || !departmentId) {
        return res
          .status(400)
          .json({ message: 'Name and department ID are required' });
      }

      // Check if class with same name already exists
      const existingClass = await prisma.class.findUnique({
        where: { name },
      });

      if (existingClass) {
        return res
          .status(400)
          .json({ message: 'Class with this name already exists' });
      }

      const newClass = await prisma.class.create({
        data: {
          name,
          departmentId: parseInt(departmentId, 10),
        },
        include: {
          department: true,
        },
      });

      return res.status(201).json(newClass);
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error with classes endpoint:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
