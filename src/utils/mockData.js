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
  {
    id: 3,
    title: "Career Fair",
    description: "Annual career fair with top companies",
    event_date: "2024-03-05T11:00:00Z",
    location: "University Campus",
    category: "Career",
    organizer: "Career Development Center",
    tags: ["Jobs", "Networking", "Career"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 500,
    department_id: null, // For all departments
  },
  {
    id: 4,
    title: "Workshop on AI",
    description: "Workshop on Artificial Intelligence and Machine Learning",
    event_date: "2024-02-10T14:00:00Z",
    location: "CS Building, Room 301",
    category: "Workshop",
    organizer: "AI Research Lab",
    tags: ["AI", "Machine Learning", "Workshop"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 50,
    department_id: 1, // CS Department
  },
  {
    id: 5,
    title: "Sports Day",
    description: "Annual sports day with various competitions",
    event_date: "2024-03-15T09:00:00Z",
    location: "University Sports Complex",
    category: "Sports",
    organizer: "Sports Department",
    tags: ["Sports", "Competition", "Physical Activity"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 300,
    department_id: null, // For all departments
  },
  {
    id: 6,
    title: "Hackathon 2024",
    description: "24-hour coding competition with prizes for top teams",
    event_date: "2024-04-05T08:00:00Z",
    location: "Innovation Center",
    category: "Competition",
    organizer: "Computer Science Society",
    tags: ["Coding", "Competition", "Prizes"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 100,
    department_id: 1, // CS Department
  },
  {
    id: 7,
    title: "Guest Lecture: Future of AI",
    description: "Special lecture by Dr. James Wilson from MIT",
    event_date: "2024-03-22T15:00:00Z",
    location: "Main Auditorium",
    category: "Lecture",
    organizer: "AI Department",
    tags: ["AI", "Guest Lecture", "Education"],
    is_mandatory: false,
    registration_required: false,
    max_participants: 200,
    department_id: 4, // AI Department
  },
  {
    id: 8,
    title: "Final Examinations",
    description: "End of semester examinations for all courses",
    event_date: "2024-05-10T09:00:00Z",
    location: "Examination Halls",
    category: "Academic",
    organizer: "Examination Department",
    tags: ["Exam", "Important"],
    is_mandatory: true,
    registration_required: false,
    max_participants: null,
    department_id: null, // For all departments
  },
  {
    id: 9,
    title: "Cultural Festival",
    description: "Annual cultural festival with performances, food, and activities",
    event_date: "2024-04-15T10:00:00Z",
    location: "University Campus",
    category: "Cultural",
    organizer: "Student Affairs",
    tags: ["Culture", "Festival", "Entertainment"],
    is_mandatory: false,
    registration_required: false,
    max_participants: null,
    department_id: null, // For all departments
  },
  {
    id: 10,
    title: "Graduation Ceremony",
    description: "Graduation ceremony for the class of 2024",
    event_date: "2024-06-15T10:00:00Z",
    location: "University Convocation Hall",
    category: "Ceremony",
    organizer: "Administration",
    tags: ["Graduation", "Ceremony", "Important"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 1000,
    department_id: null, // For all departments
  },
  {
    id: 11,
    title: "Research Symposium",
    description: "Showcase of student and faculty research projects",
    event_date: "2024-03-28T09:00:00Z",
    location: "Research Center",
    category: "Academic",
    organizer: "Research Department",
    tags: ["Research", "Academic", "Presentation"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 150,
    department_id: null, // For all departments
  },
  {
    id: 12,
    title: "Alumni Networking Event",
    description: "Connect with alumni and build your professional network",
    event_date: "2024-04-22T18:00:00Z",
    location: "Business School Lounge",
    category: "Networking",
    organizer: "Alumni Association",
    tags: ["Networking", "Alumni", "Career"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 100,
    department_id: null, // For all departments
  },
  {
    id: 13,
    title: "Database Systems Workshop",
    description: "Hands-on workshop on advanced database concepts and optimization techniques",
    event_date: "2024-03-12T13:00:00Z",
    location: "CS Building, Lab 201",
    category: "Workshop",
    organizer: "Database Research Group",
    tags: ["Database", "Workshop", "Technical"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 30,
    department_id: 1, // CS Department
  },
  {
    id: 14,
    title: "Web Development Bootcamp",
    description: "Intensive 3-day bootcamp on modern web development frameworks",
    event_date: "2024-04-10T09:00:00Z",
    location: "Innovation Hub",
    category: "Bootcamp",
    organizer: "Web Development Club",
    tags: ["Web Development", "Bootcamp", "Coding"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 40,
    department_id: 1, // CS Department
  },
  {
    id: 15,
    title: "Machine Learning Seminar",
    description: "Seminar on recent advances in machine learning and deep learning",
    event_date: "2024-03-18T14:00:00Z",
    location: "AI Research Center",
    category: "Seminar",
    organizer: "Machine Learning Research Group",
    tags: ["Machine Learning", "AI", "Research"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 75,
    department_id: 4, // AI Department
  },
  {
    id: 16,
    title: "Software Engineering Project Showcase",
    description: "Presentation of final year software engineering projects",
    event_date: "2024-05-05T10:00:00Z",
    location: "Engineering Building, Hall 3",
    category: "Showcase",
    organizer: "Software Engineering Department",
    tags: ["Software Engineering", "Projects", "Showcase"],
    is_mandatory: false,
    registration_required: false,
    max_participants: 120,
    department_id: 3, // SE Department
  },
  {
    id: 17,
    title: "Data Science Workshop",
    description: "Workshop on data analysis and visualization techniques",
    event_date: "2024-04-08T09:30:00Z",
    location: "Data Science Lab",
    category: "Workshop",
    organizer: "Data Science Club",
    tags: ["Data Science", "Workshop", "Analytics"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 35,
    department_id: 2, // DS Department
  },
  {
    id: 18,
    title: "Cybersecurity Awareness Day",
    description: "Sessions on cybersecurity best practices and threat prevention",
    event_date: "2024-03-25T11:00:00Z",
    location: "CS Building, Auditorium",
    category: "Awareness",
    organizer: "Cybersecurity Club",
    tags: ["Cybersecurity", "Awareness", "Security"],
    is_mandatory: false,
    registration_required: false,
    max_participants: 150,
    department_id: 1, // CS Department
  },
  {
    id: 19,
    title: "Robotics Competition",
    description: "Annual robotics competition with teams from various universities",
    event_date: "2024-04-28T09:00:00Z",
    location: "Engineering Complex",
    category: "Competition",
    organizer: "Robotics Club",
    tags: ["Robotics", "Competition", "Engineering"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 20,
    department_id: 5, // EE Department
  },
  {
    id: 20,
    title: "Industry Connect: Tech Careers",
    description: "Panel discussion with industry experts about careers in technology",
    event_date: "2024-04-12T15:00:00Z",
    location: "Career Center",
    category: "Career",
    organizer: "Career Development Office",
    tags: ["Career", "Industry", "Technology"],
    is_mandatory: false,
    registration_required: true,
    max_participants: 100,
    department_id: null, // For all departments
  },
  {
    id: 21,
    title: "Faculty Development Workshop",
    description: "Workshop on innovative teaching methodologies and educational technologies",
    event_date: "2024-02-25T09:00:00Z",
    location: "Faculty Development Center",
    category: "Workshop",
    organizer: "Academic Affairs",
    tags: ["Faculty", "Teaching", "Development"],
    is_mandatory: true,
    registration_required: true,
    max_participants: 50,
    department_id: null, // For all departments
  },
  {
    id: 22,
    title: "Curriculum Review Meeting",
    description: "Annual meeting to review and update course curricula",
    event_date: "2024-03-10T14:00:00Z",
    location: "Conference Room A",
    category: "Meeting",
    organizer: "Department Heads",
    tags: ["Curriculum", "Academic", "Planning"],
    is_mandatory: true,
    registration_required: false,
    max_participants: null,
    department_id: 1, // CS Department
  },
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
  {
    id: 2,
    sender_id: 2,
    sender_type: "faculty",
    sender_name: "Prof. Sarah Ali",
    sender_email: "sarah.ali@edusync.com",
    recipient_id: 1,
    recipient_type: "student",
    subject: "Database Project Group Assignment",
    content:
      "Hello John,\n\nI'm writing to inform you about the upcoming database project. You've been assigned to Group 3 with the following classmates:\n\n- Emma Johnson\n- Michael Smith\n- Sophia Chen\n\nPlease connect with your group members to start planning your project. The project requirements document is attached.\n\nThe first milestone is due on February 10th.\n\nRegards,\nProf. Sarah Ali",
    sent_at: "2024-01-20T10:15:00Z",
    read: true,
    attachments: ["DB_Project_Requirements.pdf", "Group_Assignments.xlsx"],
  },
  {
    id: 3,
    sender_id: 1,
    sender_type: "admin",
    sender_name: "Academic Affairs Office",
    sender_email: "academic.affairs@edusync.com",
    recipient_id: 1,
    recipient_type: "student",
    subject: "Important: Spring Semester Registration",
    content:
      "Dear Student,\n\nThis is a reminder that Spring Semester course registration opens on January 25th at 9:00 AM. Please ensure that you have cleared any outstanding fees before attempting to register.\n\nRegistration will be available through the student portal. The course catalog for the upcoming semester is now available for review.\n\nIf you have any questions or need assistance, please contact the Academic Affairs Office.\n\nBest regards,\nAcademic Affairs Office",
    sent_at: "2024-01-22T09:00:00Z",
    read: false,
    attachments: [],
  },
  {
    id: 4,
    sender_id: 3,
    sender_type: "faculty",
    sender_name: "Dr. Imran Malik",
    sender_email: "imran.malik@edusync.com",
    recipient_id: 1,
    recipient_type: "student",
    subject: "Web Development - Additional Resources",
    content:
      "Hi John,\n\nFollowing our class discussion today, I wanted to share some additional resources on responsive design and CSS frameworks that might help with your current assignment.\n\nI've attached a PDF with links to tutorials and documentation. Also, don't forget that your project proposal is due next week.\n\nLet me know if you have any questions!\n\nBest,\nDr. Imran Malik",
    sent_at: "2024-01-23T16:45:00Z",
    read: false,
    attachments: ["Web_Dev_Resources.pdf"],
  },
  {
    id: 5,
    sender_id: 2,
    sender_type: "admin",
    sender_name: "Financial Aid Office",
    sender_email: "financial.aid@edusync.com",
    recipient_id: 1,
    recipient_type: "student",
    subject: "Scholarship Opportunity - Computer Science Excellence Award",
    content:
      "Dear John Doe,\n\nBased on your academic performance, you are eligible to apply for the Computer Science Excellence Scholarship for the upcoming academic year.\n\nThis scholarship covers 50% of tuition fees and is awarded to students who demonstrate exceptional skills in programming and algorithm design.\n\nThe application deadline is February 15th. Please find the application form and requirements attached.\n\nSincerely,\nFinancial Aid Office",
    sent_at: "2024-01-25T11:30:00Z",
    read: false,
    attachments: ["Scholarship_Application.pdf", "Eligibility_Criteria.pdf"],
  },
  {
    id: 6,
    sender_id: 3,
    sender_type: "admin",
    sender_name: "Student Affairs",
    sender_email: "student.affairs@edusync.com",
    recipient_id: 1,
    recipient_type: "student",
    subject: "Campus Housing Maintenance Notice",
    content:
      "Dear Resident,\n\nPlease be informed that maintenance work will be carried out in your dormitory building on January 30th from 10:00 AM to 2:00 PM. During this time, there may be temporary disruptions to water supply and internet connectivity.\n\nWe apologize for any inconvenience this may cause. If you have any concerns, please contact the Housing Office.\n\nThank you for your understanding.\n\nBest regards,\nStudent Affairs",
    sent_at: "2024-01-26T14:00:00Z",
    read: true,
    attachments: [],
  },
  {
    id: 7,
    sender_id: 1,
    sender_type: "faculty",
    sender_name: "Dr. Ahmed Khan",
    sender_email: "ahmed.khan@edusync.com",
    recipient_id: 1,
    recipient_type: "student",
    subject: "Office Hours Cancellation - Next Week",
    content:
      "Dear Students,\n\nI regret to inform you that I need to cancel my regular office hours next Monday (January 31st) due to a faculty meeting.\n\nIf you need assistance before our next class, please email me to schedule an alternative time to meet.\n\nThank you for your understanding.\n\nBest regards,\nDr. Ahmed Khan",
    sent_at: "2024-01-27T17:20:00Z",
    read: true,
    attachments: [],
  },
  {
    id: 8,
    sender_id: 4,
    sender_type: "admin",
    sender_name: "IT Services",
    sender_email: "it.services@edusync.com",
    recipient_id: 1,
    recipient_type: "student",
    subject: "Scheduled Maintenance - Student Portal",
    content:
      "Dear Student,\n\nThe student portal will be undergoing scheduled maintenance this weekend, from Saturday 8:00 PM to Sunday 2:00 AM.\n\nDuring this time, the portal will be unavailable. Please plan accordingly if you have assignments or other tasks that require portal access.\n\nWe appreciate your patience as we work to improve our systems.\n\nIT Services Team",
    sent_at: "2024-01-28T13:10:00Z",
    read: false,
    attachments: [],
  },
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
  {
    id: 2,
    sender_id: 1,
    sender_type: "student",
    recipient_id: 2,
    recipient_type: "faculty",
    recipient_name: "Prof. Sarah Ali",
    recipient_email: "sarah.ali@edusync.com",
    subject: "Database Project Group Meeting",
    content:
      "Hello Professor Ali,\n\nI've connected with my group members for the database project, and we're planning to meet this Friday at 3:00 PM in the library study room.\n\nWe've started reviewing the requirements and have some initial ideas for our project topic. Would it be possible to schedule a brief meeting with you next week to discuss our approach?\n\nThank you,\nJohn Doe",
    sent_at: "2024-01-21T14:30:00Z",
    attachments: [],
  },
  {
    id: 3,
    sender_id: 1,
    sender_type: "student",
    recipient_id: 3,
    recipient_type: "faculty",
    recipient_name: "Dr. Imran Malik",
    recipient_email: "imran.malik@edusync.com",
    subject: "Web Development Project Proposal",
    content:
      "Dear Dr. Malik,\n\nThank you for sharing the additional resources on responsive design. They've been very helpful for my project.\n\nI've attached my project proposal for the web development course. I'm planning to create a responsive dashboard for a student management system using React and Tailwind CSS.\n\nI would appreciate your feedback on the scope and approach.\n\nBest regards,\nJohn Doe",
    sent_at: "2024-01-24T11:15:00Z",
    attachments: ["Project_Proposal.pdf"],
  },
  {
    id: 4,
    sender_id: 1,
    sender_type: "student",
    recipient_id: 1,
    recipient_type: "faculty",
    recipient_name: "Dr. Ahmed Khan",
    recipient_email: "ahmed.khan@edusync.com",
    subject: "Request for Reference Letter",
    content:
      "Dear Dr. Khan,\n\nI hope this email finds you well. I am applying for a summer internship at TechInnovate Inc., and they require a letter of recommendation from a faculty member.\n\nGiven your expertise in the field and your familiarity with my academic work, I would be grateful if you could provide a reference letter for me. The deadline for submission is February 20th.\n\nI've attached my resume and the internship details for your reference.\n\nThank you for considering my request.\n\nSincerely,\nJohn Doe",
    sent_at: "2024-01-26T16:00:00Z",
    attachments: ["Resume.pdf", "Internship_Details.pdf"],
  },
  {
    id: 5,
    sender_id: 1,
    sender_type: "student",
    recipient_id: 3,
    recipient_type: "faculty",
    recipient_name: "Dr. Imran Malik",
    recipient_email: "imran.malik@edusync.com",
    subject: "Absence Notification - Web Development Class",
    content:
      "Dear Dr. Malik,\n\nI regret to inform you that I will be unable to attend the Web Development class this Friday (February 2nd) due to a medical appointment that I cannot reschedule.\n\nI will make sure to catch up on the material and complete any assignments. If there will be any in-class activities or group work, please let me know so I can coordinate with my classmates.\n\nThank you for your understanding.\n\nBest regards,\nJohn Doe",
    sent_at: "2024-01-29T10:30:00Z",
    attachments: [],
  },
]

// Faculty leave requests
export const mockLeaveRequests = [
  {
    id: 1,
    faculty_id: 1,
    start_date: "2024-03-10T00:00:00Z",
    end_date: "2024-03-15T00:00:00Z",
    reason: "Medical leave for scheduled surgery",
    status: "Approved",
    submitted_at: "2024-02-15T10:30:00Z",
    approved_by: "Dr. Faisal Mahmood",
    approved_at: "2024-02-18T14:20:00Z",
    comments: "Approved. Please ensure your classes are covered by the substitute faculty.",
  },
  {
    id: 2,
    faculty_id: 1,
    start_date: "2024-04-05T00:00:00Z",
    end_date: "2024-04-07T00:00:00Z",
    reason: "Attending International Conference on Computer Science Education",
    status: "Pending",
    submitted_at: "2024-03-01T09:15:00Z",
    approved_by: null,
    approved_at: null,
    comments: null,
  },
  {
    id: 3,
    faculty_id: 1,
    start_date: "2024-02-01T00:00:00Z",
    end_date: "2024-02-02T00:00:00Z",
    reason: "Personal emergency",
    status: "Completed",
    submitted_at: "2024-01-30T16:45:00Z",
    approved_by: "Dr. Faisal Mahmood",
    approved_at: "2024-01-31T10:10:00Z",
    comments: "Approved on short notice due to emergency circumstances.",
  },
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
  {
    id: 2,
    studentId: 1,
    invoiceNumber: "INV-2023-001",
    amount: 1500.0,
    issueDate: "2023-01-01T00:00:00Z",
    dueDate: "2023-01-10T00:00:00Z",
    status: "Paid",
    description: "Spring Semester Tuition Fee",
    semester: "Spring 2023",
    academicYear: "2022",
  },
  {
    id: 3,
    studentId: 1,
    invoiceNumber: "INV-2023-002",
    amount: 1500.0,
    issueDate: "2023-09-01T00:00:00Z",
    dueDate: "2023-09-10T00:00:00Z",
    status: "Paid",
    description: "Fall Semester Tuition Fee",
    semester: "Fall 2023",
    academicYear: "2023",
  },
  {
    id: 4,
    studentId: 1,
    invoiceNumber: "INV-2024-001",
    amount: 1500.0,
    issueDate: "2024-01-01T00:00:00Z",
    dueDate: "2024-01-10T00:00:00Z",
    status: "Paid",
    description: "Spring Semester Tuition Fee",
    semester: "Spring 2024",
    academicYear: "2023",
  },
  {
    id: 5,
    studentId: 1,
    invoiceNumber: "INV-2024-002",
    amount: 500.0,
    issueDate: "2024-02-01T00:00:00Z",
    dueDate: "2024-02-10T00:00:00Z",
    status: "Unpaid",
    description: "Laboratory Fee",
    semester: "Spring 2024",
    academicYear: "2023",
  },
  {
    id: 6,
    studentId: 1,
    invoiceNumber: "INV-2024-003",
    amount: 300.0,
    issueDate: "2024-03-01T00:00:00Z",
    dueDate: "2024-03-10T00:00:00Z",
    status: "Partial",
    description: "Library and IT Services Fee",
    semester: "Spring 2024",
    academicYear: "2023",
  },
  {
    id: 7,
    studentId: 1,
    invoiceNumber: "INV-2024-004",
    amount: 1800.0,
    issueDate: "2024-09-01T00:00:00Z",
    dueDate: "2024-09-10T00:00:00Z",
    status: "Unpaid",
    description: "Fall Semester Tuition Fee",
    semester: "Fall 2024",
    academicYear: "2024",
  },
  // Different student
  {
    id: 8,
    studentId: 2,
    invoiceNumber: "INV-2024-005",
    amount: 1500.0,
    issueDate: "2024-01-01T00:00:00Z",
    dueDate: "2024-01-10T00:00:00Z",
    status: "Paid",
    description: "Spring Semester Tuition Fee",
    semester: "Spring 2024",
    academicYear: "2023",
  },
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

export const getUpcomingEvents = () => {
  const today = new Date()

  return mockEvents
    .filter((event) => new Date(event.event_date) > today)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .map((event) => ({
      ...event,
      date: new Date(event.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date(event.event_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }))
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
