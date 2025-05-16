import { getCurrentUserId, fetchWithAuth } from './common';

// Get current faculty profile data
export async function getCurrentFaculty() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    return await fetchWithAuth(`/api/faculty/profile?userId=${userId}`);
  } catch (error) {
    console.error('Error fetching faculty profile:', error);
    throw error;
  }
}

// Get faculty statistics dashboard
export async function getFacultyStats() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    return await fetchWithAuth(`/api/faculty/stats?userId=${userId}`);
  } catch (error) {
    console.error('Error fetching faculty stats:', error);
    throw error;
  }
}

// Get faculty's class schedule
export async function getClassSchedule() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    return await fetchWithAuth(`/api/faculty/classSchedule?userId=${userId}`);
  } catch (error) {
    console.error('Error fetching class schedule:', error);
    throw error;
  }
}

// Get faculty's today's classes schedule
export async function getFacultyTodayClassesSchedule() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    return await fetchWithAuth(`/api/faculty/todayClasses?userId=${userId}`);
  } catch (error) {
    console.error("Error fetching today's classes:", error);
    throw error;
  }
}

// Get faculty's class attendance data
export async function getClassAttendance(classId) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    const url = classId
      ? `/api/faculty/attendance?userId=${userId}&classId=${classId}`
      : `/api/faculty/attendance?userId=${userId}`;

    return await fetchWithAuth(url);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw error;
  }
}

// Save attendance for a class
export async function saveAttendance(classId, attendanceData) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }

    return await fetchWithAuth(`/api/faculty/attendance/save`, {
      method: 'POST',
      body: JSON.stringify({
        facultyId: userId,
        classId,
        attendanceData,
      }),
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    throw error;
  }
}

// Get upcoming events for faculty
export async function getUpcomingEventsList() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    return await fetchWithAuth(`/api/faculty/events?userId=${userId}`);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
}

// Get faculty leave requests
export async function getFacultyLeaveRequests() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    return await fetchWithAuth(`/api/faculty/leaveRequests?userId=${userId}`);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    throw error;
  }
}

// Submit new leave request
export async function submitLeaveRequest(leaveData) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }

    return await fetchWithAuth(`/api/faculty/leaveRequests/submit`, {
      method: 'POST',
      body: JSON.stringify({
        facultyId: userId,
        startDate: leaveData.leaveDate, 
        reason: leaveData.reason,
        departmentId: leaveData.departmentId,
        classId: leaveData.classId,
        sectionId: leaveData.sectionId,
        courseId: leaveData.courseId,
      }),
    });
  } catch (error) {
    console.error('Error submitting leave request:', error);
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
    
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    return await fetchWithAuth(`/api/faculty/messages/inbox?userId=${userId}&_t=${timestamp}`);
  } catch (error) {
    console.error('Error fetching received messages:', error);
    throw error;
  }
}

// Get sent messages
export async function getSentMessages() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    return await fetchWithAuth(`/api/faculty/messages/sent?userId=${userId}&_t=${timestamp}`);
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    throw error;
  }
}

// Send a new message
export async function sendMessage(messageData) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }

    return await fetchWithAuth(`/api/faculty/messages/send`, {
      method: 'POST',
      body: JSON.stringify({
        sender_id: userId,
        sender_type: 'faculty',
        ...messageData,
      }),
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Check for leave-related messages
export async function getLeaveRelatedMessages() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    
    // Get messages specifically related to leave requests
    // Uses a query parameter to filter messages by subject content
    return await fetchWithAuth(`/api/faculty/messages/inbox?userId=${userId}&filter=leave`);
  } catch (error) {
    console.error('Error fetching leave-related messages:', error);
    throw error;
  }
}

// Get faculty's class sections data
export async function getFacultyClassSections() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }

    // We'll use the class schedule endpoint to get the faculty's classes and sections
    const schedule = await getClassSchedule();

    // Extract unique department, class, section combinations
    const sections = [];
    const uniqueCombos = new Set();

    schedule.forEach((item) => {
      const combo = `${item.departmentId}-${item.classId}-${item.sectionId}-${item.courseId}`;

      if (!uniqueCombos.has(combo)) {
        uniqueCombos.add(combo);

        sections.push({
          departmentId: item.departmentId,
          department: item.department || 'Computer Science', // Fallback if not present
          classId: item.classId,
          class_name: item.class_name,
          sectionId: item.sectionId,
          section_name: item.section_name,
          courseId: item.courseId,
          course_name: item.course_name || item.course || 'Unknown Course', // Use correct field name
        });
      }
    });

    return sections;
  } catch (error) {
    console.error('Error fetching faculty class sections:', error);
    return [];
  }
}


// Update leave request status (approve/reject)
export async function updateLeaveRequestStatus(leaveRequestId, status, comments = "") {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }

    return await fetchWithAuth(`/api/faculty/leaveRequests/updateStatus`, {
      method: 'PUT',
      body: JSON.stringify({
        leaveRequestId,
        status,
        comments
      }),
    });
  } catch (error) {
    console.error('Error updating leave request status:', error);
    throw error;
  }
}

// Get pending leave requests for sections where faculty is the advisor
export async function getAdvisedSectionsLeaveRequests() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No user ID available');
    }
    
    return await fetchWithAuth(`/api/faculty/leaveRequests/advised?userId=${userId}`);
  } catch (error) {
    console.error('Error fetching advised sections leave requests:', error);
    throw error;
  }
}