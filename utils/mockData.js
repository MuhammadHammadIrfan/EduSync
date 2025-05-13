// Mock data for the EduSync system

// mockData.js
// mockData.js
// mockData.js
// utils/mockData.js
export const mockRecipients = [
  {
    label: 'Students',
    options: [
      { value: 's1', label: 'Alice Johnson (alice@example.com)', type: 'student' },
      { value: 's2', label: 'Bob Smith (bob@example.com)', type: 'student' }
    ]
  },
  {
    label: 'Faculty',
    options: [
      { value: 'f1', label: 'Dr. Smith (smith@example.com)', type: 'faculty' },
      { value: 'f2', label: 'Prof. Johnson (johnson@example.com)', type: 'faculty' }
    ]
  }
];

export const mockMessages = [
  {
    id: 'msg1',
    subject: 'Welcome to the new semester',
    body: 'Dear students,\n\nWelcome to our new semester! Please check the syllabus for important dates.\n\nBest regards,\nDr. Smith',
    sender: 'f1',
    senderName: 'Dr. Smith',
    receiver: 'admin',
    date: '2023-09-01T10:00:00Z',
    read: false
  },
  {
    id: 'msg2',
    subject: 'Assignment submission',
    body: 'Hello,\n\nJust a reminder that Assignment 1 is due this Friday.\n\n- Prof. Johnson',
    sender: 'f2',
    senderName: 'Prof. Johnson',
    receiver: 'admin',
    date: '2023-09-05T14:30:00Z',
    read: true
  },
  {
    id: 'msg3',
    subject: 'Meeting request',
    body: 'Hi Admin,\n\nCan we schedule a meeting to discuss the upcoming event?\n\nThanks,\nAlice',
    sender: 's1',
    senderName: 'Alice Johnson',
    receiver: 'admin',
    date: '2023-09-10T09:15:00Z',
    read: false
  }
];
export const mockEvents = [
  {
    id: 1,
    title: 'Orientation Day',
    description: 'Welcome to new students!',
    event_date: '2025-05-15',
  },
  {
    id: 2,
    title: 'Faculty Meeting',
    description: 'Quarterly meeting for all faculty members.',
    event_date: '2025-05-18',
  }
];

export const filterOptions = {
  department: [
    { value: 'CS', label: 'Computer Science' },
    { value: 'SE', label: 'Software Engineering' },
    { value: 'EE', label: 'Electrical Engineeering' },
    { value: 'AI', label: 'Artificial Intelligence' },
    { value: 'DS', label: 'Data Science' },
    { value: 'IS', label: 'Information Systems' },

  ],
  class: [
    { value: '2021', label: '2021' },
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
  ],
  faculty: [
    { value: 'john_doe', label: 'John Doe' },
    { value: 'jane_smith', label: 'Jane Smith' },
    { value: 'alice_johnson', label: 'Alice Johnson' },
  ],
};

export const initialCourses = [
  {
    id: 1,
    name: 'Data Structures and Algorithms',
    department: 'CS',
    class: '2023',
    faculty: 'john_doe',
  },
  {
    id: 1,
    name: 'Software Systems',
    department: 'SE',
    class: '2022',
    faculty: 'jane_smith',
  },
  {
    id: 1,
    name: 'Multivariable Calculus',
    department: 'DS',
    class: '2024',
    faculty: 'alice_johnson',
  },
];


// Basic metrics (unchanged)
export const mockMonthlyEnrollment = [
  { month: 'Jan', students: 120, faculty: 12 },
  { month: 'Feb', students: 135, faculty: 14 },
  { month: 'Mar', students: 150, faculty: 15 },
  { month: 'Apr', students: 165, faculty: 16 },
  { month: 'May', students: 180, faculty: 17 },
  { month: 'Jun', students: 195, faculty: 18 },
];

export const mockEventData = [
  { month: 'Jan', events: 5 },
  { month: 'Feb', events: 7 },
  { month: 'Mar', events: 6 },
  { month: 'Apr', events: 8 },
  { month: 'May', events: 9 },
  { month: 'Jun', events: 10 },
];

export const mockMetrics = {
  totalEnrollments: 2500,
  totalFaculty: 85,
  activeCourses: 120,
  totalEvents: 45
};

// Academic structure - UPDATED
export const mockDepartments = [
  { id: 1, name: 'Computer Science' },
  { id: 2, name: 'Software Engineering' },
  { id: 3, name: 'Artificial Intelligence' },
  { id: 4, name: 'Data Science' },
  { id: 5, name: 'Electrical Engineering' },
  { id: 6, name: 'Information Systems' }
];

