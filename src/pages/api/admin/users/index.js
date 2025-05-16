import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  try {
    // Verify authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // GET - fetch users (students or faculty)
    if (req.method === 'GET') {
      const { role, search, departmentId, classId, sectionId } = req.query;

      // Validate role parameter
      if (!role || (role !== 'student' && role !== 'faculty')) {
        return res
          .status(400)
          .json({ message: 'Valid role parameter is required' });
      }

      // Build the where clause based on filters
      const whereClause = {};

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (departmentId) {
        whereClause.departmentId = parseInt(departmentId, 10);
      }

      // For students only filters
      if (role === 'student') {
        if (classId) {
          whereClause.classId = parseInt(classId, 10);
        }

        if (sectionId) {
          whereClause.sectionId = parseInt(sectionId, 10);
        }
      }

      let users;
      if (role === 'student') {
        users = await prisma.student.findMany({
          where: whereClause,
          include: {
            department: true,
            class: true,
            section: true,
          },
        });
      } else {
        users = await prisma.faculty.findMany({
          where: whereClause,
          include: {
            department: true,
          },
        });
      }

      return res.status(200).json(users);
    }

    // POST - create new user (student or faculty)
    else if (req.method === 'POST') {
      const userData = req.body;

      // Validate required fields
      if (!userData.name || !userData.email || !userData.password) {
        return res
          .status(400)
          .json({ message: 'Name, email, and password are required' });
      }

      // Hash the password
      const password_hash = await hash(userData.password, 10);

      // Prepare base user data
      const baseUserData = {
        name: userData.name,
        email: userData.email,
        password_hash,
        departmentId: parseInt(userData.departmentId, 10),
      };

      let newUser;

      // Create the user based on type
      if (userData.type === 'student') {
        // Additional validation for student-specific fields
        if (!userData.classId || !userData.sectionId) {
          return res
            .status(400)
            .json({
              message: 'Class ID and Section ID are required for students',
            });
        }

        // Create student
        newUser = await prisma.student.create({
          data: {
            ...baseUserData,
            classId: parseInt(userData.classId, 10),
            sectionId: parseInt(userData.sectionId, 10),
          },
          include: {
            department: true,
            class: true,
            section: true,
          },
        });
      } else if (userData.type === 'faculty') {
        // Create faculty
        newUser = await prisma.faculty.create({
          data: baseUserData,
          include: {
            department: true,
          },
        });
      } else {
        return res.status(400).json({ message: 'Invalid user type' });
      }

      return res.status(201).json(newUser);
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error('Error in users API:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
