"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { Users, BookOpen, Calendar, Clock, ArrowRight, Layers, GraduationCap } from "lucide-react"
import FacultySidebar from "../../components/FacultySidebar"
import {
  getCurrentFaculty,
  getFacultyStats,
  getFacultyTodayClassesSchedule,
  getUpcomingEventsList,
} from "../../utils/api"

export default function FacultyDashboard() {
  const [faculty, setFaculty] = useState(null)
  const [stats, setStats] = useState(null)
  const [todayClasses, setTodayClasses] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [facultyData, statsData, classesData, eventsData] = await Promise.all([
          getCurrentFaculty(),
          getFacultyStats(),
          getFacultyTodayClassesSchedule(),
          getUpcomingEventsList(),
        ])

        setFaculty(facultyData)
        setStats(statsData)
        setTodayClasses(classesData)
        setUpcomingEvents(eventsData.slice(0, 3)) // Only show first 3 events
        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format time from 24h to 12h format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Faculty Dashboard | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <FacultySidebar activePage="dashboard" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col space-y-4">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mt-6"></div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              {/* Welcome Section */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Welcome back, {faculty?.name.split(" ")[0]}!
                </h1>
                <p className="text-gray-600 mt-1">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <Layers className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Classes</p>
                      <h3 className="text-2xl font-bold text-gray-800">{stats?.totalClasses || 0}</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">Teaching {stats?.totalClasses || 0} classes this semester</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Sections</p>
                      <h3 className="text-2xl font-bold text-gray-800">{stats?.totalSections || 0}</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">Managing {stats?.totalSections || 0} different sections</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Courses</p>
                      <h3 className="text-2xl font-bold text-gray-800">{stats?.totalCourses || 0}</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">Teaching {stats?.totalCourses || 0} unique courses</p>
                  </div>
                </div>
              </div>

              {/* Today's Classes */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Today's Classes
                  </h2>
                  <Link
                    href="/faculty/class-schedule"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    View Schedule <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {todayClasses.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {todayClasses.map((classItem) => (
                        <div key={classItem.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                                <BookOpen className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800">{classItem.course}</h3>
                                <p className="text-sm text-gray-500">{classItem.course_code}</p>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <Users className="h-3.5 w-3.5 mr-1" />
                                  <span>
                                    {classItem.class_name} {classItem.section_name} ({classItem.student_count} students)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center">
                              <div className="flex items-center text-sm text-gray-600 mr-4">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="px-2 py-1 rounded-md bg-gray-100">{classItem.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Link
                              href={`/faculty/attendance?classId=${classItem.id}`}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              Take Attendance
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No classes scheduled for today</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                      Student Statistics
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Total Students</span>
                        <span className="text-sm font-medium text-gray-800">{stats?.totalStudents || 0}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Average Attendance</span>
                        <span className="text-sm font-medium text-gray-800">{stats?.averageAttendance || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${stats?.averageAttendance || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Upcoming Events
                      </h3>
                      <Link
                        href="/faculty/events"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                  {upcomingEvents.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-10 text-center">
                              <p className="text-sm font-bold text-blue-600">{event.date.split(" ")[1]}</p>
                              <p className="text-xs text-gray-500">{event.date.split(" ")[0]}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{event.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {event.time} • {event.location}
                              </p>
                              {event.is_mandatory && (
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                                  Mandatory
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No upcoming events</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