// Classes represent graduation years (2021-2024)
export const mockClasses = [
  { id: 1, name: '2021', departmentId: 1 },
  { id: 2, name: '2022', departmentId: 1 },
  { id: 3, name: '2023', departmentId: 1 },
  { id: 4, name: '2024', departmentId: 1 },
  { id: 5, name: '2021', departmentId: 2 },
  { id: 6, name: '2022', departmentId: 2 },
  { id: 7, name: '2023', departmentId: 2 },
  { id: 8, name: '2024', departmentId: 2 },
  { id: 9, name: '2021', departmentId: 3 },
  { id: 10, name: '2022', departmentId: 3 },
  { id: 11, name: '2023', departmentId: 3 },
  { id: 12, name: '2024', departmentId: 3 },
  { id: 13, name: '2021', departmentId: 4 },
  { id: 14, name: '2022', departmentId: 4 },
  { id: 15, name: '2023', departmentId: 4 },
  { id: 16, name: '2024', departmentId: 4 },
  { id: 17, name: '2021', departmentId: 5 },
  { id: 18, name: '2022', departmentId: 5 },
  { id: 19, name: '2023', departmentId: 5 },
  { id: 20, name: '2024', departmentId: 5 },
  { id: 21, name: '2021', departmentId: 6 },
  { id: 22, name: '2022', departmentId: 6 },
  { id: 23, name: '2023', departmentId: 6 },
  { id: 24, name: '2024', departmentId: 6 }
];

// Sections A-D for each class
export const mockSections = [];
let sectionId = 1;

// Generate sections A-D for each class
mockClasses.forEach(classItem => {
  ['A', 'B', 'C', 'D'].forEach(sectionLetter => {
    mockSections.push({
      id: sectionId++,
      name: `Section ${sectionLetter}`,
      classId: classItem.id
    });
  });
});

// Updated students with technical backgrounds
export const mockStudents = [
  { 
    id: 1, 
    name: 'Alex Chen', 
    email: 'alex.chen@edusync.edu', 
    phone: '9876543210', 
    gender: 'Male',
    departmentId: 1, // Computer Science
    classId: 4, // 2024
    sectionId: 13, // Section A for 2024 CS
    roll_number: 'CS2024A001',
    address: '123 Tech Park, Silicon Valley',
    date_of_birth: '2002-08-15',
    parent_name: 'Wei Chen',
    parent_phone: '9876543200',
    admission_date: '2023-09-01',
    password_hash: 'hashed_password',
    created_at: '2023-09-01T10:00:00Z',
    updated_at: '2023-09-01T10:00:00Z'
  },
  { 
    id: 2, 
    name: 'Priya Sharma', 
    email: 'priya.sharma@edusync.edu', 
    phone: '9876543211', 
    gender: 'Female',
    departmentId: 2, // Software Engineering
    classId: 7, // 2023
    sectionId: 28, // Section D for 2023 SE
    roll_number: 'SE2023D002',
    address: '456 Dev Lane, Tech City',
    date_of_birth: '2001-05-20',
    parent_name: 'Raj Sharma',
    parent_phone: '9876543201',
    admission_date: '2022-09-01',
    password_hash: 'hashed_password',
    created_at: '2022-09-01T10:15:00Z',
    updated_at: '2022-09-01T10:15:00Z'
  },
  { 
    id: 3, 
    name: 'Jamal Williams', 
    email: 'jamal.williams@edusync.edu', 
    phone: '9876543212', 
    gender: 'Male',
    departmentId: 3, // AI
    classId: 10, // 2022
    sectionId: 40, // Section D for 2022 AI
    roll_number: 'AI2022D003',
    address: '789 Algorithm Ave, Data Town',
    date_of_birth: '2000-11-12',
    parent_name: 'Marcus Williams',
    parent_phone: '9876543202',
    admission_date: '2021-09-01',
    password_hash: 'hashed_password',
    created_at: '2021-09-01T09:30:00Z',
    updated_at: '2021-09-01T09:30:00Z'
  },
  { 
    id: 4, 
    name: 'Emma Zhang', 
    email: 'emma.zhang@edusync.edu', 
    phone: '9876543213', 
    gender: 'Female',
    departmentId: 4, // Data Science
    classId: 15, // 2023
    sectionId: 60, // Section C for 2023 DS
    roll_number: 'DS2023C004',
    address: '101 Data Street, Analytics City',
    date_of_birth: '2001-03-08',
    parent_name: 'Li Zhang',
    parent_phone: '9876543203',
    admission_date: '2022-09-01',
    password_hash: 'hashed_password',
    created_at: '2022-09-01T11:45:00Z',
    updated_at: '2022-09-01T11:45:00Z'
  },
  { 
    id: 5, 
    name: 'David Kim', 
    email: 'david.kim@edusync.edu', 
    phone: '9876543214', 
    gender: 'Male',
    departmentId: 5, // EE
    classId: 18, // 2022
    sectionId: 72, // Section B for 2022 EE
    roll_number: 'EE2022B005',
    address: '202 Circuit Road, Hardware Town',
    date_of_birth: '2000-07-25',
    parent_name: 'Joon Kim',
    parent_phone: '9876543204',
    admission_date: '2021-09-01',
    password_hash: 'hashed_password',
    created_at: '2021-09-01T10:20:00Z',
    updated_at: '2021-09-01T10:20:00Z'
  },
  { 
    id: 6, 
    name: 'Sophia Martinez', 
    email: 'sophia.martinez@edusync.edu', 
    phone: '9876543215', 
    gender: 'Female',
    departmentId: 6, // Information Systems
    classId: 23, // 2023
    sectionId: 92, // Section A for 2023 IS
    roll_number: 'IS2023A006',
    address: '303 Database Lane, Info City',
    date_of_birth: '2001-01-17',
    parent_name: 'Carlos Martinez',
    parent_phone: '9876543205',
    admission_date: '2022-09-01',
    password_hash: 'hashed_password',
    created_at: '2022-09-01T14:10:00Z',
    updated_at: '2022-09-01T14:10:00Z'
  },
  { 
    id: 7, 
    name: 'Ryan Park', 
    email: 'ryan.park@edusync.edu', 
    phone: '9876543216', 
    gender: 'Male',
    departmentId: 1, // Computer Science
    classId: 2, // 2022
    sectionId: 8, // Section D for 2022 CS
    roll_number: 'CS2022D007',
    address: '404 Code Blvd, Dev Valley',
    date_of_birth: '2000-04-30',
    parent_name: 'Min Park',
    parent_phone: '9876543206',
    admission_date: '2021-09-01',
    password_hash: 'hashed_password',
    created_at: '2021-09-01T09:15:00Z',
    updated_at: '2021-09-01T09:15:00Z'
  },
  { 
    id: 8, 
    name: 'Aisha Khan', 
    email: 'aisha.khan@edusync.edu', 
    phone: '9876543217', 
    gender: 'Female',
    departmentId: 3, // AI
    classId: 12, // 2024
    sectionId: 48, // Section B for 2024 AI
    roll_number: 'AI2024B008',
    address: '505 Neural Net Way, AI City',
    date_of_birth: '2002-06-11',
    parent_name: 'Ali Khan',
    parent_phone: '9876543207',
    admission_date: '2023-09-01',
    password_hash: 'hashed_password',
    created_at: '2023-09-01T11:30:00Z',
    updated_at: '2023-09-01T11:30:00Z'
  }
];

