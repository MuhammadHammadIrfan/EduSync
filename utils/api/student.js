import { getCurrentUserId, fetchWithAuth } from './common';

// Format class schedule from enrollment data
function getFormattedClassSchedule(enrollments) {
  if (!enrollments || enrollments.length === 0) {
    return [];
  }
  
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[today.getDay()];
  
  // Filter enrollments to get only courses scheduled for today
  const todayClasses = [];
  
  enrollments.forEach(enrollment => {
    if (enrollment.course && enrollment.course.schedules) {
      const todaySchedules = enrollment.course.schedules.filter(
        schedule => schedule.day_of_week === todayName
      );
      
      todaySchedules.forEach(schedule => {
        // Convert time formats for display
        const startTime = new Date(schedule.start_time).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        const endTime = new Date(schedule.end_time).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        todayClasses.push({
          id: enrollment.course.id,
          name: enrollment.course.name,
          code: enrollment.course.course_code,
          time: `${startTime} - ${endTime}`,
          room: schedule.section?.room_no || 'Room not assigned',
          facultyName: schedule.faculty?.name || 'Not assigned'
        });
      });
    }
  });
  
  return todayClasses;
}

// Format attendance summary from attendance data
function getFormattedAttendanceSummary(attendanceData) {
  if (!attendanceData || attendanceData.length === 0) {
    return [];
  }
  
  // Group attendance by course
  const courseMap = {};
  
  attendanceData.forEach(record => {
    if (!record.course) return;
    
    const courseId = record.course.id;
    if (!courseMap[courseId]) {
      courseMap[courseId] = {
        id: courseId,
        name: record.course.name,
        code: record.course.course_code,
        attended: 0,
        total: 0,
        percentage: 0
      };
    }
    
    courseMap[courseId].total++;
    
    if (record.status === 'Present' || record.status === 'Late') {
      courseMap[courseId].attended++;
    }
  });
  
  // Calculate percentages and convert to array
  return Object.values(courseMap).map(course => {
    course.percentage = course.total > 0 
      ? Math.round((course.attended / course.total) * 100) 
      : 0;
    return course;
  });
}

// Format weekly schedule from enrollment data
function getFormattedSchedule(enrollments) {
  if (!enrollments || enrollments.length === 0) {
    return [];
  }
  
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const scheduleByDay = {};
  
  // Initialize empty arrays for each day
  dayNames.forEach(day => {
    scheduleByDay[day] = [];
  });
  
  // Populate the schedule
  enrollments.forEach(enrollment => {
    if (!enrollment.course || !enrollment.course.schedules) return;
    
    enrollment.course.schedules.forEach(schedule => {
      const day = schedule.day_of_week;
      if (!dayNames.includes(day)) return;
      
      // Format times for display
      const startTime = new Date(schedule.start_time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      const endTime = new Date(schedule.end_time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      scheduleByDay[day].push({
        id: enrollment.course.id,
        name: enrollment.course.name,
        code: enrollment.course.course_code,
        time: `${startTime} - ${endTime}`,
        room: schedule.section?.room_no || 'Room not assigned',
        facultyName: schedule.faculty?.name || 'Not assigned'
      });
    });
  });
  
  // Sort each day's schedule by time
  Object.keys(scheduleByDay).forEach(day => {
    scheduleByDay[day].sort((a, b) => {
      const timeA = a.time.split(' - ')[0];
      const timeB = b.time.split(' - ')[0];
      return timeA.localeCompare(timeB);
    });
  });
  
  // Convert to array format for component rendering
  return dayNames.map(day => ({
    day,
    classes: scheduleByDay[day]
  })).filter(daySchedule => daySchedule.classes.length > 0);
}

// Updated getStudentDashboard function
export async function getStudentDashboard() {
  try {
    // Get the current user's ID
    const userId = await getCurrentUserId();

    if (!userId) {
      throw new Error('No user ID available');
    }

    // Use the fetchWithAuth helper to make the API request
    const dashboardData = await fetchWithAuth(
      `/api/student/dashboard?userId=${userId}`
    );

    // Since API now returns formatted data, just return it directly
    return dashboardData;
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    throw error;
  }
}


export async function getAttendanceSummary() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }

    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const data = await fetchWithAuth(
      `/api/student/attendance?userId=${userId}&_t=${timestamp}`
    );

    // Log the data to debug
    console.log('Attendance data from API:', data);

    return data;
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    throw error;
  }
}

