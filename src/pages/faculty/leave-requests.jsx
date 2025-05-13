"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { Calendar, Clock, FileText, Loader2, Plus } from "lucide-react"
import FacultySidebar from "../../components/FacultySidebar"
import { getFacultyLeaveRequests } from "../../utils/api"

export default function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const [newRequest, setNewRequest] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    async function fetchLeaveRequests() {
      try {
        const data = await getFacultyLeaveRequests()
        setLeaveRequests(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching leave requests:", err)
        setError("Failed to load leave requests")
        setLoading(false)
      }
    }

    fetchLeaveRequests()
  }, [])

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewRequest((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Create a new leave request object
      const newLeaveRequest = {
        id: leaveRequests.length + 1,
        faculty_id: 1, // Current faculty ID
        start_date: new Date(newRequest.startDate).toISOString(),
        end_date: new Date(newRequest.endDate).toISOString(),
        reason: newRequest.reason,
        status: "Pending",
        submitted_at: new Date().toISOString(),
        approved_by: null,
        approved_at: null,
        comments: null,
      }

      // Add to the list
      setLeaveRequests((prev) => [newLeaveRequest, ...prev])

      // Reset form
      setNewRequest({
        startDate: "",
        endDate: "",
        reason: "",
      })

      setIsSubmitting(false)
      setSubmitSuccess(true)
      setShowNewRequestForm(false)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Leave Requests | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <FacultySidebar activePage="leave-requests" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Leave Requests</h1>
            <button
              onClick={() => setShowNewRequestForm(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </button>
          </div>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              Your leave request has been submitted successfully!
            </div>
          )}

          {showNewRequestForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">New Leave Request</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={newRequest.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={newRequest.endDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Leave
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={newRequest.reason}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide details about your leave request..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewRequestForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 inline animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-16 bg-white rounded-lg shadow">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 bg-white rounded-lg shadow">{error}</div>
          ) : leaveRequests.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date Range
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Reason
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {formatDate(request.start_date)} - {formatDate(request.end_date)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 line-clamp-2">{request.reason}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{formatDate(request.submitted_at)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">No Leave Requests</h3>
              <p className="text-gray-500">You haven't submitted any leave requests yet.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