// Updated faculty with technical specializations
export const mockFaculty = [
  { 
    id: 1, 
    name: 'Dr. Alan Turing', 
    email: 'alan.turing@edusync.edu', 
    phone: '9876543220', 
    gender: 'Male',
    departmentId: 1, // Computer Science
    position: 'Professor',
    qualification: 'PhD in Computer Science',
    date_of_joining: '2015-06-15',
    address: '707 Algorithm Ave, Faculty Housing',
    password_hash: 'hashed_password',
    created_at: '2015-06-15T09:00:00Z',
    updated_at: '2015-06-15T09:00:00Z'
  },
  { 
    id: 2, 
    name: 'Prof. Grace Hopper', 
    email: 'grace.hopper@edusync.edu', 
    phone: '9876543221', 
    gender: 'Female',
    departmentId: 2, // Software Engineering
    position: 'Distinguished Professor',
    qualification: 'PhD in Computer Engineering',
    date_of_joining: '2010-08-10',
    address: '808 Compiler St, Faculty Quarters',
    password_hash: 'hashed_password',
    created_at: '2010-08-10T10:00:00Z',
    updated_at: '2010-08-10T10:00:00Z'
  },
  { 
    id: 3, 
    name: 'Dr. Andrew Ng', 
    email: 'andrew.ng@edusync.edu', 
    phone: '9876543222', 
    gender: 'Male',
    departmentId: 3, // AI
    position: 'Professor',
    qualification: 'PhD in Artificial Intelligence',
    date_of_joining: '2018-03-22',
    address: '909 Machine Learning Blvd, Staff Residence',
    password_hash: 'hashed_password',
    created_at: '2018-03-22T11:30:00Z',
    updated_at: '2018-03-22T11:30:00Z'
  },
  { 
    id: 4, 
    name: 'Dr. Hadley Wickham', 
    email: 'hadley.wickham@edusync.edu', 
    phone: '9876543223', 
    gender: 'Male',
    departmentId: 4, // Data Science
    position: 'Associate Professor',
    qualification: 'PhD in Statistics',
    date_of_joining: '2019-07-18',
    address: '101 R Studio Lane, Campus Housing',
    password_hash: 'hashed_password',
    created_at: '2019-07-18T14:00:00Z',
    updated_at: '2019-07-18T14:00:00Z'
  },
  { 
    id: 5, 
    name: 'Dr. Nikola Tesla', 
    email: 'nikola.tesla@edusync.edu', 
    phone: '9876543224', 
    gender: 'Male',
    departmentId: 5, // EE
    position: 'Professor',
    qualification: 'PhD in Electrical Engineering',
    date_of_joining: '2014-09-05',
    address: '202 AC/DC Park, Faculty Housing',
    password_hash: 'hashed_password',
    created_at: '2014-09-05T09:45:00Z',
    updated_at: '2014-09-05T09:45:00Z'
  },
  { 
    id: 6, 
    name: 'Dr. Tim Berners-Lee', 
    email: 'tim.bernerslee@edusync.edu', 
    phone: '9876543225', 
    gender: 'Male',
    departmentId: 6, // Information Systems
    position: 'Professor',
    qualification: 'PhD in Computer Science',
    date_of_joining: '2012-11-30',
    address: '303 Web Way, Staff Quarters',
    password_hash: 'hashed_password',
    created_at: '2012-11-30T08:20:00Z',
    updated_at: '2012-11-30T08:20:00Z'
  }
];

// Admin (unchanged)
export const mockAdmin = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@edusync.edu',
    phone: '9876543299',
    password_hash: 'hashed_admin_password',
    created_at: '2010-01-01T00:00:00Z',
    updated_at: '2010-01-01T00:00:00Z'
  }
];

