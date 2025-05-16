import { fetchWithAuth, getCurrentUserId } from './common';

// =============== DASHBOARD & ANALYTICS ===============

/**
 * Get admin dashboard statistics
 */
export async function getAdminDashboardStats() {
  try {
    return await fetchWithAuth('/api/admin/dashboard');
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    throw error;
  }
}

/**
 * Get all analytics data for admin dashboard
 */
export async function getAllAnalytics() {
  try {
    const response = await fetchWithAuth('/api/admin/analytics');
    
    // Ensure we have default values for all expected properties
    return {
      studentDepartmentDistribution: response.studentDepartmentDistribution || { 
        labels: [], 
        data: [],
        backgroundColor: [],
        borderColor: []
      },
      facultyDepartmentDistribution: response.facultyDepartmentDistribution || { 
        labels: [], 
        data: [],
        backgroundColor: [],
        borderColor: []
      },
      revenueData: response.revenueData || { 
        total_revenue: 0, 
        total_pending: 0 
      },
      metrics: response.metrics || {
        totalFaculty: 0,
        totalEnrollments: 0,
        activeCourses: 0,
        totalEvents: 0
      },
      attendanceAnalytics: response.attendanceAnalytics || {
        student: {
          overall: {
            present: 0,
            total: 0,
            rate: 0
          }
        }
      }
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Return default data structure on error
    return {
      studentDepartmentDistribution: { labels: [], data: [], backgroundColor: [], borderColor: [] },
      facultyDepartmentDistribution: { labels: [], data: [], backgroundColor: [], borderColor: [] },
      revenueData: { total_revenue: 0, total_pending: 0 },
      metrics: { totalFaculty: 0, totalEnrollments: 0, activeCourses: 0, totalEvents: 0 },
      attendanceAnalytics: { student: { overall: { present: 0, total: 0, rate: 0 } } }
    };
  }
}

/**
 * Get department distribution data for charts
 * @deprecated Use getAllAnalytics instead
 */
export async function getDepartmentDistribution() {
  try {
    const response = await fetchWithAuth('/api/admin/analytics');
    return response.studentDepartmentDistribution || { labels: [], data: [] };
  } catch (error) {
    console.error('Error fetching department distribution:', error);
    return { labels: [], data: [] };
  }
}

/**
 * Get faculty performance data for charts
 * @deprecated Use getAllAnalytics instead
 */
export async function getFacultyPerformance() {
  try {
    const response = await fetchWithAuth('/api/admin/analytics');
    return response.facultyDepartmentDistribution || { labels: [], data: [] };
  } catch (error) {
    console.error('Error fetching faculty performance data:', error);
    return { labels: [], data: [] };
  }
}

/**
 * Get revenue data for financial analytics
 * @deprecated Use getAllAnalytics instead
 */
export async function getRevenueData() {
  try {
    const response = await fetchWithAuth('/api/admin/analytics');
    return response.revenueData || { total_revenue: 0, total_pending: 0 };
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return { total_revenue: 0, total_pending: 0 };
  }
}

/**
 * Get attendance analytics data
 * @deprecated Use getAllAnalytics instead
 */
export async function getAttendanceAnalytics() {
  try {
    const response = await fetchWithAuth('/api/admin/analytics');
    return response.attendanceAnalytics || { student: { overall: { present: 0, total: 0, rate: 0 } } };
  } catch (error) {
    console.error('Error fetching attendance analytics:', error);
    return { student: { overall: { present: 0, total: 0, rate: 0 } } };
  }
}

// =============== USER MANAGEMENT ===============

/**
 * Get users (students or faculty) with optional filters
 * @param {Object} queryParams - Filter parameters
 */
export async function getUsers(queryParams = {}) {
  try {
    // Convert queryParams to URLSearchParams
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        params.append(key, queryParams[key]);
      }
    });

    const queryString = params.toString();
    const url = `/api/admin/users${queryString ? `?${queryString}` : ''}`;

    return await fetchWithAuth(url);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Create a new user (student or faculty)
 * @param {Object} userData - User data to create
 */
