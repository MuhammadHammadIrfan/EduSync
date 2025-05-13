import prisma from '../../../lib/prisma';
import { hashPassword } from '../../../utils/auth';

export default async function handler(req, res) {
  // Check if user is authenticated (implement proper auth check)
  // const isAuthenticated = true; // Replace with actual auth check
  // if (!isAuthenticated) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  try {
    switch (req.method) {
      case 'GET':
        return await getUsers(req, res);
      case 'POST':
        return await createUser(req, res);
      case 'PUT':
        return await updateUser(req, res);
      case 'DELETE':
        return await deleteUser(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in users API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get users with optional filters
async function getUsers(req, res) {
  const { role, departmentId, classId, sectionId, search } = req.query;
  
  // Build filter conditions
  const where = {};
  
  // Filter by role (student or faculty)
  if (role === 'student') {
    // Student filters
    where.OR = [
      { Student: { isNot: null } }
    ];
    
    if (departmentId) {
      where.Student = {
        ...where.Student,
        departmentId: parseInt(departmentId)
      };
    }
    
    if (classId) {
      where.Student = {
        ...where.Student,
        classId: parseInt(classId)
      };
    }
    
    if (sectionId) {
      where.Student = {
        ...where.Student,
        sectionId: parseInt(sectionId)
      };
    }
    
    if (search) {
      where.OR = [
        { Student: { name: { contains: search, mode: 'insensitive' } } },
        { Student: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }
    
    // Fetch students
    const students = await prisma.student.findMany({
      where,
      include: {
        department: true,
        class: true,
        section: true
      }
    });
    
    return res.status(200).json(students);
  } else if (role === 'faculty') {
    // Faculty filters
    where.OR = [
      { Faculty: { isNot: null } }
    ];
    
    if (departmentId) {
      where.Faculty = {
        ...where.Faculty,
        departmentId: parseInt(departmentId)
      };
    }
    
    if (search) {
      where.OR = [
        { Faculty: { name: { contains: search, mode: 'insensitive' } } },
        { Faculty: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }
    
    // Fetch faculty
    const faculty = await prisma.faculty.findMany({
      where,
      include: {
        department: true
      }
    });
    
    return res.status(200).json(faculty);
  } else {
    // If no role is specified, return an empty array
    return res.status(200).json([]);
  }
}

// Create a new user (student or faculty)
async function createUser(req, res) {
  const { 
    name, 
    email, 
    password, 
    departmentId, 
    classId, 
    sectionId, 
    role 
  } = req.body;
  
  // Validate required fields
  if (!name || !email || !password || !departmentId || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check if email already exists
  let existingStudent = null;
  let existingFaculty = null;
  
  try {
    existingStudent = await prisma.student.findUnique({
      where: { email }
    });
    
    existingFaculty = await prisma.faculty.findUnique({
      where: { email }
    });
  } catch (error) {
    console.error('Error checking existing user:', error);
  }
  
  if (existingStudent || existingFaculty) {
    return res.status(400).json({ error: 'Email already in use' });
  }
  
  // Hash the password
  const password_hash = await hashPassword(password);
  
  try {
    if (role === 'student') {
      // Validate student-specific fields
      if (!classId || !sectionId) {
        return res.status(400).json({ error: 'Missing required fields for student' });
      }
      
      // Create a new student
      const student = await prisma.student.create({
        data: {
          name,
          email,
          password_hash,
          departmentId: parseInt(departmentId),
          classId: parseInt(classId),
          sectionId: parseInt(sectionId)
        }
      });
      
      return res.status(201).json(student);
    } else if (role === 'faculty') {
      // Create a new faculty member
      const faculty = await prisma.faculty.create({
        data: {
          name,
          email,
          password_hash,
          departmentId: parseInt(departmentId)
        }
      });
      
      return res.status(201).json(faculty);
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}

// Update an existing user
async function updateUser(req, res) {
  const { id } = req.query;
  const { 
    name, 
    email, 
    password, 
    departmentId, 
    classId, 
    sectionId, 
    role 
  } = req.body;
  
  // Validate required fields
  if (!id || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const updateData = {
    name,
    email,
    departmentId: departmentId ? parseInt(departmentId) : undefined
  };
  
  // Only update password if provided
  if (password) {
    updateData.password_hash = await hashPassword(password);
  }
  
  try {
    if (role === 'student') {
      // Update student fields
      if (classId) updateData.classId = parseInt(classId);
      if (sectionId) updateData.sectionId = parseInt(sectionId);
      
      const student = await prisma.student.update({
        where: { id: parseInt(id) },
        data: updateData
      });
      
      return res.status(200).json(student);
    } else if (role === 'faculty') {
      // Update faculty member
      const faculty = await prisma.faculty.update({
        where: { id: parseInt(id) },
        data: updateData
      });
      
      return res.status(200).json(faculty);
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
}

// Delete a user
async function deleteUser(req, res) {
  const { id, role } = req.query;
  
  if (!id || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    if (role === 'student') {
      await prisma.student.delete({
        where: { id: parseInt(id) }
      });
    } else if (role === 'faculty') {
      await prisma.faculty.delete({
        where: { id: parseInt(id) }
      });
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}
