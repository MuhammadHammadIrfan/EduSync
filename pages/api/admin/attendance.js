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
        return await getAttendance(req, res);
      case 'PUT':
        return await updateAttendance(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in attendance API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get attendance records with optional filters
async function getAttendance(req, res) {
  const { 
    view_type, 
    departmentId, 
    classId, 
    sectionId, 
    courseId, 
    facultyId, 
    date, 
    status 
  } = req.query;
  
  // Build filter conditions
  const where = {};
  
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    where.date = {
      gte: startOfDay,
      lte: endOfDay
    };
  }
  
  if (status) {
    where.status = status;
  }
  
  if (view_type === 'student') {
    // Student attendance filters
    if (courseId) {
      where.courseId = parseInt(courseId);
    }
    
    if (departmentId || classId || sectionId) {
      where.student = {};
      
      if (departmentId) {
        where.student.departmentId = parseInt(departmentId);
      }
      
      if (classId) {
        where.student.classId = parseInt(classId);
      }
      
      if (sectionId) {
        where.student.sectionId = parseInt(sectionId);
      }
    }
  } else {
    // Faculty attendance handling would depend on how faculty attendance is structured
    // For now, we'll return an empty array for faculty view since the schema doesn't explicitly show faculty attendance
    return res.status(200).json([]);
  }
  
  try {
    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        student: true,
        course: true
      },
      orderBy: [
        { date: 'desc' },
        { studentId: 'asc' }
      ]
    });
    
    return res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({ error: 'Failed to fetch attendance' });
  }
}

// Update attendance status
async function updateAttendance(req, res) {
  const { id } = req.query;
  const { status } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Attendance ID is required' });
  }
  
  if (!status || !['Present', 'Absent', 'Late'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required (Present, Absent, or Late)' });
  }
  
  const attendanceId = parseInt(id);
  
  try {
    // Check if attendance record exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id: attendanceId }
    });
    
    if (!existingAttendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    // Update the attendance status
    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: { status },
      include: {
        student: true,
        course: true
      }
    });
    
    return res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    return res.status(500).json({ error: 'Failed to update attendance' });
  }
}

// Get attendance analytics data
export async function getAttendanceAnalytics(req, res) {
  try {
    // This would typically involve complex queries to aggregate attendance data
    // For the MVP, we'll return mock data
    const mockAnalytics = {
      student: {
        overall: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          present: [85, 82, 88, 90, 86, 92],
          absent: [10, 12, 8, 7, 10, 5],
          late: [5, 6, 4, 3, 4, 3]
        },
        departmentWise: {
          labels: ['CS', 'EE', 'BA', 'MATH', 'PHYS'],
          present: [90, 85, 80, 88, 82],
          absent: [7, 10, 15, 9, 12],
          late: [3, 5, 5, 3, 6]
        }
      },
      faculty: {
        overall: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          present: [95, 97, 94, 96, 98, 93],
          absent: [4, 2, 5, 3, 1, 6],
          late: [1, 1, 1, 1, 1, 1]
        },
        departmentWise: {
          labels: ['CS', 'EE', 'BA', 'MATH', 'PHYS'],
          present: [96, 94, 93, 97, 95],
          absent: [3, 5, 6, 2, 4],
          late: [1, 1, 1, 1, 1]
        }
      }
    };
    
    return res.status(200).json(mockAnalytics);
  } catch (error) {
    console.error('Error fetching attendance analytics:', error);
    return res.status(500).json({ error: 'Failed to fetch attendance analytics' });
  }
}
