"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { Calendar, Clock, MapPin, Users, ChevronRight, ChevronLeft, Loader2, BookOpen } from "lucide-react"
import FacultySidebar from "../../components/FacultySidebar"
import { getClassSchedule } from "../../utils/api"

export default function FacultyClassSchedule() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentDay, setCurrentDay] = useState(new Date().getDay() || 7) // 0 is Sunday, 1 is Monday, etc.
  const [viewMode, setViewMode] = useState("day") // 'day' or 'week'

  // Map day number to day name
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Get current day name
  const getCurrentDayName = () => {
    return dayNames[currentDay === 7 ? 0 : currentDay]
  }

  // Navigate to previous day
  const prevDay = () => {
    setCurrentDay((prev) => (prev === 1 ? 7 : prev - 1))
  }

  // Navigate to next day
  const nextDay = () => {
    setCurrentDay((prev) => (prev === 7 ? 1 : prev + 1))
  }

  // Toggle view mode between day and week
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "day" ? "week" : "day"))
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const scheduleData = await getClassSchedule()
        setSchedule(scheduleData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching schedule:", err)
        setError("Failed to load class schedule")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get classes for a specific day
  const getClassesForDay = (dayName) => {
    return schedule
      .filter((cls) => cls.day_of_week === dayName)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  }

  // Format time (e.g., "09:00:00" to "9:00 AM")
  const formatTime = (time) => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  // Render day view
  const renderDayView = () => {
    const dayName = getCurrentDayName()
    const classes = getClassesForDay(dayName)

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">
            <span className="text-blue-600">{dayName}</span> Schedule
          </h2>
          <div className="flex items-center space-x-2">
            <button onClick={prevDay} className="p-1 rounded-full hover:bg-gray-100" aria-label="Previous day">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button onClick={nextDay} className="p-1 rounded-full hover:bg-gray-100" aria-label="Next day">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={toggleViewMode}
              className="ml-2 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              Week View
            </button>
          </div>
        </div>

        <div className="p-4">
          {classes.length > 0 ? (
            <div className="space-y-4">
              {classes.map((cls, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-blue-100 text-blue-600 mr-3">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-md font-medium text-gray-800">{cls.course}</h3>
                        <p className="text-sm text-gray-500">{cls.course_code}</p>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 sm:mt-0">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600">
                        {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-gray-600">{cls.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-gray-600">
                        {cls.classId}-{cls.sectionId}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <a
                      href={`/faculty/attendance?classId=${cls.id}`}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      Take Attendance
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No classes scheduled for {dayName}.</p>
              <p className="text-sm text-gray-400 mt-1">Enjoy your free time!</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render week view
  const renderWeekView = () => {
    // Get all weekdays
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">Weekly Schedule</h2>
          <button
            onClick={toggleViewMode}
            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
          >
            Day View
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-6">
            {weekdays.map((day) => {
              const classes = getClassesForDay(day)
              return (
                <div key={day} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="text-md font-medium text-gray-700 mb-3">{day}</h3>
                  {classes.length > 0 ? (
                    <div className="space-y-3">
                      {classes.map((cls, index) => (
                        <div key={index} className="flex items-start p-2 bg-gray-50 rounded-md">
                          <div className="flex-shrink-0 w-16 text-center mr-3">
                            <div className="text-sm font-medium text-gray-800">
                              {formatTime(cls.start_time).split(" ")[0]}
                            </div>
                            <div className="text-xs text-gray-500">{formatTime(cls.start_time).split(" ")[1]}</div>
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{cls.course}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {cls.course_code} • {cls.location}
                            </p>
                            <div className="mt-1">
                              <a
                                href={`/faculty/attendance?classId=${cls.id}`}
                                className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                              >
                                Take Attendance
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No classes</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Class Schedule | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <FacultySidebar activePage="class-schedule" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Class Schedule</h1>

          {loading ? (
            <div className="flex justify-center items-center py-16 bg-white rounded-lg shadow">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 bg-white rounded-lg shadow">{error}</div>
          ) : viewMode === "day" ? (
            renderDayView()
          ) : (
            renderWeekView()
          )}
        </main>
      </div>
    </div>
  )
}
