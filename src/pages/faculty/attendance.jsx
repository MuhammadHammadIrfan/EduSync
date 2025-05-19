"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { CheckSquare, Clock, BookOpen, Users, MapPin, Loader2, Save, ArrowLeft } from "lucide-react"
import FacultySidebar from "../../components/FacultySidebar"
import { getClassSchedule } from "../../utils/api"
export default function FacultyAttendance() {
  const router = useRouter()
  const { classId } = router.query

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [todayClasses, setTodayClasses] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  useEffect(() => {
    async function fetchClasses() {
      try {
        const scheduleData = await getClassSchedule()

        // Get today's day name
        const today = new Date()
        const dayName = today.toLocaleDateString("en-US", { weekday: "long" })

        // Filter classes for today
        const classesForToday = scheduleData.filter((cls) => cls.day_of_week === dayName)
        setTodayClasses(classesForToday)

        // If classId is provided in the URL, select that class
        if (classId && scheduleData.length > 0) {
          const classToSelect = scheduleData.find((cls) => cls.id.toString() === classId)
          if (classToSelect) {
            setSelectedClass(classToSelect)
            // Generate mock student data for the selected class
            generateMockStudentData(classToSelect)
          }
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching classes:", err)
        setError("Failed to load class data")
        setLoading(false)
      }
    }
    if (router.isReady) {
      fetchClasses()
    }
  }, [router.isReady, classId])

  
  const generateMockStudentData = (classItem) => {
    // Create mock student data based on the student_count if available
    const count = classItem.student_count || 30
    const mockStudents = Array.from({length: count}, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      studentId: `${classItem.course_code}-${i + 100}`,
      status: "present", // Default status
    }))

    setAttendanceData(mockStudents)
  }

  // Handle class selection
  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem)
    generateMockStudentData(classItem)

    // Update URL without refreshing the page
    router.push(`/faculty/attendance?classId=${classItem.id}`, undefined, { shallow: true })
  }

  // Handle attendance status change
  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceData((prevData)=>
      prevData.map((student) => (student.id === studentId ? { ...student, status: newStatus } : student)),
    )
  }

  // Handle save attendance
  const handleSaveAttendance = ()=> {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1500)
  }

  // Format time (e.g., "09:00:00" to "9:00 AM")
  const formatTime = (time) => {
    if (!time) return ""
    const [hours, minutes]=time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM":"AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Take Attendance | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <FacultySidebar activePage="attendance" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-6xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Take Attendance</h1>

          {loading ? (
            <div className="flex justify-center items-center py-16 bg-white rounded-lg shadow">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 bg-white rounded-lg shadow">{error}</div>
          ) : (
            <>
              {!selectedClass ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Select a Class</h2>

                  {todayClasses.length > 0 ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 mb-4">Please select a class to take attendance:</p>

                      {todayClasses.map((classItem) => (
                        <div
                          key={classItem.id}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleClassSelect(classItem)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                              <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{classItem.course}</h3>
                              <p className="text-sm text-gray-500">{classItem.course_code}</p>
                              <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  <span>
                                    {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  <span>{classItem.location}</span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-3.5 w-3.5 mr-1" />
                                  <span>{classItem.student_count || 30} students</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No classes scheduled for today.</p>
                      <p className="text-sm text-gray-400 mt-1">Check back on your next teaching day.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Class Info */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center mb-4">
                      <button
                        onClick={() => {
                          setSelectedClass(null)
                          router.push("/faculty/attendance", undefined, { shallow: true })
                        }}
                        className="mr-3 p-1 rounded-full hover:bg-gray-100"
                      >
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                      </button>
                      <h2 className="text-lg font-medium text-gray-800">Attendance for {selectedClass.course}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">{selectedClass.course_code}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          {formatTime(selectedClass.start_time)} - {formatTime(selectedClass.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">{selectedClass.location}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Date:</span>{" "}
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Attendance Form */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">Student Attendance</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSaveAttendance}
                          disabled={isSaving}
                          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Attendance
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {saveSuccess && (
                      <div className="p-3 bg-green-50 border-b border-green-100 text-green-700 text-sm">
                        Attendance saved successfully!
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Student ID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {attendanceData.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.studentId}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {student.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleStatusChange(student.id, "present")}
                                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                                      student.status === "present"
                                        ? "bg-green-100 text-green-800 ring-1 ring-green-600"
                                        : "bg-gray-100 text-gray-800 hover:bg-green-50"
                                    }`}
                                  >
                                    Present
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(student.id, "late")}
                                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                                      student.status === "late"
                                        ? "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600"
                                        : "bg-gray-100 text-gray-800 hover:bg-yellow-50"
                                    }`}
                                  >
                                    Late
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(student.id, "absent")}
                                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                                      student.status === "absent"
                                        ? "bg-red-100 text-red-800 ring-1 ring-red-600"
                                        : "bg-gray-100 text-gray-800 hover:bg-red-50"
                                    }`}
                                  >
                                    Absent
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