// Updated technical courses
export const mockCourses = [
  {
    id: 1,
    name: 'Data Structures and Algorithms',
    course_code: 'CS201',
    description: 'Fundamental data structures and algorithm analysis',
    credits: 4,
    departmentId: 1,
    created_at: '2023-01-15T10:00:00Z',
    updated_at: '2023-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Software Engineering Principles',
    course_code: 'SE301',
    description: 'Software development lifecycle and best practices',
    credits: 3,
    departmentId: 2,
    created_at: '2023-01-15T10:15:00Z',
    updated_at: '2023-01-15T10:15:00Z'
  },
  {
    id: 3,
    name: 'Machine Learning Fundamentals',
    course_code: 'AI401',
    description: 'Introduction to machine learning algorithms',
    credits: 4,
    departmentId: 3,
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-01-15T10:30:00Z'
  },
  {
    id: 4,
    name: 'Data Visualization',
    course_code: 'DS301',
    description: 'Techniques for effective data visualization',
    credits: 3,
    departmentId: 4,
    created_at: '2023-01-16T09:00:00Z',
    updated_at: '2023-01-16T09:00:00Z'
  },
  {
    id: 5,
    name: 'Circuit Theory',
    course_code: 'EE201',
    description: 'Fundamentals of electrical circuits',
    credits: 4,
    departmentId: 5,
    created_at: '2023-01-16T09:15:00Z',
    updated_at: '2023-01-16T09:15:00Z'
  },
  {
    id: 6,
    name: 'Database Systems',
    course_code: 'IS302',
    description: 'Design and implementation of database systems',
    credits: 3,
    departmentId: 6,
    created_at: '2023-01-17T10:00:00Z',
    updated_at: '2023-01-17T10:00:00Z'
  },
  {
    id: 7,
    name: 'Computer Networks',
    course_code: 'CS302',
    description: 'Principles of computer networking',
    credits: 3,
    departmentId: 1,
    created_at: '2023-01-17T10:15:00Z',
    updated_at: '2023-01-17T10:15:00Z'
  },
  {
    id: 8,
    name: 'Deep Learning',
    course_code: 'AI402',
    description: 'Advanced neural networks and deep learning',
    credits: 4,
    departmentId: 3,
    created_at: '2023-01-18T09:00:00Z',
    updated_at: '2023-01-18T09:00:00Z'
  },
  {
    id: 9,
    name: 'Cloud Computing',
    course_code: 'SE402',
    description: 'Distributed systems and cloud architectures',
    credits: 3,
    departmentId: 2,
    created_at: '2023-01-19T08:30:00Z',
    updated_at: '2023-01-19T08:30:00Z'
  }
];

// Updated schedules with technical courses
export const mockSchedules = [
  {
    id: 1,
    day_of_week: 'Monday',
    start_time: '09:00:00',
    end_time: '10:30:00',
    room: 'CS Lab 101',
    courseId: 1, // Data Structures
    facultyId: 1, // Dr. Turing
    classId: 4, // CS 2024
    sectionId: 13 // Section A
  },
  {
    id: 2,
    day_of_week: 'Monday',
    start_time: '10:45:00',
    end_time: '12:15:00',
    room: 'SE Lab 102',
    courseId: 2, // Software Engineering
    facultyId: 2, // Prof. Hopper
    classId: 7, // SE 2023
    sectionId: 28 // Section D
  },
  {
    id: 3,
    day_of_week: 'Tuesday',
    start_time: '09:00:00',
    end_time: '10:30:00',
    room: 'AI Lab 103',
    courseId: 3, // Machine Learning
    facultyId: 3, // Dr. Ng
    classId: 10, // AI 2022
    sectionId: 40 // Section D
  },
  {
    id: 4,
    day_of_week: 'Tuesday',
    start_time: '10:45:00',
    end_time: '12:15:00',
    room: 'DS Lab 201',
    courseId: 4, // Data Visualization
    facultyId: 4, // Dr. Wickham
    classId: 15, // DS 2023
    sectionId: 60 // Section C
  },
  {
    id: 5,
    day_of_week: 'Wednesday',
    start_time: '09:00:00',
    end_time: '10:30:00',
    room: 'EE Lab 202',
    courseId: 5, // Circuit Theory
    facultyId: 5, // Dr. Tesla
    classId: 18, // EE 2022
    sectionId: 72 // Section B
  },
  {
    id: 6,
    day_of_week: 'Wednesday',
    start_time: '10:45:00',
    end_time: '12:15:00',
    room: 'IS Lab 203',
    courseId: 6, // Database Systems
    facultyId: 6, // Dr. Berners-Lee
    classId: 23, // IS 2023
    sectionId: 92 // Section A
  },
  {
    id: 7,
    day_of_week: 'Thursday',
    start_time: '09:00:00',
    end_time: '10:30:00',
    room: 'CS Lab 301',
    courseId: 7, // Computer Networks
    facultyId: 1, // Dr. Turing
    classId: 2, // CS 2022
    sectionId: 8 // Section D
  },
  {
    id: 8,
    day_of_week: 'Thursday',
    start_time: '10:45:00',
    end_time: '12:15:00',
    room: 'AI Lab 302',
    courseId: 8, // Deep Learning
    facultyId: 3, // Dr. Ng
    classId: 12, // AI 2024
    sectionId: 48 // Section B
  },
  {
    id: 9,
    day_of_week: 'Friday',
    start_time: '09:00:00',
    end_time: '10:30:00',
    room: 'SE Lab 301',
    courseId: 9, // Cloud Computing
    facultyId: 2, // Prof. Hopper
    classId: 8, // SE 2024
    sectionId: 32 // Section D
  }
];

