import { requireRole } from '@/lib/requireRole';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiCheck, FiX } from 'react-icons/fi';
import { getLeaveRequests, approveLeave, rejectLeave } from '../../../utils/api/admin';
import Layout from '../../components/components/Layout';

export async function getServerSideProps(context) {
  return requireRole(context, "admin");
}

export default function Leaves() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);
  
  // Apply filters when status changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredLeaves(leaveRequests);
    } else {
      setFilteredLeaves(leaveRequests.filter(leave => leave.status === statusFilter));
    }
  }, [statusFilter, leaveRequests]);
  
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const data = await getLeaveRequests();
      setLeaveRequests(data);
      setFilteredLeaves(data);
    } catch (error) {
      console.error('Failed to fetch leave requests:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleApproveLeave = async (leaveId) => {
    if (window.confirm('Are you sure you want to approve this leave request?')) {
      try {
        setLoading(true);
        await approveLeave(leaveId);
        // Refresh the leave request list
        fetchLeaveRequests();
      } catch (error) {
        console.error('Failed to approve leave request:', error);
        alert('Failed to approve leave request. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleRejectLeave = async (leaveId) => {
    if (window.confirm('Are you sure you want to reject this leave request?')) {
      try {
        setLoading(true);
        await rejectLeave(leaveId);
        // Refresh the leave request list
        fetchLeaveRequests();
      } catch (error) {
        console.error('Failed to reject leave request:', error);
        alert('Failed to reject leave request. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Layout title="Leaves">
      <Head>
        <title>Leave Requests | EduSync</title>
      </Head>

      <div className="p-6 bg-gray-100 min-h-screen space-y-6">
        {/* Loading indicator */}
        {loading && (
          <div className="fixed top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-50 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            <p className="text-sm">Loading leaves...</p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Leave Request Management</h1>
        </div>

        {/* Leave Request Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <div className="h-6 w-6 text-yellow-700 flex items-center justify-center font-bold">P</div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-xl font-bold text-gray-800">
                {leaveRequests.filter(leave => leave.status === 'Pending').length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <div className="h-6 w-6 text-green-700 flex items-center justify-center font-bold">A</div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved Requests</p>
              <p className="text-xl font-bold text-gray-800">
                {leaveRequests.filter(leave => leave.status === 'Approved').length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <div className="h-6 w-6 text-red-700 flex items-center justify-center font-bold">R</div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected Requests</p>
              <p className="text-xl font-bold text-gray-800">
                {leaveRequests.filter(leave => leave.status === 'Rejected').length}
              </p>
            </div>
          </div>
        </div>

        {/* Simple Status Filter */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Filter Leave Requests</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-md ${
                statusFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setStatusFilter('Pending')}
              className={`px-4 py-2 rounded-md ${
                statusFilter === 'Pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('Approved')}
              className={`px-4 py-2 rounded-md ${
                statusFilter === 'Approved' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter('Rejected')}
              className={`px-4 py-2 rounded-md ${
                statusFilter === 'Rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {filteredLeaves.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No leave requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class & Section</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {leave.faculty?.name || `Faculty #${leave.facultyId}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {leave.department?.name || `Dept #${leave.departmentId}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(leave.class?.name || '') + (leave.section?.name ? ` - ${leave.section?.name}` : '')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {leave.course?.name || `Course #${leave.courseId}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(leave.leave_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {leave.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          leave.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : leave.status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {leave.status === 'Pending' ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveLeave(leave.id)}
                              className="p-1 bg-green-100 text-green-700 hover:bg-green-200 rounded"
                              title="Approve"
                            >
                              <FiCheck className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleRejectLeave(leave.id)}
                              className="p-1 bg-red-100 text-red-700 hover:bg-red-200 rounded"
                              title="Reject"
                            >
                              <FiX className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            {leave.status === 'Approved' ? 'Approved' : 'Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}