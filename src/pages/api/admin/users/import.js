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

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { users, type, departmentId, classId, sectionId } = req.body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: 'No users provided for import' });
    }

    if (!type || (type !== 'student' && type !== 'faculty')) {
      return res
        .status(400)
        .json({ message: 'Valid user type is required (student or faculty)' });
    }

    if (!departmentId) {
      return res.status(400).json({ message: 'Department ID is required' });
    }

    // For students, require class and section
    if (type === 'student' && (!classId || !sectionId)) {
      return res
        .status(400)
        .json({ message: 'Class ID and Section ID are required for students' });
    }

    // Default password (will be hashed)
    const defaultPassword = type === 'student' ? 'student@123' : 'faculty@123';
    const password_hash = await hash(defaultPassword, 10);

    // Processing results
    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Process each user row
    for (const user of users) {
      try {
        if (!user.name || !user.email) {
          results.failed++;
          results.errors.push({
            name: user.name || 'Unknown',
            email: user.email || 'Unknown',
            error: 'Missing required fields (name or email)',
          });
          continue;
        }

        // Check for existing user with the email
        let existingUser;
        if (type === 'student') {
          existingUser = await prisma.student.findUnique({
            where: { email: user.email },
          });
        } else {
          existingUser = await prisma.faculty.findUnique({
            where: { email: user.email },
          });
        }

        if (existingUser) {
          results.failed++;
          results.errors.push({
            name: user.name,
            email: user.email,
            error: 'Email already exists',
          });
          continue;
        }

        // Base user data
        const userData = {
          name: user.name,
          email: user.email,
          password_hash,
          departmentId: parseInt(departmentId, 10),
        };

        // Create user based on type
        if (type === 'student') {
          await prisma.student.create({
            data: {
              ...userData,
              classId: parseInt(classId, 10),
              sectionId: parseInt(sectionId, 10),
            },
          });
        } else {
          await prisma.faculty.create({
            data: userData,
          });
        }

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          name: user.name || 'Unknown',
          email: user.email || 'Unknown',
          error: error.message,
        });
      }
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error('Error in users import API:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
