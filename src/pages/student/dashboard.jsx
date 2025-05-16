import { requireRole } from "@/lib/requireRole"

import { useState, useEffect } from "react"
import Head from "next/head"
import { Calendar, Clock, CheckSquare, CalendarDays, Loader2, AlertTriangle } from "lucide-react"
import StudentSidebar from "../../components/studentSiderbar"
import { getStudentDashboard } from "../../../utils/api/student" 
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export async function getServerSideProps(context) {
  return requireRole(context, "student")
}

export default function StudentDashboard() {
  const [student, setStudent] = useState(null)
  const [todaysClasses, setTodaysClasses] = useState([])
  const [courseAttendance, setCourseAttendance] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
  async function fetchData() {
    try {
      console.log("Fetching dashboard data...");
      const data = await getStudentDashboard();
      
      console.log("Dashboard data received:", data);
      
      if (!data) {
        throw new Error("No data returned from the API");
      }
      
      // Process attendance data to ensure proper formatting
      const processedAttendance = data.courseAttendance?.map(course => ({
        ...course,
        // Ensure percentage is calculated correctly or use API value
        percentage: course.percentage || (course.total > 0 
            ? Math.round((course.attended / course.total) * 100) 
            : 0),
        // Ensure attended and total are numbers
        attended: Number(course.attended) || 0,
        total: Number(course.total) || 0
      })) || [];
      
      setStudent(data.student || null);
      setTodaysClasses(data.todaysClasses || []);
      setCourseAttendance(processedAttendance);
      setUpcomingEvents(data.upcomingEvents || []);
      setSchedule(data.schedule || []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      setError("Something went wrong while loading the dashboard.");
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, []);


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Student Dashboard | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <StudentSidebar activePage="dashboard" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-5xl mx-auto">
          {/* Error handling */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Welcome Section */}
          <div className="mb-6">
            {loading ? (
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            ) : student ? (
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                  Welcome, {student.name}!
                </h1>
                <p className="text-sm text-gray-500">
                  {student.departmentName || 'N/A'} • Class: {student.className || 'N/A'} • Section: {student.sectionName || 'N/A'}
                </p>
              </div>
            ) : (
              <div className="text-gray-800">Welcome to your dashboard</div>
            )}
          </div>

          {/* Today's Classes */}
          <Card className="mb-6">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">Today's Classes</h2>
            </div>
            <CardContent className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : todaysClasses && todaysClasses.length > 0 ? (
                <div className="space-y-4">
                  {todaysClasses.map((cls) => (
                    <div key={`${cls.id}-${cls.time}`} className="flex flex-col md:flex-row items-start p-3 rounded-lg bg-gray-50">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mb-2 md:mb-0 md:mr-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="w-full md:w-auto">
                        <p className="text-sm font-medium text-gray-900">{cls.name}</p>
                        <p className="text-xs text-gray-500">Code: {cls.code}</p>
                        <p className="text-xs text-gray-500">Professor: {cls.facultyName || 'Not assigned'}</p>
                        <p className="text-xs text-gray-500">Location: {cls.room || 'Room not assigned'}</p>
                        <p className="text-xs text-gray-500">
                          Time: {cls.time}
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
            </CardContent>
          </Card>

          {/* Course Attendance */}
          <Card className="mb-6">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <CheckSquare className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">Course Attendance</h2>
            </div>
            <CardContent className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : courseAttendance && courseAttendance.length > 0 ? (
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
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No attendance records available.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <div className="p-4 border-b border-gray-200 flex items-center">
              <CalendarDays className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">Upcoming Events</h2>
            </div>
            <CardContent className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex flex-col md:flex-row items-start p-3 rounded-lg bg-gray-50">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mb-2 md:mb-0 md:mr-3">
                        <CalendarDays className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {event.date} • {event.time}
                        </p>
                        <p className="text-xs text-gray-500">Location: {event.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No upcoming events.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}