// Mock API functions for the EduSync application

// Get current student data
export async function getCurrentStudent() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "John Doe",
        email: "john.doe@student.edusync.com",
        department: "Computer Science",
        class: "CS2022",
        section: "A",
        studentId: "CS2022-001",
        enrollmentDate: "2022-09-01",
        enrolledCourses: [
          {
            id: 1,
            name: "Data Structures and Algorithms",
            code: "CS201",
            creditHours: 3,
            schedule: ["Mon 9:00 AM - 10:30 AM", "Wed 11:00 AM - 12:30 PM"],
            faculty: "Dr. Ahmed Khan",
          },
          {
            id: 2,
            name: "Database Systems",
            code: "CS301",
            creditHours: 3,
            schedule: ["Mon 11:00 AM - 12:30 PM", "Thu 9:00 AM - 10:30 AM"],
            faculty: "Prof. Sarah Ali",
          },
          {
            id: 3,
            name: "Web Development",
            code: "CS401",
            creditHours: 3,
            schedule: ["Tue 9:00 AM - 10:30 AM", "Fri 9:00 AM - 10:30 AM"],
            faculty: "Dr. Imran Malik",
          },
          {
            id: 4,
            name: "Artificial Intelligence",
            code: "CS501",
            creditHours: 3,
            schedule: ["Wed 9:00 AM - 10:30 AM"],
            faculty: "Dr. Ahmed Khan",
          },
        ],
      })
    }, 500)
  })
}

// Get current faculty data
export async function getCurrentFaculty() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "Dr. Ahmed Khan",
        email: "ahmed.khan@faculty.edusync.com",
        department: "Computer Science",
        facultyId: "FAC-CS-001",
        position: "Associate Professor",
        joinDate: "2018-08-15",
        specialization: "Artificial Intelligence and Algorithms",
        education: "PhD in Computer Science, Stanford University",
        bio: "Dr. Ahmed Khan is an Associate Professor with over 10 years of teaching experience. His research focuses on artificial intelligence and algorithm optimization.",
      })
    }, 500)
  })
}

// Get faculty statistics
export async function getFacultyStats() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalStudents: 120,
        totalClasses: 4,
        totalSections: 3,
        totalCourses: 2,
        averageAttendance: 85,
        upcomingAssignments: 3,
        pendingGrades: 2,
      })
    }, 600)
  })
}

// Get faculty class sections with student counts
export async function getFacultyClassSections() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          course_name: "Data Structures and Algorithms",
          course_code: "CS201",
          class_name: "CS2022",
          section_name: "A",
          student_count: 35,
          department: "Computer Science",
        },
        {
          id: 2,
          course_name: "Data Structures and Algorithms",
          course_code: "CS201",
          class_name: "CS2022",
          section_name: "B",
          student_count: 32,
          department: "Computer Science",
        },
        {
          id: 3,
          course_name: "Artificial Intelligence",
          course_code: "CS501",
          class_name: "CS2022",
          section_name: "A",
          student_count: 28,
          department: "Computer Science",
        },
        {
          id: 4,
          course_name: "Artificial Intelligence",
          course_code: "CS501",
          class_name: "CS2023",
          section_name: "A",
          student_count: 25,
          department: "Computer Science",
        },
      ])
    }, 700)
  })
}

// Get faculty today's classes
export async function getFacultyTodayClassesSchedule() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          course: "Data Structures and Algorithms",
          course_code: "CS201",
          class_name: "CS2022",
          section_name: "A",
          student_count: 35,
          start_time: "09:00",
          end_time: "10:30",
          location: "CS-101",
          department: "Computer Science",
        },
        {
          id: 2,
          course: "Artificial Intelligence",
          course_code: "CS501",
          class_name: "CS2022",
          section_name: "A",
          student_count: 28,
          start_time: "11:00",
          end_time: "12:30",
          location: "CS-102",
          department: "Computer Science",
        },
        {
          id: 3,
          course: "Data Structures and Algorithms",
          course_code: "CS201",
          class_name: "CS2022",
          section_name: "B",
          student_count: 32,
          start_time: "14:00",
          end_time: "15:30",
          location: "CS-103",
          department: "Computer Science",
        },
      ])
    }, 400)
  })
}

