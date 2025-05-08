// Mock data based on the Prisma schema

// Departments
export const mockDepartments = [
  { id: 1, name: 'Computer Science', code: 'CS' },
  { id: 2, name: 'Data Science', code: 'DS' },
  { id: 3, name: 'Software Engineering', code: 'SE' },
  { id: 4, name: 'Artificial Intelligence', code: 'AI' },
  { id: 5, name: 'Electrical Engineering', code: 'EE' },
];

// Classes (batches)
export const mockClasses = [
  { id: 1, name: 'CS2020', departmentId: 1 },
  { id: 2, name: 'CS2021', departmentId: 1 },
  { id: 3, name: 'CS2022', departmentId: 1 },
  { id: 4, name: 'CS2023', departmentId: 1 },
  { id: 5, name: 'DS2022', departmentId: 2 },
  { id: 6, name: 'SE2021', departmentId: 3 },
  { id: 7, name: 'AI2023', departmentId: 4 },
  { id: 8, name: 'EE2022', departmentId: 5 },
];

// Sections
export const mockSections = [
  { id: 1, name: 'A', classId: 3, room_no: 'CS-101', advisorId: 1 },
  { id: 2, name: 'B', classId: 3, room_no: 'CS-102', advisorId: 2 },
  { id: 3, name: 'A', classId: 4, room_no: 'CS-201', advisorId: 3 },
  { id: 4, name: 'B', classId: 4, room_no: 'CS-202', advisorId: 4 },
];

// Faculty
export const mockFaculty = [
  {
    id: 1,
    name: 'Dr. Ahmed Khan',
    email: 'ahmed.khan@edusync.com',
    departmentId: 1,
  },
  {
    id: 2,
    name: 'Prof. Sarah Ali',
    email: 'sarah.ali@edusync.com',
    departmentId: 1,
  },
  {
    id: 3,
    name: 'Dr. Imran Malik',
    email: 'imran.malik@edusync.com',
    departmentId: 1,
  },
  {
    id: 4,
    name: 'Prof. Fatima Hassan',
    email: 'fatima.hassan@edusync.com',
    departmentId: 2,
  },
  {
    id: 5,
    name: 'Dr. Zainab Qureshi',
    email: 'zainab.qureshi@edusync.com',
    departmentId: 3,
  },
];

// Courses
export const mockCourses = [
  {
    id: 1,
    name: 'Data Structures and Algorithms',
    course_code: 'CS201',
    departmentId: 1,
    credit_hours: 3,
  },
  {
    id: 2,
    name: 'Database Systems',
    course_code: 'CS301',
    departmentId: 1,
    credit_hours: 3,
  },
  {
    id: 3,
    name: 'Web Development',
    course_code: 'CS401',
    departmentId: 1,
    credit_hours: 3,
  },
  {
    id: 4,
    name: 'Artificial Intelligence',
    course_code: 'CS501',
    departmentId: 1,
    credit_hours: 3,
  },
  {
    id: 5,
    name: 'Machine Learning',
    course_code: 'DS301',
    departmentId: 2,
    credit_hours: 3,
  },
  {
    id: 6,
    name: 'Software Engineering',
    course_code: 'SE301',
    departmentId: 3,
    credit_hours: 3,
  },
  {
    id: 7,
    name: 'Deep Learning',
    course_code: 'AI301',
    departmentId: 4,
    credit_hours: 3,
  },
  {
    id: 8,
    name: 'Circuit Theory',
    course_code: 'EE201',
    departmentId: 5,
    credit_hours: 3,
  },
];

// Current student
export const mockCurrentStudent = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@student.edusync.com',
  departmentId: 1,
  classId: 3,
  sectionId: 1,
  studentId: 'CS2022-001',
  department: 'Computer Science',
  class: 'CS2022',
  section: 'A',
};

// Student course enrollments
export const mockEnrollments = [
  { id: 1, studentId: 1, courseId: 1, enrolled_at: '2023-09-01T00:00:00Z' },
  { id: 2, studentId: 1, courseId: 2, enrolled_at: '2023-09-01T00:00:00Z' },
  { id: 3, studentId: 1, courseId: 3, enrolled_at: '2023-09-01T00:00:00Z' },
  { id: 4, studentId: 1, courseId: 4, enrolled_at: '2023-09-01T00:00:00Z' },
];

