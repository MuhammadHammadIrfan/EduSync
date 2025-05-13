import { 
  mockStudents, 
  mockFaculty, 
  mockDepartments, 
  mockClasses, 
  mockSections,
  mockCourses,
  mockSchedules,
  mockAttendance,
  mockEvents,
  mockInvoices,
  mockMessages,
  mockLeaveRequests,
  mockAttendanceAnalytics,
  mockDepartmentDistribution,
  mockFacultyPerformance,
  mockRevenueData,
} from './mockData';

// adminApi.js
// Utility to generate a new ID based on the last event

// Simulated backend call to add a course
export const handleFormSubmit = async (newCourse) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!newCourse.name || !newCourse.department || !newCourse.class || !newCourse.faculty) {
        reject(new Error('Missing required fields'));
      } else {
        // Simulate returning new course with an ID
        const createdCourse = {
          ...newCourse,
          id: Date.now(), // Unique ID for demonstration
        };
        resolve(createdCourse);
      }
    }, 1000); // simulate 1s API delay
  });
};


export const generateMockFacultyAttendance = (facultyId, month) => {
  const records = [];
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(month.getFullYear(), month.getMonth(), i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const randomStatus = Math.random();
    let status;
    let hoursTaught = 0;
    if (randomStatus < 0.85) {
      status = 'Present';
      hoursTaught = Math.floor(Math.random() * 4) + 2;
    } else if (randomStatus < 0.95) {
      status = 'Absent';
    } else {
      status = 'Leave';
    }
    records.push({ date: formatDate(date, 'yyyy-MM-dd'), status, hoursTaught });
  }
  return records;
};

export const generateMockStudentAttendance = (studentIds, month) => {
  const records = [];
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(month.getFullYear(), month.getMonth(), i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    for (const studentId of studentIds) {
      const randomStatus = Math.random();
      let status;
      if (randomStatus < 0.9) {
        status = 'Present';
      } else {
        status = 'Absent';
      }
      records.push({
        studentId,
        date: formatDate(date, 'yyyy-MM-dd'),
        status
      });
    }
  }
  return records;
};

export const getFacultyByDepartment = (department) => {
  if (!department) return mockFaculty;
  return mockFaculty.filter(f => f.department === department);
};

export const getStudentsByFilters = ({ department, class: studentClass, section }) => {
  return mockStudents.filter(s => {
    if (department && s.department !== department) return false;
    if (studentClass && s.class !== studentClass) return false;
    if (section && s.section !== section) return false;
    return true;
  });
};


function formatDate(date, formatStr) {
  const pad = (num) => num.toString().padStart(2, '0');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = date.getDay();

  const formats = {
    'yyyy': year,
    'MM': pad(month),
    'dd': pad(day),
    'PPP': `${monthNames[date.getMonth()]} ${day}, ${year}`,
    'E': dayNames[weekday],
    'MMMM': monthNames[date.getMonth()],
    'yyyy-MM-dd': `${year}-${pad(month)}-${pad(day)}`
  };
  
  return formatStr.replace(/yyyy|MM|dd|PPP|E|MMMM/g, match => formats[match]);
}


export const generateMockDepartments = () => {
  return [
    { id: 1, name: 'Computer Science', totalStudents: 120 },
    { id: 2, name: 'Electrical Engineering', totalStudents: 90 },
    { id: 3, name: 'Mechanical Engineering', totalStudents: 80 },
    { id: 4, name: 'Mathematics', totalStudents: 60 },
    { id: 5, name: 'Physics', totalStudents: 50 }
  ];
};

export const generateMockClasses = (departmentId) => {
  const classNames = ['A', 'B', 'C', 'D'];
  return classNames.map((name, i) => ({
    id: departmentId * 10 + i + 1,
    name: `Class ${name}`,
    departmentId: departmentId,
    totalStudents: Math.floor(Math.random() * 30) + 20
  }));
};

export const generateMockSections = (classId) => {
  const sectionNames = ['Section 1', 'Section 2', 'Section 3'];
  return sectionNames.map((name, i) => ({
    id: classId * 10 + i + 1,
    name: name,
    classId: classId,
    totalStudents: Math.floor(Math.random() * 15) + 10
  }));
};

