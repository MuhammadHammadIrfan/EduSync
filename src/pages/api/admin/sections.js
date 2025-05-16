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
      const { classId } = req.query;
      
      let whereClause = {};
      if (classId) {
        whereClause.classId = parseInt(classId, 10);
      }
      
      const sections = await prisma.section.findMany({
        where: whereClause,
        include: {
          class: true,
          advisor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });
      
      return res.status(200).json(sections);
    } 
    
    else if (req.method === 'POST') {
      const { name, classId, room_no, advisorId } = req.body;
      
      if (!name || !classId || !room_no || !advisorId) {
        return res.status(400).json({ 
          message: 'Name, class ID, room number, and advisor ID are required' 
        });
      }
      
      // Check if section with same name already exists for this class
      const existingSection = await prisma.section.findFirst({
        where: { 
          classId: parseInt(classId, 10),
          name: name 
        },
      });
      
      if (existingSection) {
        return res.status(400).json({ 
          message: 'Section with this name already exists for this class' 
        });
      }
      
      const newSection = await prisma.section.create({
        data: { 
          name, 
          classId: parseInt(classId, 10),
          room_no,
          advisorId: parseInt(advisorId, 10)
        },
        include: {
          class: true,
          advisor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      
      return res.status(201).json(newSection);
    } 
    
    else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error with sections endpoint:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}