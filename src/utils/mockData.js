// Mock data based on the Prisma schema

// Departments
export const mockDepartments = [
  { id: 1, name: "Computer Science", code: "CS" },
  { id: 2, name: "Data Science", code: "DS" },
  { id: 3, name: "Software Engineering", code: "SE" },
  { id: 4, name: "Artificial Intelligence", code: "AI" },
  { id: 5, name: "Electrical Engineering", code: "EE" },
]
// Classes (batches)
export const mockClasses = [
  { id: 1, name: "CS2020", departmentId: 1 },
  { id: 2, name: "CS2021", departmentId: 1 },
  { id: 3, name: "CS2022", departmentId: 1 },
  { id: 4, name: "CS2023", departmentId: 1 },
  { id: 5, name: "DS2022", departmentId: 2 },
  { id: 6, name: "SE2021", departmentId: 3 },
  { id: 7, name: "AI2023", departmentId: 4 },
  { id: 8, name: "EE2022", departmentId: 5 },
]

// Sections
export const mockSections = [
  { id: 1, name: "A", classId: 3, room_no: "CS-101", advisorId: 1 },
  { id: 2, name: "B", classId: 3, room_no: "CS-102", advisorId: 2 },
  { id: 3, name: "A", classId: 4, room_no: "CS-201", advisorId: 3 },
  { id: 4, name: "B", classId: 4, room_no: "CS-202", advisorId: 4 },
  { id: 5, name: "A", classId: 5, room_no: "DS-101", advisorId: 4 },
  { id: 6, name: "A", classId: 6, room_no: "SE-101", advisorId: 5 },
]

// Faculty
export const mockFaculty = [
  { id: 1, name: "Dr. Ahmed Khan", email: "ahmed.khan@edusync.com", departmentId: 1, department: "Computer Science" },
  { id: 2, name: "Prof. Sarah Ali", email: "sarah.ali@edusync.com", departmentId: 1, department: "Computer Science" },
  { id: 3, name: "Dr. Imran Malik", email: "imran.malik@edusync.com", departmentId: 1, department: "Computer Science" },
  {
    id: 4,
    name: "Prof. Fatima Hassan",
    email: "fatima.hassan@edusync.com",
    departmentId: 2,
    department: "Data Science",
  },
  {
    id: 5,
    name: "Dr. Zainab Qureshi",
    email: "zainab.qureshi@edusync.com",
    departmentId: 3,
    department: "Software Engineering",
  },
]

// Current faculty
export const mockCurrentFaculty = {
  id: 1,
  name: "Dr. Ahmed Khan",
  email: "ahmed.khan@edusync.com",
  departmentId: 1,
  department: "Computer Science",
  designation: "Associate Professor",
  specialization: "Algorithms and Data Structures",
  office_hours: "Monday, Wednesday: 2:00 PM - 4:00 PM",
  office_location: "CS Building, Room 305",
  phone: "+92-300-1234567",
}
// Courses
export const mockCourses = [
  { id: 1, name: "Data Structures and Algorithms", course_code: "CS201", departmentId: 1, credit_hours: 3 },
  { id: 2, name: "Database Systems", course_code: "CS301", departmentId: 1, credit_hours: 3 },
  { id: 3, name: "Web Development", course_code: "CS401", departmentId: 1, credit_hours: 3 },
  { id: 4, name: "Artificial Intelligence", course_code: "CS501", departmentId: 1, credit_hours: 3 },
  { id: 5, name: "Machine Learning", course_code: "DS301", departmentId: 2, credit_hours: 3 },
  { id: 6, name: "Software Engineering", course_code: "SE301", departmentId: 3, credit_hours: 3 },
  { id: 7, name: "Deep Learning", course_code: "AI301", departmentId: 4, credit_hours: 3 },
  { id: 8, name: "Circuit Theory", course_code: "EE201", departmentId: 5, credit_hours: 3 },
]

// Current student
export const mockCurrentStudent = {
  id: 1,
  name: "John Doe",
  email: "john.doe@student.edusync.com",
  departmentId: 1,
  classId: 3,
  sectionId: 1,
  studentId: "CS2022-001",
  department: "Computer Science",
  class: "CS2022",
  section: "A",
}

// Student course enrollments
export const mockEnrollments = [
  { id: 1, studentId: 1, courseId: 1, enrolled_at: "2023-09-01T00:00:00Z" },
  { id: 2, studentId: 1, courseId: 2, enrolled_at: "2023-09-01T00:00:00Z" },
  { id: 3, studentId: 1, courseId: 3, enrolled_at: "2023-09-01T00:00:00Z" },
  { id: 4, studentId: 1, courseId: 4, enrolled_at: "2023-09-01T00:00:00Z" },
]