// ... [rest of the file remains the same, just with updated references to match the new structure]



// Enrollments
export const mockEnrollments = [
  { id: 1, studentId: 1, courseId: 1, enrollment_date: '2023-07-15T10:00:00Z' },
  { id: 2, studentId: 1, courseId: 2, enrollment_date: '2023-07-15T10:05:00Z' },
  { id: 3, studentId: 1, courseId: 3, enrollment_date: '2023-07-15T10:10:00Z' },
  { id: 4, studentId: 2, courseId: 1, enrollment_date: '2023-07-15T11:00:00Z' },
  { id: 5, studentId: 2, courseId: 2, enrollment_date: '2023-07-15T11:05:00Z' },
  { id: 6, studentId: 2, courseId: 3, enrollment_date: '2023-07-15T11:10:00Z' },
  { id: 7, studentId: 3, courseId: 1, enrollment_date: '2023-07-16T09:00:00Z' },
  { id: 8, studentId: 3, courseId: 2, enrollment_date: '2023-07-16T09:05:00Z' },
  { id: 9, studentId: 4, courseId: 4, enrollment_date: '2023-07-16T10:00:00Z' },
  { id: 10, studentId: 4, courseId: 5, enrollment_date: '2023-07-16T10:05:00Z' },
  { id: 11, studentId: 5, courseId: 6, enrollment_date: '2023-07-17T09:30:00Z' },
  { id: 12, studentId: 5, courseId: 7, enrollment_date: '2023-07-17T09:35:00Z' },
  { id: 13, studentId: 6, courseId: 8, enrollment_date: '2023-07-17T10:30:00Z' },
  { id: 14, studentId: 7, courseId: 9, enrollment_date: '2023-07-18T09:00:00Z' },
  { id: 15, studentId: 8, courseId: 9, enrollment_date: '2023-07-18T09:30:00Z' }
];

// Attendance
export const mockAttendance = [
  { id: 1, studentId: 1, courseId: 1, date: '2023-08-07', status: 'Present' },
  { id: 2, studentId: 2, courseId: 1, date: '2023-08-07', status: 'Present' },
  { id: 3, studentId: 3, courseId: 1, date: '2023-08-07', status: 'Absent' },
  { id: 4, studentId: 1, courseId: 2, date: '2023-08-07', status: 'Present' },
  { id: 5, studentId: 2, courseId: 2, date: '2023-08-07', status: 'Present' },
  { id: 6, studentId: 3, courseId: 2, date: '2023-08-07', status: 'Late' },
  { id: 7, studentId: 4, courseId: 4, date: '2023-08-09', status: 'Present' },
  { id: 8, studentId: 4, courseId: 5, date: '2023-08-09', status: 'Present' },
  { id: 9, studentId: 5, courseId: 6, date: '2023-08-10', status: 'Present' },
  { id: 10, studentId: 5, courseId: 7, date: '2023-08-10', status: 'Absent' },
  { id: 11, studentId: 6, courseId: 8, date: '2023-08-11', status: 'Present' },
  { id: 12, studentId: 7, courseId: 9, date: '2023-08-11', status: 'Present' },
  { id: 13, studentId: 8, courseId: 9, date: '2023-08-11', status: 'Present' },
  { id: 14, studentId: 1, courseId: 1, date: '2023-08-14', status: 'Present' },
  { id: 15, studentId: 2, courseId: 1, date: '2023-08-14', status: 'Present' },
  { id: 16, studentId: 3, courseId: 1, date: '2023-08-14', status: 'Present' },
  { id: 17, studentId: 1, courseId: 2, date: '2023-08-14', status: 'Present' },
  { id: 18, studentId: 2, courseId: 2, date: '2023-08-14', status: 'Absent' },
  { id: 19, studentId: 3, courseId: 2, date: '2023-08-14', status: 'Present' }
];

