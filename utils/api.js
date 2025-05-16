// API utility functions that will work with mock data now and real API calls later
import {
  mockCurrentStudent,
  getTodayClasses,
  getAttendanceByCourseSummary,
  getUpcomingEvents as mockEvents,
  mockCourses,
  mockFaculty,
  mockSchedules,
  mockEnrollments,
  mockAttendance,
  mockInvoices,
} from './mockData.js';



// Function to get current student info
export async function getCurrentStudent() {
  // In the future, this will be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCurrentStudent);
    }, 500); // Simulate network delay
  });
}

// Function to get today's classes
export async function getTodayClassSchedule() {
  // In the future, this will be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getTodayClasses());
    }, 700); // Simulate network delay
  });
}

// Function to get full class schedule
export async function getClassSchedule() {
  // In the future, this will be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSchedules);
    }, 800); // Simulate network delay
  });
}

// Function to get attendance summary by course
export async function getAttendanceSummary() {
  // In the future, this will be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getAttendanceByCourseSummary());
    }, 800); // Simulate network delay
  });
}

// Function to get detailed attendance records for a specific course
export async function getCourseAttendanceDetails(courseId) {
  // In the future, this will be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get base attendance records from mock data
      let attendanceRecords = mockAttendance
        .filter(
          (record) =>
            record.courseId === courseId &&
            record.studentId === mockCurrentStudent.id
        )
        .map((record) => ({
          id: record.id,
          date: record.date,
          status: record.status,
          courseId: record.courseId,
        }));

      // Add additional hardcoded records for demonstration
      // These will show up for any course that is clicked
      const today = new Date();
      const additionalRecords = [
        {
          id: 1001,
          date: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 2
          ).toISOString(),
          status: 'Present',
          courseId: courseId,
        },
        {
          id: 1002,
          date: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 4
          ).toISOString(),
          status: 'Late',
          courseId: courseId,
        },
        {
          id: 1003,
          date: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 6
          ).toISOString(),
          status: 'Absent',
          courseId: courseId,
        },
        {
          id: 1004,
          date: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 8
          ).toISOString(),
          status: 'Present',
          courseId: courseId,
        },
        {
          id: 1005,
          date: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 10
          ).toISOString(),
          status: 'Present',
          courseId: courseId,
        },
      ];

      // Combine existing and additional records
      attendanceRecords = [...attendanceRecords, ...additionalRecords];

      resolve(attendanceRecords);
    }, 1000); // Simulate network delay
  });
}

// Function to get student invoices
export async function getStudentInvoices() {
  // In the future, this will be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter invoices for the current student
      const studentInvoices = mockInvoices.filter(
        (invoice) => invoice.studentId === mockCurrentStudent.id
      );
      resolve(studentInvoices);
    }, 800); // Simulate network delay
  });
}

// Function to get upcoming events
export async function getUpcomingEventsList() {
  // In the future, this will be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getUpcomingEvents());
    }, 600); // Simulate network delay
  });
}

export const getUpcomingEvents = () => {
  const today = new Date();

  return mockEvents()
    .filter((event) => new Date(event.event_date) > today)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .map((event) => {
      const eventDate = new Date(event.event_date);
      return {
        ...event,
        date: eventDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        time: eventDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        formattedDate: eventDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };
    });
};

// Function to get student profile data
export async function getStudentProfile() {
  // In the future, this will be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get enrolled courses with details
      const enrolledCourseIds = mockEnrollments
        .filter((e) => e.studentId === mockCurrentStudent.id)
        .map((e) => e.courseId);

      const enrolledCourses = enrolledCourseIds.map((courseId) => {
        const course = mockCourses.find((c) => c.id === courseId);

        // Get course schedule
        const courseSchedules = mockSchedules
          .filter(
            (s) =>
              s.courseId === courseId &&
              s.classId === mockCurrentStudent.classId &&
              s.sectionId === mockCurrentStudent.sectionId
          )
          .map((s) => s.day_of_week);

        // Get course faculty
        const facultyId = mockSchedules.find(
          (s) => s.courseId === courseId
        )?.facultyId;
        const faculty =
          mockFaculty.find((f) => f.id === facultyId)?.name || 'Unknown';

        return {
          id: course.id,
          name: course.name,
          code: course.course_code,
          creditHours: course.credit_hours,
          schedule: courseSchedules,
          faculty: faculty,
        };
      });

      // Create profile object
      const profile = {
        ...mockCurrentStudent,
        enrollmentDate: 'September 1, 2022',
        expectedGraduation: 'May 15, 2026',
        enrolledCourses,
        paymentStatus: 'Partial',
        invoiceNumber: 'INV-2024-001',
        feeAmount: '1,500.00',
        feeDueDate: 'February 28, 2024',
      };

      resolve(profile);
    }, 1000); // Simulate network delay
  });
}