// Class schedules
export const mockSchedules = [
  {
    id: 1,
    courseId: 1,
    facultyId: 1,
    classId: 3,
    sectionId: 1,
    day_of_week: "Monday",
    start_time: "09:00:00",
    end_time: "10:30:00",
    course: "Data Structures and Algorithms",
    course_code: "CS201",
    faculty: "Dr. Ahmed Khan",
    location: "CS-101",
  },
  {
    id: 2,
    courseId: 2,
    facultyId: 2,
    classId: 3,
    sectionId: 1,
    day_of_week: "Monday",
    start_time: "11:00:00",
    end_time: "12:30:00",
    course: "Database Systems",
    course_code: "CS301",
    faculty: "Prof. Sarah Ali",
    location: "CS-101",
  },
  {
    id: 3,
    courseId: 3,
    facultyId: 3,
    classId: 3,
    sectionId: 1,
    day_of_week: "Tuesday",
    start_time: "09:00:00",
    end_time: "10:30:00",
    course: "Web Development",
    course_code: "CS401",
    faculty: "Dr. Imran Malik",
    location: "CS-101",
  },
  {
    id: 4,
    courseId: 4,
    facultyId: 1,
    classId: 3,
    sectionId: 1,
    day_of_week: "Wednesday",
    start_time: "09:00:00",
    end_time: "10:30:00",
    course: "Artificial Intelligence",
    course_code: "CS501",
    faculty: "Dr. Ahmed Khan",
    location: "CS-101",
  },
  {
    id: 5,
    courseId: 1,
    facultyId: 1,
    classId: 3,
    sectionId: 1,
    day_of_week: "Wednesday",
    start_time: "11:00:00",
    end_time: "12:30:00",
    course: "Data Structures and Algorithms",
    course_code: "CS201",
    faculty: "Dr. Ahmed Khan",
    location: "CS-101",
  },
  {
    id: 6,
    courseId: 2,
    facultyId: 2,
    classId: 3,
    sectionId: 1,
    day_of_week: "Thursday",
    start_time: "09:00:00",
    end_time: "10:30:00",
    course: "Database Systems",
    course_code: "CS301",
    faculty: "Prof. Sarah Ali",
    location: "CS-101",
  },
  {
    id: 7,
    courseId: 3,
    facultyId: 3,
    classId: 3,
    sectionId: 1,
    day_of_week: "Friday",
    start_time: "09:00:00",
    end_time: "10:30:00",
    course: "Web Development",
    course_code: "CS401",
    faculty: "Dr. Imran Malik",
    location: "CS-101",
  },
  // Additional schedules for Dr. Ahmed Khan
  {
    id: 8,
    courseId: 1,
    facultyId: 1,
    classId: 3,
    sectionId: 2,
    day_of_week: "Monday",
    start_time: "14:00:00",
    end_time: "15:30:00",
    course: "Data Structures and Algorithms",
    course_code: "CS201",
    faculty: "Dr. Ahmed Khan",
    location: "CS-102",
  },
  {
    id: 9,
    courseId: 4,
    facultyId: 1,
    classId: 4,
    sectionId: 3,
    day_of_week: "Tuesday",
    start_time: "11:00:00",
    end_time: "12:30:00",
    course: "Artificial Intelligence",
    course_code: "CS501",
    faculty: "Dr. Ahmed Khan",
    location: "CS-201",
  },
  {
    id: 10,
    courseId: 4,
    facultyId: 1,
    classId: 4,
    sectionId: 4,
    day_of_week: "Thursday",
    start_time: "14:00:00",
    end_time: "15:30:00",
    course: "Artificial Intelligence",
    course_code: "CS501",
    faculty: "Dr. Ahmed Khan",
    location: "CS-202",
  },
]

