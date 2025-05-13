// API utility functions that will work with mock data now and real API calls later
import {
  mockCurrentStudent,
  mockCurrentFaculty,
  getTodayClasses,
  getFacultyTodayClasses, // ✅ Added this missing import
  getAttendanceByCourseSummary,
  mockCourses,
  mockFaculty,
  mockSchedules,
  mockEnrollments,
  mockAttendance,
  mockInvoices,
  mockReceivedMessages,
  mockSentMessages,
  mockFacultyStats,
  mockLeaveRequests,
  getUpcomingEventsFormatted,
} from "./mockData"

// Function to get current student info
export async function getCurrentStudent() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCurrentStudent)
    }, 500)
  })
}

// Function to get current faculty info
export async function getCurrentFaculty() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCurrentFaculty)
    }, 500)
  })
}

// Function to get faculty statistics
export async function getFacultyStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFacultyStats)
    }, 700)
  })
}

// Function to get today's classes for students
export async function getTodayClassSchedule() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getTodayClasses())
    }, 700)
  })
}

// ✅ Corrected: Function to get today's classes for faculty
export async function getFacultyTodayClasses() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getFacultyTodayClasses()) // Uses imported mock function
    }, 700)
  })
}

// Function to get full class schedule
export async function getClassSchedule() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSchedules)
    }, 800)
  })
}

// Function to get attendance summary by course
export async function getAttendanceSummary() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getAttendanceByCourseSummary())
    }, 800)
  })
}

// Function to get detailed attendance records for a specific course
export async function getCourseAttendanceDetails(courseId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let attendanceRecords = mockAttendance
        .filter((record) => record.courseId === courseId && record.studentId === mockCurrentStudent.id)
        .map((record) => ({
          id: record.id,
          date: record.date,
          status: record.status,
          courseId: record.courseId,
        }))

      const today = new Date()
      const additionalRecords = [
        {
          id: 1001,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString(),
          status: "Present",
          courseId: courseId,
        },
        {
          id: 1002,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4).toISOString(),
          status: "Late",
          courseId: courseId,
        },
        {
          id: 1003,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString(),
          status: "Absent",
          courseId: courseId,
        },
        {
          id: 1004,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8).toISOString(),
          status: "Present",
          courseId: courseId,
        },
        {
          id: 1005,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10).toISOString(),
          status: "Present",
          courseId: courseId,
        },
      ]

      attendanceRecords = [...attendanceRecords, ...additionalRecords]

      resolve(attendanceRecords)
    }, 1000)
  })
}

// Function to get student invoices
export async function getStudentInvoices() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const studentInvoices = mockInvoices.filter((invoice) => invoice.studentId === mockCurrentStudent.id)
      resolve(studentInvoices)
    }, 800)
  })
}

// Function to get upcoming events
export async function getUpcomingEventsList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getUpcomingEventsFormatted())
    }, 600)
  })
}

// Function to get student profile data
export async function getStudentProfile() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const enrolledCourseIds = mockEnrollments
        .filter((e) => e.studentId === mockCurrentStudent.id)
        .map((e) => e.courseId)

      const enrolledCourses = enrolledCourseIds.map((courseId) => {
        const course = mockCourses.find((c) => c.id === courseId)

        const courseSchedules = mockSchedules
          .filter(
            (s) =>
              s.courseId === courseId &&
              s.classId === mockCurrentStudent.classId &&
              s.sectionId === mockCurrentStudent.sectionId,
          )
          .map((s) => s.day_of_week)

        const facultyId = mockSchedules.find((s) => s.courseId === courseId)?.facultyId
        const faculty = mockFaculty.find((f) => f.id === facultyId)?.name || "Unknown"

        return {
          id: course.id,
          name: course.name,
          code: course.course_code,
          creditHours: course.credit_hours,
          schedule: courseSchedules,
          faculty: faculty,
        }
      })

      const profile = {
        ...mockCurrentStudent,
        enrollmentDate: "September 1, 2022",
        expectedGraduation: "May 15, 2026",
        enrolledCourses,
      }

      resolve(profile)
    }, 1000)
  })
}

// Function to get received messages
export async function getReceivedMessages() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const studentMessages = mockReceivedMessages.filter(
        (message) => message.recipient_id === mockCurrentStudent.id && message.recipient_type === "student",
      )
      resolve(studentMessages)
    }, 800)
  })
}

// Function to get sent messages
export async function getSentMessages() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const studentMessages = mockSentMessages.filter(
        (message) => message.sender_id === mockCurrentStudent.id && message.sender_type === "student",
      )
      resolve(studentMessages)
    }, 800)
  })
}

// Function to get faculty leave requests
export async function getFacultyLeaveRequests() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const facultyLeaveRequests = mockLeaveRequests.filter((request) => request.faculty_id === mockCurrentFaculty.id)
      resolve(facultyLeaveRequests)
    }, 800)
  })
}