// Get class schedule
export async function getClassSchedule() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          course: "Data Structures and Algorithms",
          course_code: "CS201",
          faculty: "Dr. Ahmed Khan",
          classId: "CS2022",
          sectionId: "A",
          day_of_week: "Monday",
          start_time: "09:00:00",
          end_time: "10:30:00",
          location: "CS-101",
        },
        {
          id: 2,
          course: "Database Systems",
          course_code: "CS301",
          faculty: "Prof. Sarah Ali",
          classId: "CS2022",
          sectionId: "A",
          day_of_week: "Monday",
          start_time: "11:00:00",
          end_time: "12:30:00",
          location: "CS-101",
        },
        {
          id: 3,
          course: "Web Development",
          course_code: "CS401",
          faculty: "Dr. Imran Malik",
          classId: "CS2022",
          sectionId: "A",
          day_of_week: "Tuesday",
          start_time: "09:00:00",
          end_time: "10:30:00",
          location: "CS-101",
        },
        {
          id: 4,
          course: "Artificial Intelligence",
          course_code: "CS501",
          faculty: "Dr. Ahmed Khan",
          classId: "CS2022",
          sectionId: "A",
          day_of_week: "Wednesday",
          start_time: "09:00:00",
          end_time: "10:30:00",
          location: "CS-101",
        },
        {
          id: 5,
          course: "Data Structures and Algorithms",
          course_code: "CS201",
          faculty: "Dr. Ahmed Khan",
          classId: "CS2022",
          sectionId: "A",
          day_of_week: "Wednesday",
          start_time: "11:00:00",
          end_time: "12:30:00",
          location: "CS-101",
        },
        {
          id: 6,
          course: "Database Systems",
          course_code: "CS301",
          faculty: "Prof. Sarah Ali",
          classId: "CS2022",
          sectionId: "A",
          day_of_week: "Thursday",
          start_time: "09:00:00",
          end_time: "10:30:00",
          location: "CS-101",
        },
        {
          id: 7,
          course: "Web Development",
          course_code: "CS401",
          faculty: "Dr. Imran Malik",
          classId: "CS2022",
          sectionId: "A",
          day_of_week: "Friday",
          start_time: "09:00:00",
          end_time: "10:30:00",
          location: "CS-101",
        },
      ])
    }, 700)
  })
}

// Get attendance summary
export async function getAttendanceSummary() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Data Structures and Algorithms",
          code: "CS201",
          attended: 8,
          total: 10,
          percentage: 80,
        },
        {
          id: 2,
          name: "Database Systems",
          code: "CS301",
          attended: 7,
          total: 9,
          percentage: 78,
        },
        {
          id: 3,
          name: "Web Development",
          code: "CS401",
          attended: 8,
          total: 9,
          percentage: 89,
        },
        {
          id: 4,
          name: "Artificial Intelligence",
          code: "CS501",
          attended: 4,
          total: 5,
          percentage: 80,
        },
      ])
    }, 600)
  })
}

// Get course attendance details
export async function getCourseAttendanceDetails(courseId) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, studentId: 1, courseId: courseId, date: "2024-01-01", status: "Present" },
        { id: 2, studentId: 1, courseId: courseId, date: "2024-01-03", status: "Present" },
        { id: 3, studentId: 1, courseId: courseId, date: "2024-01-08", status: "Present" },
        { id: 4, studentId: 1, courseId: courseId, date: "2024-01-10", status: "Absent" },
        { id: 5, studentId: 1, courseId: courseId, date: "2024-01-15", status: "Present" },
      ])
    }, 500)
  })
}

// Get today's class schedule
export async function getTodayClassSchedule() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          course: "Data Structures and Algorithms",
          course_code: "CS201",
          faculty: "Dr. Ahmed Khan",
          location: "CS-101",
          start_time: "09:00",
          end_time: "10:30",
        },
        {
          id: 2,
          course: "Database Systems",
          course_code: "CS301",
          faculty: "Prof. Sarah Ali",
          location: "CS-101",
          start_time: "11:00",
          end_time: "12:30",
        },
      ])
    }, 400)
  })
}

// Get student invoices
export async function getStudentInvoices() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          invoiceNumber: "INV-2023-001",
          amount: 1500.0,
          issueDate: "2023-09-01T00:00:00Z",
          dueDate: "2023-09-15T00:00:00Z",
          status: "Paid",
          description: "Fall Semester Tuition Fee",
          semester: "Fall 2023",
          academicYear: "2023",
        },
        {
          id: 2,
          invoiceNumber: "INV-2024-001",
          amount: 1600.0,
          issueDate: "2024-01-05T00:00:00Z",
          dueDate: "2024-01-20T00:00:00Z",
          status: "Unpaid",
          description: "Spring Semester Tuition Fee",
          semester: "Spring 2024",
          academicYear: "2024",
        },
      ])
    }, 500)
  })
}

// Get student profile
export async function getStudentProfile() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "John Doe",
        studentId: "2020-0001",
        email: "john.doe@example.com",
        department: "Computer Science",
        class: "CS2022",
        section: "A",
        enrollmentDate: "2020-09-01",
        enrolledCourses: [
          {
            id: 1,
            name: "Data Structures and Algorithms",
            code: "CS201",
            creditHours: 3,
            schedule: ["Mon 9:00 AM - 10:30 AM", "Wed 11:00 AM - 12:30 PM"],
            faculty: "Dr. Ahmed Khan",
          },
          {
            id: 2,
            name: "Database Systems",
            code: "CS301",
            creditHours: 3,
            schedule: ["Mon 11:00 AM - 12:30 PM", "Thu 9:00 AM - 10:30 AM"],
            faculty: "Prof. Sarah Ali",
          },
        ],
      })
    }, 600)
  })
}

