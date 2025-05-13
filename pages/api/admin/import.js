import prisma from '../../../lib/prisma';
import { hashPassword } from '../../../utils/auth';
import xlsx from 'xlsx';

export default async function handler(req, res) {
  // Check if user is authenticated (implement proper auth check)
  // const isAuthenticated = true; // Replace with actual auth check
  // if (!isAuthenticated) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileContent, importType } = req.body;
    
    if (!fileContent || !importType) {
      return res.status(400).json({ error: 'File content and import type are required' });
    }
    
    // Parse the Excel file content
    const workbook = xlsx.read(fileContent, { type: 'base64' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    if (data.length === 0) {
      return res.status(400).json({ error: 'No data found in the file' });
    }
    
    // Handle different import types
    switch (importType) {
      case 'students':
        return await importStudents(data, res);
      case 'faculty':
        return await importFaculty(data, res);
      case 'courses':
        return await importCourses(data, res);
      default:
        return res.status(400).json({ error: 'Invalid import type' });
    }
  } catch (error) {
    console.error('Error in import API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Import students from Excel data
async function importStudents(data, res) {
  const results = {
    success: 0,
    errors: []
  };
  
  try {
    // Process each student row
    for (const row of data) {
      try {
        // Validate required fields
        if (!row.name || !row.email || !row.password || !row.departmentId || !row.classId || !row.sectionId) {
          results.errors.push({
            row: row,
            error: 'Missing required fields'
          });
          continue;
        }
        
        // Check if email already exists
        const existingStudent = await prisma.student.findUnique({
          where: { email: row.email }
        });
        
        if (existingStudent) {
          results.errors.push({
            row: row,
            error: 'Email already exists'
          });
          continue;
        }
        
        // Hash the password
        const password_hash = await hashPassword(row.password);
        
        // Create the student
        await prisma.student.create({
          data: {
            name: row.name,
            email: row.email,
            password_hash,
            departmentId: parseInt(row.departmentId),
            classId: parseInt(row.classId),
            sectionId: parseInt(row.sectionId)
          }
        });
        
        results.success++;
      } catch (error) {
        results.errors.push({
          row: row,
          error: error.message
        });
      }
    }
    
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error importing students:', error);
    return res.status(500).json({ error: 'Failed to import students' });
  }
}

// Import faculty from Excel data
async function importFaculty(data, res) {
  const results = {
    success: 0,
    errors: []
  };
  
  try {
    // Process each faculty row
    for (const row of data) {
      try {
        // Validate required fields
        if (!row.name || !row.email || !row.password || !row.departmentId) {
          results.errors.push({
            row: row,
            error: 'Missing required fields'
          });
          continue;
        }
        
        // Check if email already exists
        const existingFaculty = await prisma.faculty.findUnique({
          where: { email: row.email }
        });
        
        if (existingFaculty) {
          results.errors.push({
            row: row,
            error: 'Email already exists'
          });
          continue;
        }
        
        // Hash the password
        const password_hash = await hashPassword(row.password);
        
        // Create the faculty member
        await prisma.faculty.create({
          data: {
            name: row.name,
            email: row.email,
            password_hash,
            departmentId: parseInt(row.departmentId)
          }
        });
        
        results.success++;
      } catch (error) {
        results.errors.push({
          row: row,
          error: error.message
        });
      }
    }
    
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error importing faculty:', error);
    return res.status(500).json({ error: 'Failed to import faculty' });
  }
}

// Import courses from Excel data
async function importCourses(data, res) {
  const results = {
    success: 0,
    errors: []
  };
  
  try {
    // Process each course row
    for (const row of data) {
      try {
        // Validate required fields
        if (!row.name || !row.course_code || !row.departmentId || !row.credit_hours) {
          results.errors.push({
            row: row,
            error: 'Missing required fields'
          });
          continue;
        }
        
        // Check if course code already exists
        const existingCourse = await prisma.course.findUnique({
          where: { course_code: row.course_code }
        });
        
        if (existingCourse) {
          results.errors.push({
            row: row,
            error: 'Course code already exists'
          });
          continue;
        }
        
        // Create the course
        await prisma.course.create({
          data: {
            name: row.name,
            course_code: row.course_code,
            departmentId: parseInt(row.departmentId),
            credit_hours: parseInt(row.credit_hours)
          }
        });
        
        results.success++;
      } catch (error) {
        results.errors.push({
          row: row,
          error: error.message
        });
      }
    }
    
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error importing courses:', error);
    return res.status(500).json({ error: 'Failed to import courses' });
  }
}
