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

    const { id } = req.query;
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // PUT - update user
    if (req.method === 'PUT') {
      const userData = req.body;
      
      if (!userData) {
        return res.status(400).json({ message: 'No user data provided' });
      }

      // Check if this is a student or faculty user
      let userType = userData.type;

      // If type is not provided, determine from database
      if (!userType) {
        const studentCheck = await prisma.student.findUnique({
          where: { id: userId }
        });
        
        userType = studentCheck ? 'student' : 'faculty';
      }

      // Prepare basic update data
      const updateData = {
        name: userData.name,
        email: userData.email,
        departmentId: userData.departmentId ? parseInt(userData.departmentId, 10) : undefined
      };

      // If password is provided, hash it
      if (userData.password) {
        updateData.password_hash = await hash(userData.password, 10);
      }

      let updatedUser;

      // Update based on user type
      if (userType === 'student') {
        // Add student-specific fields
        if (userData.classId) updateData.classId = parseInt(userData.classId, 10);
        if (userData.sectionId) updateData.sectionId = parseInt(userData.sectionId, 10);
        
        updatedUser = await prisma.student.update({
          where: { id: userId },
          data: updateData,
          include: {
            department: true,
            class: true,
            section: true
          }
        });
      } else {
        // Faculty update
        updatedUser = await prisma.faculty.update({
          where: { id: userId },
          data: updateData,
          include: {
            department: true
          }
        });
      }

      return res.status(200).json(updatedUser);
    } 
    
    // DELETE - delete user
    else if (req.method === 'DELETE') {
      // First determine if this is a student or faculty
      let userDeleted = false;
      
      try {
        await prisma.student.delete({
          where: { id: userId }
        });
        userDeleted = true;
      } catch (error) {
        // Not a student, try faculty
        if (error.code === 'P2025') {
          try {
            await prisma.faculty.delete({
              where: { id: userId }
            });
            userDeleted = true;
          } catch (innerError) {
            if (innerError.code === 'P2025') {
              return res.status(404).json({ message: 'User not found' });
            }
            throw innerError;
          }
        } else {
          throw error;
        }
      }

      if (userDeleted) {
        return res.status(200).json({ message: 'User deleted successfully' });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }
    
    else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error('Error in users/[id] API:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}