// Get detailed attendance records for a specific course - improved error handling
export async function getCourseAttendanceDetails(courseId) {
  try {
    const userId = await getCurrentUserId();
    if (!userId || !courseId) {
      throw new Error('Missing userId or courseId');
    }

    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const data = await fetchWithAuth(
      `/api/student/attendance?userId=${userId}&courseId=${courseId}&_t=${timestamp}`
    );

    // Log the data to debug
    console.log(`Course attendance details for course ${courseId}:`, data);

    return data;
  } catch (error) {
    console.error('Error fetching course attendance details:', error);
    throw error;
  }
}

// Get class schedule
export async function getClassSchedule() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    return await fetchWithAuth(`/api/student/classSchedule?userId=${userId}`);
  } catch (error) {
    console.error('Error fetching class schedule:', error);
    throw error;
  }
}

// Get student invoices
export async function getStudentInvoices() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    return await fetchWithAuth(`/api/student/invoice?userId=${userId}`);
  } catch (error) {
    console.error('Error fetching student invoices:', error);
    throw error;
  }
}

// Get student profile data
export async function getStudentProfile() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }

    const studentData = await fetchWithAuth(
      `/api/student/profile?userId=${userId}`
    );

    // Ensure enrolledCourses is always defined even if the API response structure has changed
    return {
      ...studentData,
      enrolledCourses: studentData.enrolledCourses || [],
    };
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw error;
  }
}

// Get upcoming events
export async function getUpcomingEventsList() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    return await fetchWithAuth(`/api/student/events?userId=${userId}`);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
}



// Get received messages
export async function getReceivedMessages() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    
    const response = await fetchWithAuth(`/api/student/messages/inbox?userId=${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching received messages:', error);
    // Return mock data instead of throwing
    return [
      {
        id: 1,
        subject: "Important: Class Schedule Change",
        content: "Dear Student,\n\nPlease note that the Database Systems class scheduled for tomorrow has been moved to Room 203.\n\nBest regards,\nProf. Williams",
        sent_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        sender_id: 3,
        sender_type: "faculty",
        sender_name: "Prof. Williams",
        sender_email: "williams@university.edu",
        read: false
      },
      {
        id: 2,
        subject: "Reminder: Assignment Due Date",
        content: "This is a reminder that your Data Structures assignment is due this Friday by 11:59 PM. Please make sure to submit it through the course portal.",
        sent_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        sender_id: 2,
        sender_type: "faculty",
        sender_name: "Dr. Johnson",
        sender_email: "johnson@university.edu",
        read: true
      },
      {
        id: 3,
        subject: "Tuition Payment Confirmation",
        content: "This is to confirm that we have received your tuition payment for the current semester. Thank you.",
        sent_at: new Date(Date.now() - 7 * 86400000).toISOString(), // 1 week ago
        sender_id: 1,
        sender_type: "admin",
        sender_name: "Finance Department",
        sender_email: "finance@university.edu",
        read: true
      }
    ];
  }
}

// Get sent messages
export async function getSentMessages() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    
    const response = await fetchWithAuth(`/api/student/messages/sent?userId=${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    // Return mock data instead of throwing
    return [
      {
        id: 1,
        subject: "Question about Final Project",
        content: "Dear Prof. Williams,\n\nI have a question regarding the requirements for the final project. Could you please clarify if we need to include a database component?\n\nThank you,\nJohn Student",
        sent_at: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
        recipient_id: 3,
        recipient_type: "faculty",
        recipient_name: "Prof. Williams",
        recipient_email: "williams@university.edu"
      },
      {
        id: 2,
        subject: "Request for Appointment",
        content: "Dear Dr. Johnson,\n\nI would like to schedule an appointment to discuss my progress in the course. Would you be available sometime next week?\n\nBest regards,\nJohn Student",
        sent_at: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
        recipient_id: 2,
        recipient_type: "faculty",
        recipient_name: "Dr. Johnson",
        recipient_email: "johnson@university.edu"
      }
    ];
  }
}

// Send a new message
export async function sendMessage(messageData) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    
    const response = await fetchWithAuth('/api/student/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        ...messageData,
        sender_id: userId,
        sender_type: 'student'
      })
    });
    
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}