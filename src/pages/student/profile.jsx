import { requireRole } from "@/lib/requireRole"
import { useState, useEffect } from "react"
import Head from "next/head"
import { User, Mail, GraduationCap, Users, Calendar, CreditCard, Clock, Loader2 } from "lucide-react"
import StudentSidebar from "../../components/studentSiderbar"
import { getStudentProfile } from "../../../utils/api"

export async function getServerSideProps(context) {
    return requireRole(context, "student")
}

export default function StudentProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getStudentProfile()
        setProfile(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Failed to load profile data")
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <StudentSidebar activePage="profile" />
        <div className="flex-1">
          <main className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <StudentSidebar activePage="profile" />
        <div className="flex-1">
          <main className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Student Profile | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <StudentSidebar activePage="profile" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">My Profile</h1>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-16"></div>

            <div className="p-4 md:p-6">
              {/* Student Name and Basic Info */}
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{profile.name}</h2>
                <p className="text-gray-600">
                  {profile.department} • {profile.class} • Section {profile.section}
                </p>
              </div>

              {/* Main Profile Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Student ID</p>
                        <p className="text-sm font-medium">{profile.studentId}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="text-sm font-medium">{profile.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="text-sm font-medium">{profile.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Class & Section</p>
                        <p className="text-sm font-medium">
                          {profile.class} - Section {profile.section}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Enrollment Date</p>
                        <p className="text-sm font-medium">{profile.enrollmentDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Payment Status</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-sm font-medium">Current Semester Fee</span>
                        </div>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            profile.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-800"
                              : profile.paymentStatus === "Partial"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {profile.paymentStatus}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Invoice #: {profile.invoiceNumber}</p>
                        <p>Amount: ${profile.feeAmount}</p>
                        <p>Due Date: {profile.feeDueDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Academic Information</h3>

                  {/* Current Semester Courses */}
                  <h4 className="text-md font-medium text-gray-800 mb-3">Current Semester Courses</h4>
                  <div className="space-y-3">
                    {profile.enrolledCourses.map((course) => (
                      <div key={course.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-sm font-medium text-gray-800">{course.name}</h5>
                            <p className="text-xs text-gray-500">{course.code}</p>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {course.creditHours} Credits
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center text-xs text-gray-600">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{course.schedule.join(", ")}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            <User className="h-3.5 w-3.5 mr-1" />
                            <span>Prof. {course.faculty}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}