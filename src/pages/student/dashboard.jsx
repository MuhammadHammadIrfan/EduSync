"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { Calendar, Clock, CheckSquare, CalendarDays, Loader2 } from "lucide-react"
import StudentSidebar from "../../components/StudentSidebar"
import {
  getCurrentStudent,
  getTodayClassSchedule,
  getAttendanceSummary,
  getUpcomingEventsList,
  getClassSchedule,
} from "../../utils/api"

export default function StudentDashboard() {
  const [student, setStudent] = useState(null)
  const [todaysClasses, setTodaysClasses] = useState([])
  const [courseAttendance, setCourseAttendance] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState({
    student: true,
    classes: true,
    attendance: true,
    events: true,
  })
  const [error, setError] = useState({
    student: null,
    classes: null,
    attendance: null,
    events: null,
  })
  const [schedule, setSchedule] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const studentData = await getCurrentStudent()
        setStudent(studentData)
        setLoading((prev) => ({ ...prev, student: false }))
      } catch (err) {
        setError((prev) => ({ ...prev, student: "Failed to load student data" }))
        setLoading((prev) => ({ ...prev, student: false }))
      }

      try {
        const classesData = await getTodayClassSchedule()
        setTodaysClasses(classesData)
        setLoading((prev) => ({ ...prev, classes: false }))
      } catch (err) {
        setError((prev) => ({ ...prev, classes: "Failed to load class schedule" }))
        setLoading((prev) => ({ ...prev, classes: false }))
      }

      try {
        const attendanceData = await getAttendanceSummary()
        setCourseAttendance(attendanceData)
        setLoading((prev) => ({ ...prev, attendance: false }))
      } catch (err) {
        setError((prev) => ({ ...prev, attendance: "Failed to load attendance data" }))
        setLoading((prev) => ({ ...prev, attendance: false }))
      }

      try {
        const eventsData = await getUpcomingEventsList()
        setUpcomingEvents(eventsData)
        setLoading((prev) => ({ ...prev, events: false }))
      } catch (err) {
        setError((prev) => ({ ...prev, events: "Failed to load events" }))
        setLoading((prev) => ({ ...prev, events: false }))
      }

      try {
        const scheduleData = await getClassSchedule()
        setSchedule(scheduleData)
      } catch (err) {
        console.error("Error fetching schedule:", err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Student Dashboard | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <StudentSidebar activePage="dashboard" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-5xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-6">
            {loading.student ? (
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            ) : error.student ? (
              <div className="text-red-500">{error.student}</div>
            ) : (
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Welcome, {student?.name}!</h1>
            )}
          </div>

          {/* Today's Classes */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">Today's Classes</h2>
            </div>
            <div className="p-4">
              {loading.classes ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : error.classes ? (
                <div className="text-center py-6 text-red-500">{error.classes}</div>
              ) : todaysClasses.length > 0 ? (
                <div className="space-y-4">
                  {todaysClasses.map((cls) => (
                    <div key={cls.id} className="flex flex-col md:flex-row items-start p-3 rounded-lg bg-gray-50">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mb-2 md:mb-0 md:mr-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="w-full md:w-auto">
                        <p className="text-sm font-medium text-gray-900">{cls.course}</p>
                        <p className="text-xs text-gray-500">Code: {cls.course_code}</p>
                        <p className="text-xs text-gray-500">Professor: {cls.faculty}</p>
                        <p className="text-xs text-gray-500">Location: {cls.location}</p>
                        <p className="text-xs text-gray-500">
                          Time: {cls.start_time} - {cls.end_time}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Schedule:{" "}
                          {Array.from(
                            new Set(
                              schedule.filter((s) => s.course_code === cls.course_code).map((s) => s.day_of_week),
                            ),
                          ).join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No classes scheduled for today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Course Attendance */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <CheckSquare className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">Course Attendance</h2>
            </div>
            <div className="p-4">
              {loading.attendance ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : error.attendance ? (
                <div className="text-center py-6 text-red-500">{error.attendance}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courseAttendance.map((course) => (
                    <div key={course.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">{course.name}</h3>
                          <p className="text-xs text-gray-500">{course.code}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-800">{course.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            course.percentage >= 85
                              ? "bg-green-600"
                              : course.percentage >= 75
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${course.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Attended {course.attended} out of {course.total} classes
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <CalendarDays className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">Upcoming Events</h2>
            </div>
            <div className="p-4">
              {loading.events ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : error.events ? (
                <div className="text-center py-6 text-red-500">{error.events}</div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex flex-col md:flex-row items-start p-3 rounded-lg bg-gray-50">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mb-2 md:mb-0 md:mr-3">
                        <CalendarDays className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{event.title}</p>
                          {event.category && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {event.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {event.date} • {event.time}
                        </p>
                        <p className="text-xs text-gray-500">Location: {event.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                        {event.is_mandatory && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Mandatory
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <a
                      href="/student/events"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View all events
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