export async function createUser(userData) {
  try {
    return await fetchWithAuth('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update an existing user
 * @param {number} userId - User ID to update
 * @param {Object} userData - Updated user data
 */
export async function updateUser(userId, userData) {
  try {
    return await fetchWithAuth(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete a user
 * @param {number} userId - User ID to delete
 */
export async function deleteUser(userId) {
  try {
    return await fetchWithAuth(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Import users (students or faculty) from CSV
 * @param {Object} importData - Object containing users array and metadata
 */
export async function importUsers(importData) {
  try {
    const response = await fetchWithAuth('/api/admin/users/import', {
      method: 'POST',
      body: JSON.stringify(importData)
    });
    return response;
  } catch (error) {
    console.error('Error importing users:', error);
    throw error;
  }
}

// =============== DEPARTMENTS, CLASSES, SECTIONS ===============

/**
 * Get all departments
 */
export async function getDepartments() {
  try {
    return await fetchWithAuth('/api/admin/departments');
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
}

/**
 * Get classes with optional department filter
 * @param {number} departmentId - Optional department filter
 */
export async function getClasses(departmentId) {
  try {
    const queryString = departmentId ? `?departmentId=${departmentId}` : '';
    return await fetchWithAuth(`/api/admin/classes${queryString}`);
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
}

/**
 * Get sections with optional class filter
 * @param {number} classId - Optional class filter
 */
export async function getSections(classId) {
  try {
    const queryString = classId ? `?classId=${classId}` : '';
    return await fetchWithAuth(`/api/admin/sections${queryString}`);
  } catch (error) {
    console.error('Error fetching sections:', error);
    throw error;
  }
}

/**
 * Create a new department
 * @param {Object} departmentData - Department data
 */
export async function createDepartment(departmentData) {
  try {
    return await fetchWithAuth('/api/admin/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData),
    });
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
}

/**
 * Create a new class
 * @param {Object} classData - Class data
 */
export async function createClass(classData) {
  try {
    return await fetchWithAuth('/api/admin/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
}

/**
 * Create a new section
 * @param {Object} sectionData - Section data
 */
export async function createSection(sectionData) {
  try {
    return await fetchWithAuth('/api/admin/sections', {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  } catch (error) {
    console.error('Error creating section:', error);
    throw error;
  }
}

// =============== COURSE MANAGEMENT ===============

/**
 * Get all courses with optional filters
 * @param {Object} queryParams - Filter parameters
 */
export async function getCourses(queryParams = {}) {
  try {
    // Convert queryParams to URLSearchParams
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        params.append(key, queryParams[key]);
      }
    });

    const queryString = params.toString();
    const url = `/api/admin/courses${queryString ? `?${queryString}` : ''}`;

    return await fetchWithAuth(url);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

/**
 * Create a new course
 * @param {Object} courseData - Course data
 */
export async function createCourse(courseData) {
  try {
    return await fetchWithAuth('/api/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
}

/**
 * Update an existing course
 * @param {number} courseId - Course ID to update
 * @param {Object} courseData - Updated course data
 */
export async function updateCourse(courseId, courseData) {
  try {
    return await fetchWithAuth(`/api/admin/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
}

/**
 * Delete a course
 * @param {number} courseId - Course ID to delete
 */
export async function deleteCourse(courseId) {
  try {
    return await fetchWithAuth(`/api/admin/courses/${courseId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
}

// =============== SCHEDULE MANAGEMENT ===============

/**
 * Get schedules/timetables with optional filters
 * @param {Object} queryParams - Filter parameters
 */
export async function getSchedules(queryParams = {}) {
  try {
    // Convert queryParams to URLSearchParams
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        params.append(key, queryParams[key]);
      }
    });

    const queryString = params.toString();
    const url = `/api/admin/schedules${queryString ? `?${queryString}` : ''}`;

    return await fetchWithAuth(url);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
}

/**
 * Create a new class schedule
 * @param {Object} scheduleData - Schedule data
 */
export async function createSchedule(scheduleData) {
  try {
    return await fetchWithAuth('/api/admin/schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
}

/**
 * Update an existing schedule
 * @param {number} scheduleId - Schedule ID to update
 * @param {Object} scheduleData - Updated schedule data
 */
export async function updateSchedule(scheduleId, scheduleData) {
  try {
    return await fetchWithAuth(`/api/admin/schedules/${scheduleId}`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
}

/**
 * Delete a schedule
 * @param {number} scheduleId - Schedule ID to delete
 */
export async function deleteSchedule(scheduleId) {
  try {
    return await fetchWithAuth(`/api/admin/schedules/${scheduleId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
}

// =============== ATTENDANCE MANAGEMENT ===============

/**
 * Get attendance records with optional filters
 * @param {Object} queryParams - Filter parameters
 */
export async function getAttendance(queryParams = {}) {
  try {
    // Convert queryParams to URLSearchParams
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        params.append(key, queryParams[key]);
      }
    });

    const queryString = params.toString();
    const url = `/api/admin/attendance${queryString ? `?${queryString}` : ''}`;

    return await fetchWithAuth(url);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
}

/**
 * Update attendance record
 * @param {number} attendanceId - Attendance ID to update
 * @param {Object} data - Updated attendance data
 */
export async function updateAttendance(attendanceId, data) {
  try {
    return await fetchWithAuth(`/api/admin/attendance/${attendanceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error updating attendance record:', error);
    throw error;
  }
}

// =============== EVENT MANAGEMENT ===============

/**
 * Get events with optional filters
 * @param {Object} queryParams - Filter parameters including pagination
 */
export async function getEvents(queryParams = {}) {
  try {
    // Convert queryParams to URLSearchParams
    const params = new URLSearchParams();
    
    // Handle pagination params
    if (queryParams.page) params.append('page', queryParams.page);
    if (queryParams.limit) params.append('limit', queryParams.limit);
    
    // Handle array parameters (audienceTypes, eventDates)
    Object.keys(queryParams).forEach((key) => {
      if (
        key !== 'page' && key !== 'limit' &&
        queryParams[key] !== undefined &&
        queryParams[key] !== null &&
        Array.isArray(queryParams[key])
      ) {
        queryParams[key].forEach((value) => {
          params.append(key, value);
        });
      } else if (
        key !== 'page' && key !== 'limit' && 
        queryParams[key] !== undefined && 
        queryParams[key] !== null
      ) {
        params.append(key, queryParams[key]);
      }
    });

    const queryString = params.toString();
    const url = `/api/admin/events${queryString ? `?${queryString}` : ''}`;

    return await fetchWithAuth(url);
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

/**
 * Create a new event
 * @param {Object} eventData - Event data
 */
export async function createEvent(eventData) {
  try {
    return await fetchWithAuth('/api/admin/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

/**
 * Update an existing event
 * @param {number} eventId - Event ID to update
 * @param {Object} eventData - Updated event data
 */
export async function updateEvent(eventId, eventData) {
  try {
    return await fetchWithAuth(`/api/admin/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

/**
 * Delete an event
 * @param {number} eventId - Event ID to delete
 */
export async function deleteEvent(eventId) {
  try {
    return await fetchWithAuth(`/api/admin/events/${eventId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

// =============== INVOICE MANAGEMENT ===============

/**
 * Get invoices with optional filters
 * @param {Object} queryParams - Filter parameters
 */
export async function getInvoices(queryParams = {}) {
  try {
    // Convert queryParams to URLSearchParams
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        params.append(key, queryParams[key]);
      }
    });

    const queryString = params.toString();
    const url = `/api/admin/invoices${queryString ? `?${queryString}` : ''}`;

    return await fetchWithAuth(url);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

/**
 * Get invoice summary statistics
 */
export async function getInvoiceSummary() {
  try {
    return await fetchWithAuth('/api/admin/invoices/summary');
  } catch (error) {
    console.error('Error fetching invoice summary:', error);
    throw error;
  }
}

/**
 * Create a new invoice
 * @param {Object} invoiceData - Invoice data
 */
export async function createInvoice(invoiceData) {
  try {
    return await fetchWithAuth('/api/admin/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

/**
 * Update an existing invoice
 * @param {number} invoiceId - Invoice ID to update
 * @param {Object} invoiceData - Updated invoice data
 */
export async function updateInvoice(invoiceId, invoiceData) {
  try {
    return await fetchWithAuth(`/api/admin/invoices/${invoiceId}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData),
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
}

/**
 * Delete an invoice
 * @param {number} invoiceId - Invoice ID to delete
 */
export async function deleteInvoice(invoiceId) {
  try {
    return await fetchWithAuth(`/api/admin/invoices/${invoiceId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
}

/**
 * Mark an invoice as paid
 * @param {number} invoiceId - Invoice ID to mark as paid
 */
export async function markInvoicePaid(invoiceId) {
  try {
    return await fetchWithAuth(`/api/admin/invoices/${invoiceId}/pay`, {
      method: 'PUT',
      body: JSON.stringify({ paid: true }),
    });
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    throw error;
  }
}

// =============== MESSAGING ===============

/**
 * Get messages with optional filters and pagination
 * @param {Object} queryParams - Filter parameters and pagination
 */
export async function getMessages(queryParams = {}) {
  try {
    // Convert queryParams to URLSearchParams
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        params.append(key, queryParams[key]);
      }
    });

    const queryString = params.toString();
    const url = `/api/admin/messages${queryString ? `?${queryString}` : ''}`;

    return await fetchWithAuth(url);
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

/**
 * Send a new message to one or more recipients
 * @param {Object} messageData - Message data including receivers
 * @param {string} messageData.receiver_type - Type of receivers ('student', 'faculty', or 'both')
 * @param {Array<number>} messageData.receiver_ids - Array of receiver IDs
 * @param {number} [messageData.departmentId] - Optional department ID filter
 * @param {boolean} [messageData.sendToAllInDept] - Whether to send to all users in department
 * @param {string} messageData.subject - Message subject
 * @param {string} messageData.body - Message body
 */
export async function sendMessage(messageData) {
  try {
    return await fetchWithAuth('/api/admin/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Delete a message
 * @param {number} messageId - Message ID to delete
 */
export async function deleteMessage(messageId) {
  try {
    return await fetchWithAuth(`/api/admin/messages/${messageId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}

// =============== LEAVE REQUEST MANAGEMENT ===============

// Get all leave requests
export async function getLeaveRequests() {
  try {
    return await fetchWithAuth('/api/admin/leave-requests');
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    throw error;
  }
}

// Approve a leave request
export async function approveLeave(leaveId) {
  try {
    return await fetchWithAuth(`/api/admin/leave-requests/${leaveId}/approve`, {
      method: 'PUT'
    });
  } catch (error) {
    console.error('Error approving leave request:', error);
    throw error;
  }
}

// Reject a leave request
export async function rejectLeave(leaveId) {
  try {
    return await fetchWithAuth(`/api/admin/leave-requests/${leaveId}/reject`, {
      method: 'PUT'
    });
  } catch (error) {
    console.error('Error rejecting leave request:', error);
    throw error;
  }
}
