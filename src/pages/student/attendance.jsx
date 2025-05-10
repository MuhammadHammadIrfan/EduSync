"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { CheckSquare, X, Clock, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import StudentSidebar from "../../components/StudentSidebar"
import { getAttendanceSummary, getCourseAttendanceDetails } from "../../utils/api"

export default function Attendance() {
  const [courseAttendance, setCourseAttendance] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [attendanceDetails, setAttendanceDetails] = useState([])
  const [loading, setLoading] = useState({
    summary: true,
    details: false,
  })
  const [error, setError] = useState({
    summary: null,
    details: null,
  })

  useEffect(() => {
    async function fetchAttendanceSummary() {
      try {
        const data = await getAttendanceSummary()
        setCourseAttendance(data)
        setLoading((prev) => ({ ...prev, summary: false }))
      } catch (err) {
        console.error("Error fetching attendance summary:", err)
        setError((prev) => ({ ...prev, summary: "Failed to load attendance data" }))
        setLoading((prev) => ({ ...prev, summary: false }))
      }
    }

    fetchAttendanceSummary()
  }, [])

  const handleCourseSelect = async (course) => {
    if (selectedCourse && selectedCourse.id === course.id) {
      // If clicking the same course, toggle it off
      setSelectedCourse(null)
      setAttendanceDetails([])
      return
    }

    setSelectedCourse(course)
    setLoading((prev) => ({ ...prev, details: true }))
    setError((prev) => ({ ...prev, details: null }))

    try {
      const details = await getCourseAttendanceDetails(course.id)
      setAttendanceDetails(details)
      setLoading((prev) => ({ ...prev, details: false }))
    } catch (err) {
      console.error("Error fetching attendance details:", err)
      setError((prev) => ({ ...prev, details: "Failed to load attendance details" }))
      setLoading((prev) => ({ ...prev, details: false }))
    }
  }

  // Group attendance records by month
  const groupAttendanceByMonth = (records) => {
    const grouped = {}

    records.forEach((record) => {
      const date = new Date(record.date)
      const monthYear = date.toLocaleString("default", { month: "long", year: "numeric" })

      if (!grouped[monthYear]) {
        grouped[monthYear] = []
      }

      grouped[monthYear].push(record)
    })

    // Sort records within each month by date
    Object.keys(grouped).forEach((month) => {
      grouped[month].sort((a, b) => new Date(a.date) - new Date(b.date))
    })

    return grouped
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800"
      case "Absent":
        return "bg-red-100 text-red-800"
      case "Late":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return <CheckSquare className="h-4 w-4" />
      case "Absent":
        return <X className="h-4 w-4" />
      case "Late":
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  // Calculate attendance statistics
  const calculateStats = (records) => {
    const total = records.length
    const present = records.filter((r) => r.status === "Present").length
    const absent = records.filter((r) => r.status === "Absent").length
    const late = records.filter((r) => r.status === "Late").length

    const presentPercentage = Math.round((present / total) * 100) || 0
    const absentPercentage = Math.round((absent / total) * 100) || 0
    const latePercentage = Math.round((late / total) * 100) || 0

    return {
      total,
      present,
      absent,
      late,
      presentPercentage,
      absentPercentage,
      latePercentage,
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Attendance | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <StudentSidebar activePage="attendance" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-5xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Attendance</h1>

          {/* Course Attendance Summary */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <CheckSquare className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">Course Attendance Summary</h2>
            </div>
            <div className="p-4">
              {loading.summary ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : error.summary ? (
                <div className="text-center py-6 text-red-500">{error.summary}</div>
              ) : (
                <div className="space-y-4">
                  {courseAttendance.map((course) => (
                    <div
                      key={course.id}
                      className={`bg-gray-50 p-4 rounded-lg cursor-pointer transition-all ${
                        selectedCourse && selectedCourse.id === course.id ? "ring-2 ring-blue-500" : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleCourseSelect(course)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">{course.name}</h3>
                          <p className="text-xs text-gray-500">{course.code}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-800 mr-2">{course.percentage}%</span>
                          {selectedCourse && selectedCourse.id === course.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Course Attendance Details */}
          {selectedCourse && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">
                  Attendance Details: {selectedCourse.name} ({selectedCourse.code})
                </h2>
              </div>
              <div className="p-4">
                {loading.details ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                ) : error.details ? (
                  <div className="text-center py-6 text-red-500">{error.details}</div>
                ) : attendanceDetails.length > 0 ? (
                  <>
                    {/* Attendance Statistics */}
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-700 mb-3">Attendance Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(() => {
                          const stats = calculateStats(attendanceDetails)
                          return (
                            <>
                              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Present</span>
                                  <span className="text-sm font-medium text-green-700">{stats.presentPercentage}%</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{stats.present} classes</p>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                  <div
                                    className="bg-green-600 h-1.5 rounded-full"
                                    style={{ width: `${stats.presentPercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Late</span>
                                  <span className="text-sm font-medium text-yellow-700">{stats.latePercentage}%</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{stats.late} classes</p>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                  <div
                                    className="bg-yellow-500 h-1.5 rounded-full"
                                    style={{ width: `${stats.latePercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Absent</span>
                                  <span className="text-sm font-medium text-red-700">{stats.absentPercentage}%</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{stats.absent} classes</p>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                  <div
                                    className="bg-red-500 h-1.5 rounded-full"
                                    style={{ width: `${stats.absentPercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>

                    {/* Attendance Records */}
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-3">Attendance Records</h3>
                      <div className="space-y-6">
                        {Object.entries(groupAttendanceByMonth(attendanceDetails)).map(([month, records]) => (
                          <div key={month} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 p-3 border-b border-gray-200">
                              <h4 className="text-sm font-medium text-gray-700">{month}</h4>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Date
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Day
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {records.map((record) => {
                                    const date = new Date(record.date)
                                    return (
                                      <tr key={record.id}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                          {date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          })}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                          {date.toLocaleDateString("en-US", { weekday: "long" })}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}
                                          >
                                            {getStatusIcon(record.status)}
                                            <span className="ml-1">{record.status}</span>
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No attendance records found for this course.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
