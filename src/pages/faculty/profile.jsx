"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { User, Mail, GraduationCap, Phone, MapPin, Clock, BookOpen, Loader2 } from "lucide-react"
import FacultySidebar from "../../components/FacultySidebar"
import { getCurrentFaculty } from "../../utils/api"

export default function FacultyProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getCurrentFaculty()
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
        <FacultySidebar activePage="profile" />
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
        <FacultySidebar activePage="profile" />
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
        <title>Faculty Profile | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <FacultySidebar activePage="profile" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">My Profile</h1>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-16"></div>

            <div className="p-4 md:p-6">
              {/* Faculty Name and Basic Info */}
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{profile.name}</h2>
                <p className="text-gray-600">
                  {profile.designation} • {profile.department}
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
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-sm font-medium">{profile.name}</p>
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
                      <Phone className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-sm font-medium">{profile.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Office Location</p>
                        <p className="text-sm font-medium">{profile.office_location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Academic Information</h3>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Specialization</p>
                        <p className="text-sm font-medium">{profile.specialization}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Office Hours</p>
                        <p className="text-sm font-medium">{profile.office_hours}</p>
                      </div>
                    </div>
                  </div>

                  {/* Edit Profile Button */}
                  <div className="mt-6">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Edit Profile
                    </button>
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
