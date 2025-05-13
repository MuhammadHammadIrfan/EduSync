import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  // Check if user is authenticated (implement proper auth check)
  // const isAuthenticated = true; // Replace with actual auth check
  // if (!isAuthenticated) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  try {
    switch (req.method) {
      case 'GET':
        return await getCourses(req, res);
      case 'POST':
        return await createCourse(req, res);
      case 'PUT':
        return await updateCourse(req, res);
      case 'DELETE':
        return await deleteCourse(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in courses API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get courses with optional filters
async function getCourses(req, res) {
  const { searchTerm, departmentId, credit_hours } = req.query;
  
  // Build filter conditions
  const where = {};
  
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { course_code: { contains: searchTerm, mode: 'insensitive' } }
    ];
  }
  
  if (departmentId) {
    where.departmentId = parseInt(departmentId);
  }
  
  if (credit_hours) {
    where.credit_hours = parseInt(credit_hours);
  }
  
  try {
    const courses = await prisma.course.findMany({
      where,
      include: {
        department: true
      },
      orderBy: {
        course_code: 'asc'
      }
    });
    
    // Add a "status" field (Active/Inactive) - assuming all courses are active for now
    const coursesWithStatus = courses.map(course => ({
      ...course,
      status: 'Active'
    }));
    
    return res.status(200).json(coursesWithStatus);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

// Create a new course
async function createCourse(req, res) {
  const { 
    name, 
    course_code, 
    departmentId, 
    credit_hours 
  } = req.body;
  
  // Validate required fields
  if (!name || !course_code || !departmentId || !credit_hours) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Check if course code already exists
    const existingCourse = await prisma.course.findUnique({
      where: { course_code }
    });
    
    if (existingCourse) {
      return res.status(400).json({ error: 'Course code already exists' });
    }
    
    // Create the course
    const course = await prisma.course.create({
      data: {
        name,
        course_code,
        departmentId: parseInt(departmentId),
        credit_hours: parseInt(credit_hours)
      },
      include: {
        department: true
      }
    });
    
    // Add status field
    const courseWithStatus = {
      ...course,
      status: 'Active'
    };
    
    return res.status(201).json(courseWithStatus);
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ error: 'Failed to create course' });
  }
}

// Update an existing course
async function updateCourse(req, res) {
  const { id } = req.query;
  const { 
    name, 
    course_code, 
    departmentId, 
    credit_hours 
  } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Course ID is required' });
  }
  
  const courseId = parseInt(id);
  
  try {
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId }
    });
    
    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if course code is being changed and if it already exists
    if (course_code !== existingCourse.course_code) {
      const codeExists = await prisma.course.findUnique({
        where: { course_code }
      });
      
      if (codeExists) {
        return res.status(400).json({ error: 'Course code already exists' });
      }
    }
    
    // Update the course
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        name,
        course_code,
        departmentId: parseInt(departmentId),
        credit_hours: parseInt(credit_hours)
      },
      include: {
        department: true
      }
    });
    
    // Add status field
    const courseWithStatus = {
      ...updatedCourse,
      status: 'Active'
    };
    
    return res.status(200).json(courseWithStatus);
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ error: 'Failed to update course' });
  }
}

// Delete a course
async function deleteCourse(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Course ID is required' });
  }
  
  const courseId = parseInt(id);
  
  try {
    // Check if course is being used in any relationships
    const enrollments = await prisma.studentCourseEnrollment.count({
      where: { courseId }
    });
    
    const schedules = await prisma.classSchedule.count({
      where: { courseId }
    });
    
    const courseClasses = await prisma.courseClass.count({
      where: { courseId }
    });
    
    const facultyCourses = await prisma.facultyCourse.count({
      where: { courseId }
    });
    
    if (enrollments > 0 || schedules > 0 || courseClasses > 0 || facultyCourses > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete course as it is being used in enrollments, schedules, or other related data' 
      });
    }
    
    // Delete the course
    await prisma.course.delete({
      where: { id: courseId }
    });
    
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ error: 'Failed to delete course' });
  }
}