// Faculty class schedules with student counts
export const mockFacultySchedules = [
  {
    id: 1,
    courseId: 1,
    facultyId: 1,
    classId: 3,
    sectionId: 1,
    day_of_week: "Monday",
    start_time: "09:00:00",
    end_time: "10:30:00",
    course: "Data Structures and Algorithms",
    course_code: "CS201",
    class_name: "CS2022",
    section_name: "A",
    location: "CS-101",
    student_count: 35,
  },
  {
    id: 5,
    courseId: 1,
    facultyId: 1,
    classId: 3,
    sectionId: 1,
    day_of_week: "Wednesday",
    start_time: "11:00:00",
    end_time: "12:30:00",
    course: "Data Structures and Algorithms",
    course_code: "CS201",
    class_name: "CS2022",
    section_name: "A",
    location: "CS-101",
    student_count: 35,
  },
  {
    id: 4,
    courseId: 4,
    facultyId: 1,
    classId: 3,
    sectionId: 1,
    day_of_week: "Wednesday",
    start_time: "09:00:00",
    end_time: "10:30:00",
    course: "Artificial Intelligence",
    course_code: "CS501",
    class_name: "CS2022",
    section_name: "A",
    location: "CS-101",
    student_count: 32,
  },
  {
    id: 8,
    courseId: 1,
    facultyId: 1,
    classId: 3,
    sectionId: 2,
    day_of_week: "Monday",
    start_time: "14:00:00",
    end_time: "15:30:00",
    course: "Data Structures and Algorithms",
    course_code: "CS201",
    class_name: "CS2022",
    section_name: "B",
    location: "CS-102",
    student_count: 30,
  },
  {
    id: 9,
    courseId: 4,
    facultyId: 1,
    classId: 4,
    sectionId: 3,
    day_of_week: "Tuesday",
    start_time: "11:00:00",
    end_time: "12:30:00",
    course: "Artificial Intelligence",
    course_code: "CS501",
    class_name: "CS2023",
    section_name: "A",
    location: "CS-201",
    student_count: 28,
  },
  {
    id: 10,
    courseId: 4,
    facultyId: 1,
    classId: 4,
    sectionId: 4,
    day_of_week: "Thursday",
    start_time: "14:00:00",
    end_time: "15:30:00",
    course: "Artificial Intelligence",
    course_code: "CS501",
    class_name: "CS2023",
    section_name: "B",
    location: "CS-202",
    student_count: 25,
  },
]

// Faculty statistics
export const mockFacultyStats = {
  totalClasses: 6, // Total number of classes taught by the faculty
  totalSections: 4, // Total number of sections taught by the faculty
  totalCourses: 2, // Total number of unique courses taught by the faculty
  totalStudents: 150, // Total number of students taught by the faculty
  averageAttendance: 85, // Average attendance percentage across all classes
}

// Attendance records
export const mockAttendance = [
  // Data Structures and Algorithms
  { id: 1, studentId: 1, courseId: 1, date: "2024-01-01", status: "Present" },
  { id: 2, studentId: 1, courseId: 1, date: "2024-01-03", status: "Present" },
  { id: 3, studentId: 1, courseId: 1, date: "2024-01-08", status: "Present" },
  { id: 4, studentId: 1, courseId: 1, date: "2024-01-10", status: "Absent" },
  { id: 5, studentId: 1, courseId: 1, date: "2024-01-15", status: "Present" },
  { id: 6, studentId: 1, courseId: 1, date: "2024-01-17", status: "Present" },
  { id: 7, studentId: 1, courseId: 1, date: "2024-01-22", status: "Present" },
  { id: 8, studentId: 1, courseId: 1, date: "2024-01-24", status: "Present" },
  { id: 9, studentId: 1, courseId: 1, date: "2024-01-29", status: "Present" },
  { id: 10, studentId: 1, courseId: 1, date: "2024-01-31", status: "Present" },

  // Database Systems
  { id: 11, studentId: 1, courseId: 2, date: "2024-01-01", status: "Present" },
  { id: 12, studentId: 1, courseId: 2, date: "2024-01-04", status: "Present" },
  { id: 13, studentId: 1, courseId: 2, date: "2024-01-08", status: "Absent" },
  { id: 14, studentId: 1, courseId: 2, date: "2024-01-11", status: "Present" },
  { id: 15, studentId: 1, courseId: 2, date: "2024-01-15", status: "Present" },
  { id: 16, studentId: 1, courseId: 2, date: "2024-01-18", status: "Late" },
  { id: 17, studentId: 1, courseId: 2, date: "2024-01-22", status: "Present" },
  { id: 18, studentId: 1, courseId: 2, date: "2024-01-25", status: "Present" },
  { id: 19, studentId: 1, courseId: 2, date: "2024-01-29", status: "Present" },

  // Web Development
  { id: 20, studentId: 1, courseId: 3, date: "2024-01-02", status: "Present" },
  { id: 21, studentId: 1, courseId: 3, date: "2024-01-05", status: "Present" },
  { id: 22, studentId: 1, courseId: 3, date: "2024-01-09", status: "Present" },
  { id: 23, studentId: 1, courseId: 3, date: "2024-01-12", status: "Present" },
  { id: 24, studentId: 1, courseId: 3, date: "2024-01-16", status: "Absent" },
  { id: 25, studentId: 1, courseId: 3, date: "2024-01-19", status: "Present" },
  { id: 26, studentId: 1, courseId: 3, date: "2024-01-23", status: "Present" },
  { id: 27, studentId: 1, courseId: 3, date: "2024-01-26", status: "Present" },
  { id: 28, studentId: 1, courseId: 3, date: "2024-01-30", status: "Present" },

  // Artificial Intelligence
  { id: 29, studentId: 1, courseId: 4, date: "2024-01-03", status: "Present" },
  { id: 30, studentId: 1, courseId: 4, date: "2024-01-10", status: "Present" },
  { id: 31, studentId: 1, courseId: 4, date: "2024-01-17", status: "Present" },
  { id: 32, studentId: 1, courseId: 4, date: "2024-01-24", status: "Absent" },
  { id: 33, studentId: 1, courseId: 4, date: "2024-01-31", status: "Present" },
]