export const generateMockStudents = (sectionId) => {
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller'];
  
  return Array.from({ length: 10 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const totalDays = 20; // Assuming 20 working days in a month
    
    return {
      id: sectionId * 100 + i + 1,
      name: `${firstName} ${lastName}`,
      sectionId: sectionId,
      presentDays: Math.floor(Math.random() * 18) + 2, // 2-20 days
      absentDays: Math.floor(Math.random() * 3),
      lateDays: Math.floor(Math.random() * 5),
      totalDays: totalDays
    };
  });
};

export const generateMockFaculty = () => {
  const departments = ['Computer Science', 'Electrical Engineering', 'Mathematics', 'Physics'];
  const firstNames = ['Robert', 'Jennifer', 'Thomas', 'Lisa', 'William', 'Patricia'];
  const lastNames = ['Anderson', 'Martinez', 'Taylor', 'Hernandez', 'Moore', 'Clark'];
  
  return departments.flatMap(dept => 
    Array.from({ length: 3 }, (_, i) => ({
      id: `${dept.substring(0, 2).toUpperCase()}${i + 1}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      department: dept
    }))
  );
};

export const generateMockMonthlyFacultyAttendance = (facultyId) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    presentDays: Math.floor(Math.random() * 18) + 2, // 2-20 days
    absentDays: Math.floor(Math.random() * 3),
    leaveDays: Math.floor(Math.random() * 5),
    totalDays: 20 // Assuming 20 working days per month
  }));
};

// Helper function to generate IDs
const generateId = (items) => {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
};

// =========== USER MANAGEMENT ===========

export const getUsers = async (queryParams = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { role, departmentId, classId, sectionId, search } = queryParams;
  
  let userData = role === 'faculty' ? [...mockFaculty] : [...mockStudents];
  
  if (departmentId) {
    userData = userData.filter(user => user.departmentId === parseInt(departmentId));
  }
  
  if (classId && role === 'student') {
    userData = userData.filter(user => user.classId === parseInt(classId));
  }
  
  if (sectionId && role === 'student') {
    userData = userData.filter(user => user.sectionId === parseInt(sectionId));
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    userData = userData.filter(user => 
      user.name.toLowerCase().includes(searchLower) || 
      user.email.toLowerCase().includes(searchLower) ||
      (user.roll_number && user.roll_number.toLowerCase().includes(searchLower))
    );
  }
  
  const usersWithDetails = userData.map(user => {
    const department = mockDepartments.find(d => d.id === user.departmentId);
    let classInfo, section;
    
    if (role === 'student') {
      classInfo = mockClasses.find(c => c.id === user.classId);
      section = mockSections.find(s => s.id === user.sectionId);
    }
    
    return {
      ...user,
      department,
      class: classInfo,
      section
    };
  });
  
  return usersWithDetails;
};

export const getDepartments = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockDepartments];
};

export const getClasses = async (departmentId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let classData = [...mockClasses];
  
  if (departmentId) {
    classData = classData.filter(cls => cls.departmentId === parseInt(departmentId));
  }
  
  const classesWithDetails = classData.map(cls => {
    const department = mockDepartments.find(d => d.id === cls.departmentId);
    return {
      ...cls,
      department
    };
  });
  
  return classesWithDetails;
};

export const getSections = async (classId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let sectionData = [...mockSections];
  
  if (classId) {
    sectionData = sectionData.filter(section => section.classId === parseInt(classId));
  }
  
  const sectionsWithDetails = sectionData.map(section => {
    const classInfo = mockClasses.find(c => c.id === section.classId);
    const department = mockDepartments.find(d => d.id === classInfo?.departmentId);
    
    return {
      ...section,
      class: classInfo,
      department
    };
  });
  
  return sectionsWithDetails;
};

export const createUser = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const isFaculty = userData.role === 'faculty';
  const newId = isFaculty ? generateId(mockFaculty) : generateId(mockStudents);
  
  const baseUser = {
    id: newId,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    gender: userData.gender,
    departmentId: parseInt(userData.departmentId),
    password_hash: 'hashed_' + userData.password,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  let newUser;
  
  if (isFaculty) {
    newUser = {
      ...baseUser,
      position: userData.position,
      qualification: userData.qualification,
      date_of_joining: userData.date_of_joining,
      address: userData.address
    };
    mockFaculty.push(newUser);
  } else {
    newUser = {
      ...baseUser,
      classId: parseInt(userData.classId),
      sectionId: parseInt(userData.sectionId),
      roll_number: userData.roll_number,
      address: userData.address,
      date_of_birth: userData.date_of_birth,
      parent_name: userData.parent_name,
      parent_phone: userData.parent_phone,
      admission_date: userData.admission_date
    };
    mockStudents.push(newUser);
  }
  
  const department = mockDepartments.find(d => d.id === newUser.departmentId);
  let classInfo, section;
  
  if (!isFaculty) {
    classInfo = mockClasses.find(c => c.id === newUser.classId);
    section = mockSections.find(s => s.id === newUser.sectionId);
  }
  
  return {
    ...newUser,
    department,
    class: classInfo,
    section
  };
};

export const updateUser = async (userId, userData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const id = parseInt(userId);
  const isStudent = userData.role === 'student';
  
  let userIndex, user;
  
  if (isStudent) {
    userIndex = mockStudents.findIndex(s => s.id === id);
    if (userIndex === -1) throw new Error('Student not found');
    user = mockStudents[userIndex];
  } else {
    userIndex = mockFaculty.findIndex(f => f.id === id);
    if (userIndex === -1) throw new Error('Faculty not found');
    user = mockFaculty[userIndex];
  }
  
  const updatedUser = {
    ...user,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    gender: userData.gender,
    departmentId: parseInt(userData.departmentId),
    updated_at: new Date().toISOString()
  };
  
  if (userData.password) {
    updatedUser.password_hash = 'hashed_' + userData.password;
  }
  
  if (isStudent) {
    updatedUser.classId = parseInt(userData.classId);
    updatedUser.sectionId = parseInt(userData.sectionId);
    updatedUser.roll_number = userData.roll_number;
    updatedUser.address = userData.address;
    updatedUser.date_of_birth = userData.date_of_birth;
    updatedUser.parent_name = userData.parent_name;
    updatedUser.parent_phone = userData.parent_phone;
    mockStudents[userIndex] = updatedUser;
  } else {
    updatedUser.position = userData.position;
    updatedUser.qualification = userData.qualification;
    updatedUser.address = userData.address;
    mockFaculty[userIndex] = updatedUser;
  }
  
  const department = mockDepartments.find(d => d.id === updatedUser.departmentId);
  let classInfo, section;
  
  if (isStudent) {
    classInfo = mockClasses.find(c => c.id === updatedUser.classId);
    section = mockSections.find(s => s.id === updatedUser.sectionId);
  }
  
  return {
    ...updatedUser,
    department,
    class: classInfo,
    section
  };
};

export const deleteUser = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const id = parseInt(userId);
  const studentIndex = mockStudents.findIndex(s => s.id === id);
  
  if (studentIndex !== -1) {
    mockStudents.splice(studentIndex, 1);
    return true;
  }
  
  const facultyIndex = mockFaculty.findIndex(f => f.id === id);
  if (facultyIndex !== -1) {
    mockFaculty.splice(facultyIndex, 1);
    return true;
  }
  
  throw new Error('User not found');
};

// =========== COURSES ===========

export const getCourses = async (queryParams = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { departmentId, search } = queryParams;
  
  let courses = [...mockCourses];
  
  if (departmentId) {
    courses = courses.filter(course => course.departmentId === parseInt(departmentId));
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    courses = courses.filter(course => 
      course.name.toLowerCase().includes(searchLower) || 
      course.course_code.toLowerCase().includes(searchLower)
    );
  }
  
  const coursesWithDetails = courses.map(course => {
    const department = mockDepartments.find(d => d.id === course.departmentId);
    return {
      ...course,
      department
    };
  });
  
  return coursesWithDetails;
};

export const createCourse = async (courseData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newId = generateId(mockCourses);
  
  const newCourse = {
    ...courseData,
    id: newId,
    departmentId: parseInt(courseData.departmentId),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockCourses.push(newCourse);
  
  const department = mockDepartments.find(d => d.id === newCourse.departmentId);
  
  return {
    ...newCourse,
    department
  };
};

export const updateCourse = async (courseId, courseData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const id = parseInt(courseId);
  const courseIndex = mockCourses.findIndex(c => c.id === id);
  
  if (courseIndex === -1) throw new Error('Course not found');
  
  const course = mockCourses[courseIndex];
  
  const updatedCourse = {
    ...course,
    ...courseData,
    id,
    updated_at: new Date().toISOString()
  };
  
  mockCourses[courseIndex] = updatedCourse;
  
  const department = mockDepartments.find(d => d.id === updatedCourse.departmentId);
  
  return {
    ...updatedCourse,
    department
  };
};

export const deleteCourse = async (courseId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const id = parseInt(courseId);
  const courseIndex = mockCourses.findIndex(c => c.id === id);
  
  if (courseIndex === -1) throw new Error('Course not found');
  
  mockCourses.splice(courseIndex, 1);
  
  return true;
};

// =========== TIMETABLE / SCHEDULES ===========

export const getSchedules = async (queryParams = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { view_type, departmentId, classId, sectionId, facultyId, day } = queryParams;
  
  let schedules = [...mockSchedules];
  
  if (day) {
    schedules = schedules.filter(schedule => schedule.day_of_week === day);
  }
  
  if (view_type === 'student') {
    if (departmentId) {
      schedules = schedules.filter(schedule => {
        const classInfo = mockClasses.find(c => c.id === schedule.classId);
        return classInfo?.departmentId === parseInt(departmentId);
      });
    }
    
    if (classId) {
      schedules = schedules.filter(schedule => schedule.classId === parseInt(classId));
    }
    
    if (sectionId) {
      schedules = schedules.filter(schedule => schedule.sectionId === parseInt(sectionId));
    }
  } else {
    if (facultyId) {
      schedules = schedules.filter(schedule => schedule.facultyId === parseInt(facultyId));
    }
    
    if (departmentId) {
      schedules = schedules.filter(schedule => {
        const faculty = mockFaculty.find(f => f.id === schedule.facultyId);
        return faculty?.departmentId === parseInt(departmentId);
      });
    }
  }
  
  const schedulesWithRelated = schedules.map(schedule => {
    const course = mockCourses.find(c => c.id === schedule.courseId);
    const faculty = mockFaculty.find(f => f.id === schedule.facultyId);
    const classInfo = mockClasses.find(c => c.id === schedule.classId);
    const section = mockSections.find(s => s.id === schedule.sectionId);
    const department = mockDepartments.find(d => d.id === classInfo?.departmentId);
    
    // Make sure day, date, and room number are extracted correctly
    return {
      ...schedule,
      course,
      faculty,
      class: classInfo,
      section,
      department,
      // Extract day and date properly
      day_of_week: schedule.day_of_week,
      date: schedule.date || 'Invalid Date', // Ensure date is set properly in your schedule
      room: section ? section.room_no : 'N/A', // Ensure room is fetched from section
    };
  });
  
  return schedulesWithRelated;
};


export const createSchedule = async (scheduleData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newId = generateId(mockSchedules);
  
  const newSchedule = {
    ...scheduleData,
    id: newId,
    courseId: parseInt(scheduleData.courseId),
    facultyId: parseInt(scheduleData.facultyId),
    classId: parseInt(scheduleData.classId),
    sectionId: parseInt(scheduleData.sectionId)
  };
  
  mockSchedules.push(newSchedule);
  
  const course = mockCourses.find(c => c.id === newSchedule.courseId);
  const faculty = mockFaculty.find(f => f.id === newSchedule.facultyId);
  const classInfo = mockClasses.find(c => c.id === newSchedule.classId);
  const section = mockSections.find(s => s.id === newSchedule.sectionId);
  const department = mockDepartments.find(d => d.id === classInfo?.departmentId);
  
  return {
    ...newSchedule,
    course,
    faculty,
    class: classInfo,
    section,
    department
  };
};

export const updateSchedule = async (scheduleId, scheduleData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const id = parseInt(scheduleId);
  const scheduleIndex = mockSchedules.findIndex(s => s.id === id);
  
  if (scheduleIndex === -1) throw new Error('Schedule not found');
  
  const schedule = mockSchedules[scheduleIndex];
  
  const updatedSchedule = {
    ...schedule,
    ...scheduleData,
    id
  };
  
  mockSchedules[scheduleIndex] = updatedSchedule;
  
  const course = mockCourses.find(c => c.id === updatedSchedule.courseId);
  const faculty = mockFaculty.find(f => f.id === updatedSchedule.facultyId);
  const classInfo = mockClasses.find(c => c.id === updatedSchedule.classId);
  const section = mockSections.find(s => s.id === updatedSchedule.sectionId);
  const department = mockDepartments.find(d => d.id === classInfo?.departmentId);
  
  return {
    ...updatedSchedule,
    course,
    faculty,
    class: classInfo,
    section,
    department
  };
};

export const deleteSchedule = async (scheduleId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const id = parseInt(scheduleId);
  const scheduleIndex = mockSchedules.findIndex(s => s.id === id);
  
  if (scheduleIndex === -1) throw new Error('Schedule not found');
  
  mockSchedules.splice(scheduleIndex, 1);
  
  return true;
};

// =========== ATTENDANCE ===========

export const getAttendance = async (queryParams = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { view_type, departmentId, classId, sectionId, courseId, facultyId, date, status } = queryParams;
  
  let attendance = [...mockAttendance];
  
  if (date) {
    attendance = attendance.filter(a => a.date === date);
  }
  
  if (status) {
    attendance = attendance.filter(a => a.status === status);
  }
  
  if (view_type === 'student') {
    if (courseId) {
      attendance = attendance.filter(a => a.courseId === parseInt(courseId));
    }
    
    if (departmentId || classId || sectionId) {
      attendance = attendance.filter(a => {
        const student = mockStudents.find(s => s.id === a.studentId);
        if (!student) return false;
        
        if (departmentId && student.departmentId !== parseInt(departmentId)) return false;
        if (classId && student.classId !== parseInt(classId)) return false;
        if (sectionId && student.sectionId !== parseInt(sectionId)) return false;
        
        return true;
      });
    }
  } else {
    if (facultyId) {
      const facultyCourses = mockSchedules
        .filter(s => s.facultyId === parseInt(facultyId))
        .map(s => s.courseId);
      
      attendance = attendance.filter(a => facultyCourses.includes(a.courseId));
    }
  }
  
  const attendanceWithRelated = attendance.map(record => {
    const student = mockStudents.find(s => s.id === record.studentId);
    const course = mockCourses.find(c => c.id === record.courseId);
    const faculty = mockFaculty.find(f => 
      mockSchedules.some(s => 
        s.courseId === record.courseId && 
        s.facultyId === f.id
      )
    );
    const classInfo = mockClasses.find(c => c.id === student?.classId);
    const section = mockSections.find(s => s.id === student?.sectionId);
    const department = mockDepartments.find(d => d.id === student?.departmentId);
    
    return {
      ...record,
      student,
      course,
      faculty,
      class: classInfo,
      section,
      department
    };
  });
  
  return attendanceWithRelated;
};

export const updateAttendance = async (attendanceId, data) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const id = parseInt(attendanceId);
  const attendanceIndex = mockAttendance.findIndex(a => a.id === id);
  
  if (attendanceIndex === -1) throw new Error('Attendance record not found');
  
  const attendance = mockAttendance[attendanceIndex];
  
  const updatedAttendance = {
    ...attendance,
    status: data.status
  };
  
  mockAttendance[attendanceIndex] = updatedAttendance;
  
  const student = mockStudents.find(s => s.id === updatedAttendance.studentId);
  const course = mockCourses.find(c => c.id === updatedAttendance.courseId);
  
  return {
    ...updatedAttendance,
    student,
    course
  };
};

export const getAttendanceAnalytics = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAttendanceAnalytics;
};

// =========== EVENTS ===========

export const getEvents = async (queryParams) => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

  // Filter mockEvents based on queryParams
  const filteredEvents = mockEvents.filter(event => {
    const matchesAudience = queryParams.audienceTypes.length
      ? queryParams.audienceTypes.includes(event.audience_type)
      : true;
    const matchesDate = queryParams.eventDates.length
      ? queryParams.eventDates.includes(event.event_date)
      : true;
    return matchesAudience && matchesDate;
  });

  return filteredEvents;
};

export const createEvent = async (eventData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newId = generateId(mockEvents);
  
  const newEvent = {
    ...eventData,
    id: newId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockEvents.push(newEvent);
  
  return newEvent;
};

export const updateEvent = async (eventId, eventData) => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const id = parseInt(eventId);  // Ensure the eventId is converted to an integer
  const eventIndex = mockEvents.findIndex(e => e.id === id);

  if (eventIndex === -1) throw new Error('Event not found');

  const event = mockEvents[eventIndex];

  const updatedEvent = {
    ...event,
    ...eventData,
    id,
    updated_at: new Date().toISOString()  // Update the timestamp
  };

  mockEvents[eventIndex] = updatedEvent;

  return updatedEvent;
};

export const deleteEvent = async (eventId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const id = parseInt(eventId);
  const eventIndex = mockEvents.findIndex(e => e.id === id);
  
  if (eventIndex === -1) throw new Error('Event not found');
  
  mockEvents.splice(eventIndex, 1);
  
  return true;
};

// =========== INVOICES ===========

export const getInvoices = async (queryParams = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const { studentId, paid, from_date, to_date, category } = queryParams;

  let invoices = [...mockInvoices];

  if (studentId) {
    invoices = invoices.filter(invoice => invoice.studentId === parseInt(studentId));
  }

  if (paid !== undefined) {
    const isPaid = paid === 'true' || paid === true;
    invoices = invoices.filter(invoice => invoice.paid === isPaid);
  }

  if (from_date) {
    const fromDate = new Date(from_date);
    invoices = invoices.filter(invoice => new Date(invoice.generated_at) >= fromDate);
  }

  if (to_date) {
    const toDate = new Date(to_date);
    invoices = invoices.filter(invoice => new Date(invoice.generated_at) <= toDate);
  }

  if (category) {
    invoices = invoices.filter(invoice => invoice.category === category);
  }

  const invoicesWithStudents = invoices.map(invoice => {
    const student = mockStudents.find(s => s.id === invoice.studentId);
    return {
      ...invoice,
      student
    };
  });

  return invoicesWithStudents;
};

export const createInvoice = async (invoiceData) => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const newId = generateId(mockInvoices);

  const today = new Date();
  const invoiceNumber = `INV-${today.getFullYear()}-${String(newId).padStart(3, '0')}`;

  const newInvoice = {
    ...invoiceData,
    id: newId,
    invoice_number: invoiceNumber,
    paid: false,
    generated_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  mockInvoices.push(newInvoice);

  const student = mockStudents.find(s => s.id === newInvoice.studentId);

  return {
    ...newInvoice,
    student
  };
};

export const updateInvoice = async (invoiceId, invoiceData) => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const id = parseInt(invoiceId);
  const invoiceIndex = mockInvoices.findIndex(i => i.id === id);

  if (invoiceIndex === -1) throw new Error('Invoice not found');

  const invoice = mockInvoices[invoiceIndex];

  const updatedInvoice = {
    ...invoice,
    ...invoiceData,
    id,
    updated_at: new Date().toISOString()
  };

  mockInvoices[invoiceIndex] = updatedInvoice;

  const student = mockStudents.find(s => s.id === updatedInvoice.studentId);

  return {
    ...updatedInvoice,
    student
  };
};

export const deleteInvoice = async (invoiceId) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const id = parseInt(invoiceId);
  const invoiceIndex = mockInvoices.findIndex(i => i.id === id);

  if (invoiceIndex === -1) throw new Error('Invoice not found');

  mockInvoices.splice(invoiceIndex, 1);

  return true;
};

export const markInvoicePaid = async (invoiceId) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const id = parseInt(invoiceId);
  const invoiceIndex = mockInvoices.findIndex(i => i.id === id);

  if (invoiceIndex === -1) throw new Error('Invoice not found');

  const invoice = mockInvoices[invoiceIndex];

  const updatedInvoice = {
    ...invoice,
    paid: true,
    paid_date: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  mockInvoices[invoiceIndex] = updatedInvoice;

  const student = mockStudents.find(s => s.id === updatedInvoice.studentId);

  return {
    ...updatedInvoice,
    student
  };
};

// =========== MESSAGES ===========

export const getMessages = async (queryParams = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { filter } = queryParams;
  const adminId = 1;
  
  let messages = [...mockMessages];
  
  if (filter === 'inbox') {
    messages = messages.filter(msg => msg.receiver_id === adminId && msg.receiver_type === 'admin');
  } else if (filter === 'sent') {
    messages = messages.filter(msg => msg.sender_id === adminId && msg.sender_type === 'admin');
  } else {
    messages = messages.filter(msg => 
      (msg.sender_id === adminId && msg.sender_type === 'admin') ||
      (msg.receiver_id === adminId && msg.receiver_type === 'admin')
    );
  }
  
  const enhancedMessages = messages.map(message => {
    let senderName = 'Unknown';
    let receiverName = 'Unknown';
    
    if (message.sender_type === 'student') {
      const student = mockStudents.find(s => s.id === message.sender_id);
      senderName = student ? student.name : 'Unknown Student';
    } else if (message.sender_type === 'faculty') {
      const faculty = mockFaculty.find(f => f.id === message.sender_id);
      senderName = faculty ? faculty.name : 'Unknown Faculty';
    } else if (message.sender_type === 'admin') {
      senderName = 'Admin User';
    }
    
    if (message.receiver_type === 'student') {
      const student = mockStudents.find(s => s.id === message.receiver_id);
      receiverName = student ? student.name : 'Unknown Student';
    } else if (message.receiver_type === 'faculty') {
      const faculty = mockFaculty.find(f => f.id === message.receiver_id);
      receiverName = faculty ? faculty.name : 'Unknown Faculty';
    } else if (message.receiver_type === 'admin') {
      receiverName = 'Admin User';
    }
    
    return {
      ...message,
      sender_name: senderName,
      receiver_name: receiverName
    };
  });
  
  return enhancedMessages;
};

export const sendMessage = async (messageData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newId = generateId(mockMessages);
  const adminId = 1;
  
  const newMessage = {
    ...messageData,
    id: newId,
    sender_id: adminId,
    sender_type: 'admin',
    sent_at: new Date().toISOString()
  };
  
  mockMessages.push(newMessage);
  
  let receiverName = 'Unknown';
  
  if (newMessage.receiver_type === 'student') {
    const student = mockStudents.find(s => s.id === newMessage.receiver_id);
    receiverName = student ? student.name : 'Unknown Student';
  } else if (newMessage.receiver_type === 'faculty') {
    const faculty = mockFaculty.find(f => f.id === newMessage.receiver_id);
    receiverName = faculty ? faculty.name : 'Unknown Faculty';
  } else if (newMessage.receiver_type === 'admin') {
    const admin = mockStudents.find(a => a.id === newMessage.receiver_id);
    receiverName = admin ? admin.name : 'Admin User';
  }
  
  return {
    ...newMessage,
    sender_name: 'Admin User',
    receiver_name: receiverName
  };
};

export const deleteMessage = async (messageId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const id = parseInt(messageId);
  const messageIndex = mockMessages.findIndex(m => m.id === id);
  
  if (messageIndex === -1) throw new Error('Message not found');
  
  mockMessages.splice(messageIndex, 1);
  
  return true;
};

// =========== LEAVE REQUESTS ===========

export const getLeaveRequests = async (queryParams = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { status, departmentId, facultyId, date_from, date_to } = queryParams;
  
  let leaveRequests = [...mockLeaveRequests];
  
  if (status) {
    leaveRequests = leaveRequests.filter(request => request.status === status);
  }
  
  if (departmentId) {
    leaveRequests = leaveRequests.filter(request => request.departmentId === parseInt(departmentId));
  }
  
  if (facultyId) {
    leaveRequests = leaveRequests.filter(request => request.facultyId === parseInt(facultyId));
  }
  
  if (date_from) {
    const fromDate = new Date(date_from);
    leaveRequests = leaveRequests.filter(request => new Date(request.leave_date) >= fromDate);
  }
  
  if (date_to) {
    const toDate = new Date(date_to);
    leaveRequests = leaveRequests.filter(request => new Date(request.leave_date) <= toDate);
  }
  
  const requestsWithRelated = leaveRequests.map(request => {
    const faculty = mockFaculty.find(f => f.id === request.facultyId);
    const department = mockDepartments.find(d => d.id === request.departmentId);
    const classInfo = mockClasses.find(c => c.id === request.classId);
    const section = mockSections.find(s => s.id === request.sectionId);
    const course = mockCourses.find(c => c.id === request.courseId);
    
    return {
      ...request,
      faculty,
      department,
      class: classInfo,
      section,
      course
    };
  });
  
  return requestsWithRelated;
};

export const createLeaveRequest = async (leaveData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newId = generateId(mockLeaveRequests);
  
  const newRequest = {
    ...leaveData,
    id: newId,
    status: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockLeaveRequests.push(newRequest);
  
  const faculty = mockFaculty.find(f => f.id === newRequest.facultyId);
  const department = mockDepartments.find(d => d.id === newRequest.departmentId);
  const classInfo = mockClasses.find(c => c.id === newRequest.classId);
  const section = mockSections.find(s => s.id === newRequest.sectionId);
  const course = mockCourses.find(c => c.id === newRequest.courseId);
  
  return {
    ...newRequest,
    faculty,
    department,
    class: classInfo,
    section,
    course
  };
};

export const updateLeaveStatus = async (leaveId, data) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const id = parseInt(leaveId);
  const leaveIndex = mockLeaveRequests.findIndex(r => r.id === id);
  
  if (leaveIndex === -1) throw new Error('Leave request not found');
  
  const leave = mockLeaveRequests[leaveIndex];
  
  const updatedLeave = {
    ...leave,
    status: data.status,
    approval_date: data.status === 'Approved' ? new Date().toISOString() : null,
    approved_by: data.status === 'Approved' ? 1 : null, // Assuming admin ID 1
    updated_at: new Date().toISOString()
  };
  
  mockLeaveRequests[leaveIndex] = updatedLeave;
  
  const faculty = mockFaculty.find(f => f.id === updatedLeave.facultyId);
  const department = mockDepartments.find(d => d.id === updatedLeave.departmentId);
  const classInfo = mockClasses.find(c => c.id === updatedLeave.classId);
  const section = mockSections.find(s => s.id === updatedLeave.sectionId);
  const course = mockCourses.find(c => c.id === updatedLeave.courseId);
  
  return {
    ...updatedLeave,
    faculty,
    department,
    class: classInfo,
    section,
    course
  };
};

export const approveLeave = async (leaveId) => {
  return updateLeaveStatus(leaveId, { status: 'Approved' });
};

export const rejectLeave = async (leaveId) => {
  return updateLeaveStatus(leaveId, { status: 'Rejected' });
};

// =========== ANALYTICS ===========

export const getAllAnalytics = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    departmentDistribution: mockDepartmentDistribution,
    facultyPerformance: mockFacultyPerformance,
    revenueData: mockRevenueData,
    attendanceAnalytics: mockAttendanceAnalytics
  };
};

export const getDepartmentDistribution = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDepartmentDistribution;
};

export const getFacultyPerformance = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockFacultyPerformance;
};

export const getRevenueData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockRevenueData;
};

export default {
  // User Management
  getUsers,
  getDepartments,
  getClasses,
  getSections,
  createUser,
  updateUser,
  deleteUser,
  
  // Courses
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  
  // Timetable
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  
  // Attendance
  getAttendance,
  updateAttendance,
  getAttendanceAnalytics,
  
  // Events
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  
  // Invoices
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoicePaid,
  
  // Messages
  getMessages,
  sendMessage,
  deleteMessage,
  
  // Leave Requests
  getLeaveRequests,
  createLeaveRequest,
  approveLeave,
  rejectLeave,
  
  // Analytics
  getAllAnalytics,
  getDepartmentDistribution,
  getFacultyPerformance,
  getRevenueData
};