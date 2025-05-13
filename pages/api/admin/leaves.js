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
        return await getLeaveRequests(req, res);
      case 'POST':
        return await createLeaveRequest(req, res);
      case 'PUT':
        return await updateLeaveStatus(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in leaves API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get leave requests with optional filters
async function getLeaveRequests(req, res) {
  const { status, departmentId, facultyId, date_from, date_to } = req.query;
  
  // Build filter conditions
  const where = {};
  
  if (status) {
    where.status = status;
  }
  
  if (departmentId) {
    where.departmentId = parseInt(departmentId);
  }
  
  if (facultyId) {
    where.facultyId = parseInt(facultyId);
  }
  
  // Date range filter
  if (date_from || date_to) {
    where.leave_date = {};
    
    if (date_from) {
      where.leave_date.gte = new Date(date_from);
    }
    
    if (date_to) {
      where.leave_date.lte = new Date(date_to);
    }
  }
  
  try {
    const leaveRequests = await prisma.leaveRequest.findMany({
      where,
      include: {
        faculty: true,
        department: true,
        class: true,
        section: true,
        course: true
      },
      orderBy: [
        { status: 'asc' }, // Pending first
        { leave_date: 'asc' }
      ]
    });
    
    return res.status(200).json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
}

// Create a new leave request
async function createLeaveRequest(req, res) {
  const { 
    facultyId, 
    departmentId, 
    classId, 
    sectionId, 
    courseId, 
    leave_date, 
    reason 
  } = req.body;
  
  // Validate required fields
  if (!facultyId || !departmentId || !classId || !sectionId || !courseId || !leave_date || !reason) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Create the leave request
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        facultyId: parseInt(facultyId),
        departmentId: parseInt(departmentId),
        classId: parseInt(classId),
        sectionId: parseInt(sectionId),
        courseId: parseInt(courseId),
        leave_date: new Date(leave_date),
        reason,
        status: 'Pending'
      },
      include: {
        faculty: true,
        department: true,
        class: true,
        section: true,
        course: true
      }
    });
    
    return res.status(201).json(leaveRequest);
  } catch (error) {
    console.error('Error creating leave request:', error);
    return res.status(500).json({ error: 'Failed to create leave request' });
  }
}

// Update leave request status (approve/reject)
async function updateLeaveStatus(req, res) {
  const { id } = req.query;
  const { status } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Leave request ID is required' });
  }
  
  if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required (Approved, Rejected, or Pending)' });
  }
  
  const leaveId = parseInt(id);
  
  try {
    // Check if leave request exists
    const existingLeave = await prisma.leaveRequest.findUnique({
      where: { id: leaveId }
    });
    
    if (!existingLeave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }
    
    // Update the leave request status
    const updatedLeave = await prisma.leaveRequest.update({
      where: { id: leaveId },
      data: { status },
      include: {
        faculty: true,
        department: true,
        class: true,
        section: true,
        course: true
      }
    });
    
    return res.status(200).json(updatedLeave);
  } catch (error) {
    console.error('Error updating leave request:', error);
    return res.status(500).json({ error: 'Failed to update leave request' });
  }
}

// Approve a leave request
export async function approveLeave(req, res) {
  req.body.status = 'Approved';
  return await updateLeaveStatus(req, res);
}

// Reject a leave request
export async function rejectLeave(req, res) {
  req.body.status = 'Rejected';
  return await updateLeaveStatus(req, res);
}