// Class schedules
export const mockSchedules = [
  {
    id: 1,
    courseId: 1,
    facultyId: 1,
    classId: 3,
    sectionId: 1,
    day_of_week: 'Monday',
    start_time: '09:00:00',
    end_time: '10:30:00',
    course: 'Data Structures and Algorithms',
    course_code: 'CS201',
    faculty: 'Dr. Ahmed Khan',
    location: 'CS-101',
  },
  {
    id: 2,
    courseId: 2,
    facultyId: 2,
    classId: 3,
    sectionId: 1,
    day_of_week: 'Monday',
    start_time: '11:00:00',
    end_time: '12:30:00',
    course: 'Database Systems',
    course_code: 'CS301',
    faculty: 'Prof. Sarah Ali',
    location: 'CS-101',
  },
  {
    id: 3,
    courseId: 3,
    facultyId: 3,
    classId: 3,
    sectionId: 1,
    day_of_week: 'Tuesday',
    start_time: '09:00:00',
    end_time: '10:30:00',
    course: 'Web Development',
    course_code: 'CS401',
    faculty: 'Dr. Imran Malik',
    location: 'CS-101',
  },
  {
    id: 4,
    courseId: 4,
    facultyId: 1,
    classId: 3,
    sectionId: 1,
    day_of_week: 'Wednesday',
    start_time: '09:00:00',
    end_time: '10:30:00',
    course: 'Artificial Intelligence',
    course_code: 'CS501',
    faculty: 'Dr. Ahmed Khan',
    location: 'CS-101',
  },
  {
    id: 5,
    courseId: 1,
    facultyId: 1,
    classId: 3,
    sectionId: 1,
    day_of_week: 'Wednesday',
    start_time: '11:00:00',
    end_time: '12:30:00',
    course: 'Data Structures and Algorithms',
    course_code: 'CS201',
    faculty: 'Dr. Ahmed Khan',
    location: 'CS-101',
  },
  {
    id: 6,
    courseId: 2,
    facultyId: 2,
    classId: 3,
    sectionId: 1,
    day_of_week: 'Thursday',
    start_time: '09:00:00',
    end_time: '10:30:00',
    course: 'Database Systems',
    course_code: 'CS301',
    faculty: 'Prof. Sarah Ali',
    location: 'CS-101',
  },
  {
    id: 7,
    courseId: 3,
    facultyId: 3,
    classId: 3,
    sectionId: 1,
    day_of_week: 'Friday',
    start_time: '09:00:00',
    end_time: '10:30:00',
    course: 'Web Development',
    course_code: 'CS401',
    faculty: 'Dr. Imran Malik',
    location: 'CS-101',
  },
];

// Attendance records
export const mockAttendance = [
  // Data Structures and Algorithms
  { id: 1, studentId: 1, courseId: 1, date: '2024-01-01', status: 'Present' },
  { id: 2, studentId: 1, courseId: 1, date: '2024-01-03', status: 'Present' },
  { id: 3, studentId: 1, courseId: 1, date: '2024-01-08', status: 'Present' },
  { id: 4, studentId: 1, courseId: 1, date: '2024-01-10', status: 'Absent' },
  { id: 5, studentId: 1, courseId: 1, date: '2024-01-15', status: 'Present' },
  { id: 6, studentId: 1, courseId: 1, date: '2024-01-17', status: 'Present' },
  { id: 7, studentId: 1, courseId: 1, date: '2024-01-22', status: 'Present' },
  { id: 8, studentId: 1, courseId: 1, date: '2024-01-24', status: 'Present' },
  { id: 9, studentId: 1, courseId: 1, date: '2024-01-29', status: 'Present' },
  { id: 10, studentId: 1, courseId: 1, date: '2024-01-31', status: 'Present' },

  // Database Systems
  { id: 11, studentId: 1, courseId: 2, date: '2024-01-01', status: 'Present' },
  { id: 12, studentId: 1, courseId: 2, date: '2024-01-04', status: 'Present' },
  { id: 13, studentId: 1, courseId: 2, date: '2024-01-08', status: 'Absent' },
  { id: 14, studentId: 1, courseId: 2, date: '2024-01-11', status: 'Present' },
  { id: 15, studentId: 1, courseId: 2, date: '2024-01-15', status: 'Present' },
  { id: 16, studentId: 1, courseId: 2, date: '2024-01-18', status: 'Late' },
  { id: 17, studentId: 1, courseId: 2, date: '2024-01-22', status: 'Present' },
  { id: 18, studentId: 1, courseId: 2, date: '2024-01-25', status: 'Present' },
  { id: 19, studentId: 1, courseId: 2, date: '2024-01-29', status: 'Present' },

  // Web Development
  { id: 20, studentId: 1, courseId: 3, date: '2024-01-02', status: 'Present' },
  { id: 21, studentId: 1, courseId: 3, date: '2024-01-05', status: 'Present' },
  { id: 22, studentId: 1, courseId: 3, date: '2024-01-09', status: 'Present' },
  { id: 23, studentId: 1, courseId: 3, date: '2024-01-12', status: 'Present' },
  { id: 24, studentId: 1, courseId: 3, date: '2024-01-16', status: 'Absent' },
  { id: 25, studentId: 1, courseId: 3, date: '2024-01-19', status: 'Present' },
  { id: 26, studentId: 1, courseId: 3, date: '2024-01-23', status: 'Present' },
  { id: 27, studentId: 1, courseId: 3, date: '2024-01-26', status: 'Present' },
  { id: 28, studentId: 1, courseId: 3, date: '2024-01-30', status: 'Present' },

  // Artificial Intelligence
  { id: 29, studentId: 1, courseId: 4, date: '2024-01-03', status: 'Present' },
  { id: 30, studentId: 1, courseId: 4, date: '2024-01-10', status: 'Present' },
  { id: 31, studentId: 1, courseId: 4, date: '2024-01-17', status: 'Present' },
  { id: 32, studentId: 1, courseId: 4, date: '2024-01-24', status: 'Absent' },
  { id: 33, studentId: 1, courseId: 4, date: '2024-01-31', status: 'Present' },
];