// Get upcoming events
export async function getUpcomingEventsList() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Faculty Meeting",
          date: "May 15",
          time: "10:00 AM",
          location: "Conference Room A",
          is_mandatory: true,
          description: "Monthly faculty meeting to discuss department updates and upcoming events.",
        },
        {
          id: 2,
          title: "Research Symposium",
          date: "May 20",
          time: "2:00 PM",
          location: "Main Auditorium",
          is_mandatory: false,
          description: "Annual research symposium featuring presentations from faculty and graduate students.",
        },
        {
          id: 3,
          title: "Curriculum Committee",
          date: "May 25",
          time: "11:00 AM",
          location: "Meeting Room B",
          is_mandatory: true,
          description: "Curriculum committee meeting to review and approve course changes for the upcoming semester.",
        },
        {
          id: 4,
          title: "Department Retreat",
          date: "Jun 5",
          time: "9:00 AM",
          location: "Riverside Resort",
          is_mandatory: true,
          description: "Annual department retreat for team building and strategic planning.",
        },
      ])
    }, 500)
  })
}

// Get received messages
export async function getReceivedMessages() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          sender_id: 2,
          sender_type: "faculty",
          sender_name: "Dr. Jane Smith",
          sender_email: "jane.smith@example.com",
          recipient_id: 1,
          recipient_type: "student",
          subject: "Assignment 1 Feedback",
          content: "Your assignment 1 looks good. Please improve...",
          sent_at: "2024-01-20T10:00:00Z",
          read: false,
          attachments: [],
        },
        {
          id: 2,
          sender_id: 3,
          sender_type: "admin",
          sender_name: "Admin User",
          sender_email: "admin@example.com",
          recipient_id: 1,
          recipient_type: "student",
          subject: "Important Announcement",
          content: "Please note the change in schedule...",
          sent_at: "2024-01-22T14:00:00Z",
          read: true,
          attachments: [],
        },
      ])
    }, 400)
  })
}

// Get sent messages
export async function getSentMessages() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 3,
          recipient_id: 2,
          recipient_type: "faculty",
          recipient_name: "Dr. Jane Smith",
          recipient_email: "jane.smith@example.com",
          sender_id: 1,
          sender_type: "student",
          subject: "Question about Assignment 2",
          content: "I have a question about assignment 2...",
          sent_at: "2024-01-25T10:00:00Z",
          attachments: [],
        },
        {
          id: 4,
          recipient_id: 3,
          recipient_type: "admin",
          recipient_name: "Admin User",
          recipient_email: "admin@example.com",
          sender_id: 1,
          sender_type: "student",
          subject: "Request for Information",
          content: "I am requesting information about...",
          sent_at: "2024-01-26T14:00:00Z",
          attachments: [],
        },
      ])
    }, 300)
  })
}

// Get faculty leave requests
export async function getFacultyLeaveRequests() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const leaveRequests = [
        {
          id: 1,
          faculty_id: 1,
          start_date: "2024-02-15T00:00:00Z",
          end_date: "2024-02-17T00:00:00Z",
          reason: "Personal emergency",
          status: "Approved",
          submitted_at: "2024-02-01T10:30:00Z",
          approved_by: "Dr. Zainab Qureshi",
          approved_at: "2024-02-02T14:15:00Z",
          comments: "Approved. Please arrange for substitute classes.",
          department: "Computer Science",
          class: "CS2022",
          section: "A",
        },
        {
          id: 2,
          faculty_id: 1,
          start_date: "2024-03-10T00:00:00Z",
          end_date: "2024-03-12T00:00:00Z",
          reason: "Conference attendance - International Conference on Computer Science Education",
          status: "Pending",
          submitted_at: "2024-02-20T09:45:00Z",
          approved_by: null,
          approved_at: null,
          comments: null,
          department: "Computer Science",
          class: "CS2022",
          section: "B",
        },
        {
          id: 3,
          faculty_id: 1,
          start_date: "2024-01-05T00:00:00Z",
          end_date: "2024-01-07T00:00:00Z",
          reason: "Medical leave",
          status: "Completed",
          submitted_at: "2023-12-28T11:20:00Z",
          approved_by: "Dr. Zainab Qureshi",
          approved_at: "2023-12-29T10:00:00Z",
          comments: "Approved. Get well soon.",
          department: "Computer Science",
          class: "CS2023",
          section: "A",
        },
      ]
      resolve(leaveRequests)
    }, 800)
  })
}
