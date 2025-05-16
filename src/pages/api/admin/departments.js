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
      const departments = await prisma.department.findMany({
        orderBy: { name: 'asc' },
      });

      return res.status(200).json(departments);
    } else if (req.method === 'POST') {
      const { name, code } = req.body;

      if (!name || !code) {
        return res.status(400).json({ message: 'Name and code are required' });
      }

      // Check if department with same code already exists
      const existingDepartment = await prisma.department.findUnique({
        where: { code },
      });

      if (existingDepartment) {
        return res
          .status(400)
          .json({ message: 'Department with this code already exists' });
      }

      const newDepartment = await prisma.department.create({
        data: { name, code },
      });

      return res.status(201).json(newDepartment);
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error with departments endpoint:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