// Events
export const mockEvents = [
  {
    id: 1,
    title: 'Mid-term Examination',
    description: 'Mid-term examinations for all courses',
    event_date: '2024-02-15T09:00:00Z',
    location: 'Examination Hall',
  },
  {
    id: 2,
    title: 'Science Exhibition',
    description: 'Annual science exhibition showcasing student projects',
    event_date: '2024-02-20T10:00:00Z',
    location: 'University Auditorium',
  },
  {
    id: 3,
    title: 'Career Fair',
    description: 'Annual career fair with top companies',
    event_date: '2024-03-05T11:00:00Z',
    location: 'University Campus',
  },
  {
    id: 4,
    title: 'Workshop on AI',
    description: 'Workshop on Artificial Intelligence and Machine Learning',
    event_date: '2024-02-10T14:00:00Z',
    location: 'CS Building, Room 301',
  },
  {
    id: 5,
    title: 'Sports Day',
    description: 'Annual sports day with various competitions',
    event_date: '2024-03-15T09:00:00Z',
    location: 'University Sports Complex',
  },
  {
    id: 6,
    title: 'Hackathon 2024',
    description: '24-hour coding competition with prizes for top teams',
    event_date: '2024-04-05T08:00:00Z',
    location: 'Innovation Center',
  },
  {
    id: 7,
    title: 'Guest Lecture: Future of AI',
    description: 'Special lecture by Dr. James Wilson from MIT',
    event_date: '2024-03-22T15:00:00Z',
    location: 'Main Auditorium',
  },
  {
    id: 8,
    title: 'Final Examinations',
    description: 'End of semester examinations for all courses',
    event_date: '2024-05-10T09:00:00Z',
    location: 'Examination Halls',
  },
  {
    id: 9,
    title: 'Cultural Festival',
    description:
      'Annual cultural festival with performances, food, and activities',
    event_date: '2024-04-15T10:00:00Z',
    location: 'University Campus',
  },
  {
    id: 10,
    title: 'Graduation Ceremony',
    description: 'Graduation ceremony for the class of 2024',
    event_date: '2024-06-15T10:00:00Z',
    location: 'University Convocation Hall',
  },
  {
    id: 11,
    title: 'Research Symposium',
    description: 'Showcase of student and faculty research projects',
    event_date: '2024-03-28T09:00:00Z',
    location: 'Research Center',
  },
  {
    id: 12,
    title: 'Alumni Networking Event',
    description: 'Connect with alumni and build your professional network',
    event_date: '2024-04-22T18:00:00Z',
    location: 'Business School Lounge',
  },
];

