import { requireRole } from "@/lib/requireRole"
import { useState, useEffect } from "react"
import { Calendar, Clock, FileText, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import FacultySidebar from "../../components/FacultySidebar"
import Head from "next/head"
import { 
  getAdvisedSectionsLeaveRequests,
  updateLeaveRequestStatus
} from "../../../utils/api/faculty"

export async function getServerSideProps(context) {
  return requireRole(context, "faculty")
}

export default function ApproveLeaves() {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [comments, setComments] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [actionType, setActionType] = useState(null) // 'approve' or 'reject'
  const [actionSuccess, setActionSuccess] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAdvisedSectionsLeaveRequests();
        setLeaveRequests(data || []);
      } catch (error) {
        console.error("Error fetching leave requests to approve:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAction = async (status) => {
    try {
      if (!selectedRequest) return;
      
      setActionLoading(true);
      setError(null);
      
      await updateLeaveRequestStatus(selectedRequest.id, status, comments);
      
      // Update the leave request in the list
      setLeaveRequests(prev => prev.map(request => 
        request.id === selectedRequest.id 
          ? { ...request, status, can_update: false }
          : request
      ));
      
      setActionSuccess(`Leave request ${status.toLowerCase()} successfully`);
      setTimeout(() => {
        setShowModal(false);
        setSelectedRequest(null);
        setComments("");
        setActionType(null);
        setActionSuccess(null);
      }, 2000);
    } catch (error) {
      console.error(`Error ${actionType === 'approve' ? 'approving' : 'rejecting'} leave request:`, error);
      setError(`Failed to ${actionType} leave request. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setComments("");
    setError(null);
    setActionSuccess(null);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Approve Leave Requests | Faculty Portal</title>
      </Head>
      
      <FacultySidebar activePage="approveLeaves" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Approve Leave Requests</h1>
            <p className="text-gray-600">Manage leave requests for sections where you are the advisor</p>
          </div>

          {loading ? (
            <div className="flex flex-col space-y-4">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
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
                        Faculty
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Leave Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Course
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
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.faculty_name}</div>
                          <div className="text-sm text-gray-500">{request.faculty_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <div className="text-sm font-medium text-gray-900">{formatDate(request.leave_date)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{request.course_code}</div>
                          <div className="text-xs text-gray-500">{request.class} - {request.section}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                          {request.can_update ? (
                            <div className="space-x-2">
                              <button
                                onClick={() => openModal(request, 'approve')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openModal(request, 'reject')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">No action needed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No leave requests to approve</h3>
              <p className="text-gray-500">There are currently no pending leave requests for your sections.</p>
            </div>
          )}
        </main>
      </div>

      {/* Approval/Rejection Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request
              </h3>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  You are about to <span className={actionType === 'approve' ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {actionType}
                  </span> the leave request from <span className="font-medium">{selectedRequest.faculty_name}</span> for <span className="font-medium">{formatDate(selectedRequest.leave_date)}</span>.
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                  Comments (optional)
                </label>
                <textarea
                  id="comments"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Add any comments regarding this ${actionType === 'approve' ? 'approval' : 'rejection'}...`}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
              
              {error && (
                <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                  {error}
                </div>
              )}
              
              {actionSuccess && (
                <div className="mb-4 p-2 bg-green-50 text-green-700 text-sm rounded border border-green-200">
                  {actionSuccess}
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => setShowModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md text-sm font-medium text-white focus:outline-none ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                onClick={() => handleAction(actionType === 'approve' ? 'Approved' : 'Rejected')}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                    {actionType === 'approve' ? 'Approving...' : 'Rejecting...'}
                  </>
                ) : (
                  actionType === 'approve' ? 'Approve' : 'Reject'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}