// Invoices
export const mockInvoices = [
  {
    id: 1,
    invoice_number: 'INV-2023-001',
    studentId: 1,
    amount: 25000,
    description: 'Tuition fee for First Semester 2023',
    due_date: '2025-08-15',
    paid: true,
    paid_date: '2025-03-10',
    payment_method: 'Bank Transfer',
    generated_at: '2025-02-20T10:00:00Z',
    updated_at: '2025-03-10T14:30:00Z',
    category: 'Exam'
  },
  {
    id: 2,
    invoice_number: 'INV-2023-002',
    studentId: 2,
    amount: 25000,
    description: 'Tuition fee for First Semester 2023',
    due_date: '2025-08-15',
    paid: true,
    paid_date: '2025-03-12',
    payment_method: 'Credit Card',
    generated_at: '2025-02-20T10:15:00Z',
    updated_at: '2025-03-12T11:20:00Z',
    category: 'Hostel'
  },
  {
    id: 3,
    invoice_number: 'INV-2023-003',
    studentId: 3,
    amount: 25000,
    description: 'Tuition fee for First Semester 2023',
    due_date: '2025-08-15',
    paid: false,
    paid_date: null,
    payment_method: null,
    generated_at: '2025-02-20T10:30:00Z',
    updated_at: '2025-03-20T10:30:00Z',
    category: 'Semester'
  },
  {
    id: 4,
    invoice_number: 'INV-2023-004',
    studentId: 4,
    amount: 27000,
    description: 'Tuition fee for First Semester 2023',
    due_date: '2025-08-15',
    paid: true,
    paid_date: '2025-04-05',
    payment_method: 'Bank Transfer',
    generated_at: '2025-02-21T09:00:00Z',
    updated_at: '2025-04-05T15:45:00Z',
    category: 'Exam'
  },
  // {
  //   id: 5,
  //   invoice_number: 'INV-2023-005',
  //   studentId: 5,
  //   amount: 22000,
  //   description: 'Tuition fee for First Semester 2023',
  //   due_date: '2023-08-15',
  //   paid: false,
  //   paid_date: null,
  //   payment_method: null,
  //   generated_at: '2023-07-21T09:15:00Z',
  //   updated_at: '2023-07-21T09:15:00Z'
  // },
  // {
  //   id: 6,
  //   invoice_number: 'INV-2023-006',
  //   studentId: 6,
  //   amount: 32000,
  //   description: 'Tuition fee for First Semester 2023',
  //   due_date: '2023-08-20',
  //   paid: true,
  //   paid_date: '2023-08-15',
  //   payment_method: 'Credit Card',
  //   generated_at: '2023-07-22T10:00:00Z',
  //   updated_at: '2023-08-15T13:10:00Z'
  // },
  // {
  //   id: 7,
  //   invoice_number: 'INV-2023-007',
  //   studentId: 7,
  //   amount: 40000,
  //   description: 'Tuition fee for First Semester 2023',
  //   due_date: '2023-08-20',
  //   paid: false,
  //   paid_date: null,
  //   payment_method: null,
  //   generated_at: '2023-07-22T10:15:00Z',
  //   updated_at: '2023-07-22T10:15:00Z'
  // },
  // {
  //   id: 8,
  //   invoice_number: 'INV-2023-008',
  //   studentId: 8,
  //   amount: 40000,
  //   description: 'Tuition fee for First Semester 2023',
  //   due_date: '2023-08-20',
  //   paid: true,
  //   paid_date: '2023-08-01',
  //   payment_method: 'Bank Transfer',
  //   generated_at: '2023-07-22T10:30:00Z',
  //   updated_at: '2023-08-01T09:25:00Z'
  // }
];

// Events
export const eventData = [
  {
    id: 1,
    title: 'Orientation Day',
    description: 'Orientation for new students',
    event_date: '2023-07-25',
    start_time: '09:00:00',
    end_time: '13:00:00',
    location: 'Main Auditorium',
    organizer: 'Student Affairs Office',
    status: 'Completed',
    audience_type: 'student',  // Added audience_type
    created_at: '2023-07-01T10:00:00Z',
    updated_at: '2023-07-26T09:00:00Z'
  },
  {
    id: 2,
    title: 'Science Exhibition',
    description: 'Annual science exhibition showcasing student projects',
    event_date: '2023-08-15',
    start_time: '10:00:00',
    end_time: '16:00:00',
    location: 'Science Block',
    organizer: 'Science Department',
    status: 'Upcoming',
    audience_type: 'faculty',  // Added audience_type
    created_at: '2023-07-10T11:00:00Z',
    updated_at: '2023-07-10T11:00:00Z'
  },
  {
    id: 3,
    title: 'Career Fair',
    description: 'Annual career fair with company representatives',
    event_date: '2023-09-05',
    start_time: '10:00:00',
    end_time: '17:00:00',
    location: 'College Gymnasium',
    organizer: 'Career Services',
    status: 'Upcoming',
    audience_type: 'student',  // Added audience_type
    created_at: '2023-07-15T09:30:00Z',
    updated_at: '2023-07-15T09:30:00Z'
  },
  {
    id: 4,
    title: 'Annual Sports Day',
    description: 'Institution-wide sports competition',
    event_date: '2023-09-20',
    start_time: '08:00:00',
    end_time: '18:00:00',
    location: 'Sports Complex',
    organizer: 'Physical Education Department',
    status: 'Upcoming',
    audience_type: 'all',  // Added audience_type
    created_at: '2023-07-20T14:00:00Z',
    updated_at: '2023-07-20T14:00:00Z'
  },
  {
    id: 5,
    title: 'Parents-Teacher Meeting',
    description: 'Semester progress review with parents',
    event_date: '2023-10-10',
    start_time: '14:00:00',
    end_time: '18:00:00',
    location: 'Multiple Classrooms',
    organizer: 'Academic Affairs',
    status: 'Upcoming',
    audience_type: 'all',  // Added audience_type
    created_at: '2023-07-25T10:15:00Z',
    updated_at: '2023-07-25T10:15:00Z'
  }
];