// Events
export const mockEvents = [
  {
    id: 1,
    title: "Mid-term Examination",
    description: "Mid-term examinations for all courses",
    event_date: "2024-02-15T09:00:00Z",
    location: "Examination Hall",
    category: "Academic",
    organizer: "Examination Department",
    tags: ["Exam", "Important"],
    is_mandatory: true,
    registration_required: false,
    max_participants: null,
    department_id: null, // For all departments
  },
  {
    id: 2,
    title: "Science Exhibition",
    description: "Annual science exhibition showcasing student projects",
    event_date: "2024-02-20T10:00:00Z",
    location: "University Auditorium",
    category: "Exhibition",
    organizer: "Science Club",
    tags: ["Science", "Projects", "Exhibition"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 200,
    department_id: null, // For all departments
  },
  // More events...
]

// Messages received by the student
export const mockReceivedMessages = [
  {
    id: 1,
    sender_id: 1,
    sender_type: "faculty",
    sender_name: "Dr. Ahmed Khan",
    sender_email: "ahmed.khan@edusync.com",
    recipient_id: 1,
    recipient_type: "student",
    subject: "Assignment Feedback - Data Structures and Algorithms",
    content:
      "Dear John,\n\nI've reviewed your recent assignment on Binary Trees. Your implementation was well-structured and your analysis of time complexity was accurate. However, I noticed some inefficiencies in your balancing algorithm.\n\nPlease review the comments I've added to your submission and consider revising your approach. I'm available during office hours if you'd like to discuss this further.\n\nBest regards,\nDr. Ahmed Khan",
    sent_at: "2024-01-15T14:30:00Z",
    read: true,
    attachments: ["Assignment1_Feedback.pdf"],
  },
  // More messages...
]

// Messages sent by the student
export const mockSentMessages = [
  {
    id: 1,
    sender_id: 1,
    sender_type: "student",
    recipient_id: 1,
    recipient_type: "faculty",
    recipient_name: "Dr. Ahmed Khan",
    recipient_email: "ahmed.khan@edusync.com",
    subject: "Question about Assignment #2",
    content:
      "Dear Dr. Khan,\n\nI'm working on Assignment #2 for Data Structures and Algorithms, and I have a question about the requirements for the AVL tree implementation.\n\nThe assignment states that we need to implement both insertion and deletion operations, but I'm unclear whether we need to handle the case of duplicate keys. Could you please clarify this?\n\nThank you for your help.\n\nBest regards,\nJohn Doe",
    sent_at: "2024-01-16T09:45:00Z",
    attachments: [],
  },
  // More messages...
]

// Invoices
export const mockInvoices = [
  {
    id: 1,
    studentId: 1,
    invoiceNumber: "INV-2022-001",
    amount: 1500.0,
    issueDate: "2022-09-01T00:00:00Z",
    dueDate: "2022-09-10T00:00:00Z",
    status: "Paid",
    description: "Fall Semester Tuition Fee",
    semester: "Fall 2022",
    academicYear: "2022",
  },
  // More invoices...
]

// Helper functions to work with mock data
export const getTodayClasses = () => {
  const today = new Date()
  const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()]

  return mockSchedules
    .filter((schedule) => schedule.day_of_week === dayOfWeek)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
}

export const getFacultyTodayClasses = () => {
  const today = new Date()
  const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()]

  return mockFacultySchedules
    .filter((schedule) => schedule.day_of_week === dayOfWeek)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
}

export const getAttendanceByCourseSummary = () => {
  const summary = []

  for (const course of mockCourses.filter((c) => mockEnrollments.some((e) => e.courseId === c.id))) {
    const courseAttendance = mockAttendance.filter((a) => a.courseId === course.id)
    const totalClasses = courseAttendance.length
    const presentClasses = courseAttendance.filter((a) => a.status === "Present").length
    const lateClasses = courseAttendance.filter((a) => a.status === "Late").length
    const absentClasses = courseAttendance.filter((a) => a.status === "Absent").length

    const percentage = Math.round(((presentClasses + lateClasses) / totalClasses) * 100)

    summary.push({
      id: course.id,
      name: course.name,
      code: course.course_code,
      attended: presentClasses + lateClasses,
      total: totalClasses,
      percentage,
    })
  }

  return summary
}

export const getUpcomingEventsFormatted = () => {
  const today = new Date()

  return mockEvents
    .filter((event) => new Date(event.event_date) > today)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .map((event) => {
      const eventDate = new Date(event.event_date)
      return {
        ...event,
        date: eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        time: eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        formattedDate: eventDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      }
    })
}