// Invoices
export const mockInvoices = [
  {
    id: 1,
    studentId: 1,
    invoiceNumber: 'INV-2022-001',
    amount: 1500.0,
    issueDate: '2022-09-01T00:00:00Z',
    dueDate: '2022-09-10T00:00:00Z',
    status: 'Paid',
    description: 'Fall Semester Tuition Fee',
    semester: 'Fall 2022',
    academicYear: '2022',
  },
  {
    id: 2,
    studentId: 1,
    invoiceNumber: 'INV-2023-001',
    amount: 1500.0,
    issueDate: '2023-01-01T00:00:00Z',
    dueDate: '2023-01-10T00:00:00Z',
    status: 'Paid',
    description: 'Spring Semester Tuition Fee',
    semester: 'Spring 2023',
    academicYear: '2022',
  },
  {
    id: 3,
    studentId: 1,
    invoiceNumber: 'INV-2023-002',
    amount: 1500.0,
    issueDate: '2023-09-01T00:00:00Z',
    dueDate: '2023-09-10T00:00:00Z',
    status: 'Paid',
    description: 'Fall Semester Tuition Fee',
    semester: 'Fall 2023',
    academicYear: '2023',
  },
  {
    id: 4,
    studentId: 1,
    invoiceNumber: 'INV-2024-001',
    amount: 1500.0,
    issueDate: '2024-01-01T00:00:00Z',
    dueDate: '2024-01-10T00:00:00Z',
    status: 'Paid',
    description: 'Spring Semester Tuition Fee',
    semester: 'Spring 2024',
    academicYear: '2023',
  },
  {
    id: 5,
    studentId: 1,
    invoiceNumber: 'INV-2024-002',
    amount: 500.0,
    issueDate: '2024-02-01T00:00:00Z',
    dueDate: '2024-02-10T00:00:00Z',
    status: 'Unpaid',
    description: 'Laboratory Fee',
    semester: 'Spring 2024',
    academicYear: '2023',
  },
  {
    id: 6,
    studentId: 1,
    invoiceNumber: 'INV-2024-003',
    amount: 300.0,
    issueDate: '2024-03-01T00:00:00Z',
    dueDate: '2024-03-10T00:00:00Z',
    status: 'Partial',
    description: 'Library and IT Services Fee',
    semester: 'Spring 2024',
    academicYear: '2023',
  },
  {
    id: 7,
    studentId: 1,
    invoiceNumber: 'INV-2024-004',
    amount: 1800.0,
    issueDate: '2024-09-01T00:00:00Z',
    dueDate: '2024-09-10T00:00:00Z',
    status: 'Unpaid',
    description: 'Fall Semester Tuition Fee',
    semester: 'Fall 2024',
    academicYear: '2024',
  },
  // Different student
  {
    id: 8,
    studentId: 2,
    invoiceNumber: 'INV-2024-005',
    amount: 1500.0,
    issueDate: '2024-01-01T00:00:00Z',
    dueDate: '2024-01-10T00:00:00Z',
    status: 'Paid',
    description: 'Spring Semester Tuition Fee',
    semester: 'Spring 2024',
    academicYear: '2023',
  },
];

// Helper functions to work with mock data
export const getTodayClasses = () => {
  const today = new Date();
  const dayOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ][today.getDay()];

  return mockSchedules
    .filter((schedule) => schedule.day_of_week === dayOfWeek)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
};

export const getAttendanceByCourseSummary = () => {
  const summary = [];

  for (const course of mockCourses.filter((c) =>
    mockEnrollments.some((e) => e.courseId === c.id)
  )) {
    const courseAttendance = mockAttendance.filter(
      (a) => a.courseId === course.id
    );
    const totalClasses = courseAttendance.length;
    const presentClasses = courseAttendance.filter(
      (a) => a.status === 'Present'
    ).length;
    const lateClasses = courseAttendance.filter(
      (a) => a.status === 'Late'
    ).length;
    const absentClasses = courseAttendance.filter(
      (a) => a.status === 'Absent'
    ).length;

    const percentage = Math.round(
      ((presentClasses + lateClasses) / totalClasses) * 100
    );

    summary.push({
      id: course.id,
      name: course.name,
      code: course.course_code,
      attended: presentClasses + lateClasses,
      total: totalClasses,
      percentage,
    });
  }

  return summary;
};

export const getUpcomingEvents = () => {
  const today = new Date();

  return mockEvents
    .filter((event) => new Date(event.event_date) > today)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .map((event) => ({
      ...event,
      date: new Date(event.event_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: new Date(event.event_date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
};