// Event Audiences
export const mockEventAudiences = [
  { id: 1, eventId: 1, audience_type: 'Students', departmentId: null, classId: null, sectionId: null },
  { id: 2, eventId: 2, audience_type: 'Students', departmentId: 1, classId: null, sectionId: null },
  { id: 3, eventId: 3, audience_type: 'Students', departmentId: null, classId: null, sectionId: null },
  { id: 4, eventId: 3, audience_type: 'Faculty', departmentId: null, classId: null, sectionId: null },
  { id: 5, eventId: 4, audience_type: 'Students', departmentId: null, classId: null, sectionId: null },
  { id: 6, eventId: 4, audience_type: 'Faculty', departmentId: null, classId: null, sectionId: null },
  { id: 7, eventId: 5, audience_type: 'Students', departmentId: null, classId: null, sectionId: null },
  { id: 8, eventId: 5, audience_type: 'Parents', departmentId: null, classId: null, sectionId: null }
];

// Messages
// Leave Requests
export const mockLeaveRequests = [
  {
    id: 1,
    facultyId: 1,
    departmentId: 1,
    leave_type: 'Medical',
    leave_date: '2023-08-25',
    courseId: 1,
    classId: 1,
    sectionId: 1,
    reason: 'Medical appointment',
    status: 'Approved',
    approval_date: '2023-08-15T10:00:00Z',
    approved_by: 1,
    created_at: '2023-08-10T09:30:00Z',
    updated_at: '2023-08-15T10:00:00Z'
  },
  {
    id: 2,
    facultyId: 2,
    departmentId: 1,
    leave_type: 'Personal',
    leave_date: '2023-08-30',
    courseId: 2,
    classId: 1,
    sectionId: 1,
    reason: 'Family function',
    status: 'Pending',
    approval_date: null,
    approved_by: null,
    created_at: '2023-08-15T14:20:00Z',
    updated_at: '2023-08-15T14:20:00Z'
  },
  {
    id: 3,
    facultyId: 3,
    departmentId: 2,
    leave_type: 'Medical',
    leave_date: '2023-09-05',
    courseId: 4,
    classId: 4,
    sectionId: 7,
    reason: 'Not feeling well',
    status: 'Approved',
    approval_date: '2023-08-30T11:15:00Z',
    approved_by: 1,
    created_at: '2023-08-25T10:10:00Z',
    updated_at: '2023-08-30T11:15:00Z'
  },
  {
    id: 4,
    facultyId: 4,
    departmentId: 3,
    leave_type: 'Professional',
    leave_date: '2023-09-10',
    courseId: 6,
    classId: 7,
    sectionId: 13,
    reason: 'Attending academic conference',
    status: 'Approved',
    approval_date: '2023-09-01T09:45:00Z',
    approved_by: 1,
    created_at: '2023-08-28T11:30:00Z',
    updated_at: '2023-09-01T09:45:00Z'
  },
  {
    id: 5,
    facultyId: 5,
    departmentId: 4,
    leave_type: 'Personal',
    leave_date: '2023-09-15',
    courseId: 8,
    classId: 10,
    sectionId: 19,
    reason: 'Family emergency',
    status: 'Pending',
    approval_date: null,
    approved_by: null,
    created_at: '2023-09-10T08:20:00Z',
    updated_at: '2023-09-10T08:20:00Z'
  }
];

// Faculty Courses (Many-to-Many relationship between Faculty and Courses)
export const mockFacultyCourses = [
  { facultyId: 1, courseId: 1 },
  { facultyId: 1, courseId: 3 },
  { facultyId: 2, courseId: 2 },
  { facultyId: 3, courseId: 4 },
  { facultyId: 3, courseId: 5 },
  { facultyId: 4, courseId: 6 },
  { facultyId: 4, courseId: 7 },
  { facultyId: 5, courseId: 8 },
  { facultyId: 6, courseId: 9 }
];

// Course-Class relation (Many-to-Many relationship between Courses and Classes)
export const mockCourseClasses = [
  { courseId: 1, classId: 1 },
  { courseId: 2, classId: 1 },
  { courseId: 3, classId: 1 },
  { courseId: 1, classId: 2 },
  { courseId: 2, classId: 2 },
  { courseId: 3, classId: 2 },
  { courseId: 4, classId: 4 },
  { courseId: 5, classId: 4 },
  { courseId: 4, classId: 5 },
  { courseId: 5, classId: 5 },
  { courseId: 6, classId: 7 },
  { courseId: 7, classId: 7 },
  { courseId: 6, classId: 8 },
  { courseId: 7, classId: 8 },
  { courseId: 8, classId: 10 },
  { courseId: 8, classId: 11 },
  { courseId: 9, classId: 12 },
  { courseId: 9, classId: 13 }
];

// Course-Section relation (Many-to-Many relationship between Courses and Sections)
export const mockCourseSections = [
  { courseId: 1, sectionId: 1 },
  { courseId: 2, sectionId: 1 },
  { courseId: 3, sectionId: 1 },
  { courseId: 1, sectionId: 2 },
  { courseId: 2, sectionId: 2 },
  { courseId: 3, sectionId: 2 },
  { courseId: 1, sectionId: 3 },
  { courseId: 2, sectionId: 3 },
  { courseId: 3, sectionId: 3 },
  { courseId: 1, sectionId: 4 },
  { courseId: 2, sectionId: 4 },
  { courseId: 3, sectionId: 4 }
];

// Dashboard Stats
export const mockDashboardStats = {
  total_students: 8,
  total_faculty: 6,
  total_courses: 9,
  total_departments: 5,
  latest_events: [
    {
      id: 2,
      title: 'Science Exhibition',
      date: '2023-08-15'
    },
    {
      id: 3,
      title: 'Career Fair',
      date: '2023-09-05'
    },
    {
      id: 4,
      title: 'Annual Sports Day',
      date: '2023-09-20'
    }
  ],
  recent_activities: [
    {
      id: 1,
      action: 'Leave Request Approved',
      user: 'Dr. Sarah Williams',
      timestamp: '2023-08-15T10:00:00Z'
    },
    {
      id: 2,
      action: 'New Student Registered',
      user: 'Sophia Lee',
      timestamp: '2023-07-13T11:30:00Z'
    },
    {
      id: 3,
      action: 'Invoice Payment Received',
      user: 'John Smith',
      timestamp: '2023-08-10T14:30:00Z'
    }
  ]
};

// Attendance Analytics
export const mockAttendanceAnalytics = {
  overall_attendance_rate: 85,
  attendance_by_department: [
    { department: 'Science', rate: 90 },
    { department: 'Commerce', rate: 85 },
    { department: 'Arts', rate: 80 },
    { department: 'Engineering', rate: 88 },
    { department: 'Medicine', rate: 92 }
  ],
  attendance_by_class: [
    { class: 'Class 9 (Science)', rate: 88 },
    { class: 'Class 10 (Science)', rate: 92 },
    { class: 'Class 11 (Science)', rate: 90 },
    { class: 'Class 9 (Commerce)', rate: 84 },
    { class: 'Class 10 (Commerce)', rate: 85 },
    { class: 'Class 11 (Commerce)', rate: 86 }
  ],
  monthly_attendance: [
    { month: 'Aug', rate: 85 },
    { month: 'Sep', rate: 82 },
    { month: 'Oct', rate: 88 },
    { month: 'Nov', rate: 90 },
    { month: 'Dec', rate: 76 }
  ],
  students_with_low_attendance: [
    { id: 3, name: 'Sara Johnson', attendance_rate: 65 },
    { id: 7, name: 'James Wilson', attendance_rate: 70 }
  ]
};

// Department Distribution for Analytics
export const mockDepartmentDistribution = {
  labels: ['Computer Science', 'Software Engineering', 'Electrical Engineering', 'Artificial Intelligence', 'Information Security'],
  data: [3, 2, 1, 1, 1],
  backgroundColor: [
    'rgba(75, 192, 192, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(153, 102, 255, 0.5)'
  ],
  borderColor: [
    'rgba(75, 192, 192, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(153, 102, 255, 1)'
  ]
};

// Faculty Performance
export const mockFacultyPerformance = {
  faculty_ratings: [
    { name: 'Dr. Sarah Williams', rating: 4.8 },
    { name: 'Prof. Michael Brown', rating: 4.5 },
    { name: 'Prof. Emily Davis', rating: 4.7 },
    { name: 'Dr. Robert Chen', rating: 4.6 },
    { name: 'Dr. Jessica Martinez', rating: 4.9 },
    { name: 'Dr. John Patel', rating: 4.8 }
  ],
  average_rating: 4.7,
  monthly_ratings: [
    { month: 'Aug', rating: 4.5 },
    { month: 'Sep', rating: 4.6 },
    { month: 'Oct', rating: 4.7 },
    { month: 'Nov', rating: 4.8 },
    { month: 'Dec', rating: 4.7 }
  ]
};

// Revenue Data
export const mockRevenueData = {
  total_revenue: 214000,
  total_pending: 87000,
  revenue_by_department: [
    { department: 'Science', amount: 75000 },
    { department: 'Commerce', amount: 27000 },
    { department: 'Arts', amount: 22000 },
    { department: 'Engineering', amount: 32000 },
    { department: 'Medicine', amount: 80000 }
  ],
  monthly_revenue: [
    { month: 'Aug', amount: 214000 },
    { month: 'Sep', expected: 100000 },
    { month: 'Oct', expected: 120000 },
    { month: 'Nov', expected: 90000 },
    { month: 'Dec', expected: 150000 }
  ],
  payment_methods: [
    { method: 'Bank Transfer', count: 3 },
    { method: 'Credit Card', count: 2 },
    { method: 'Cash', count: 0 }
  ],
  recent_payments: [
    { 
      id: 6, 
      invoice_number: 'INV-2023-006', 
      student_name: 'Maria Garcia', 
      amount: 32000, 
      date: '2023-08-15' 
    },
    { 
      id: 2, 
      invoice_number: 'INV-2023-002', 
      student_name: 'Emma Wilson', 
      amount: 25000, 
      date: '2023-08-12' 
    },
    { 
      id: 1, 
      invoice_number: 'INV-2023-001', 
      student_name: 'John Smith', 
      amount: 25000, 
      date: '2023-08-10' 
    }
  ]
};