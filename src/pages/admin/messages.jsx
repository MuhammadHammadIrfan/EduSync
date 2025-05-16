import { requireRole } from '@/lib/requireRole';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiMail, FiSend, FiTrash2, FiUser, FiFilter, FiPlus, FiInfo, FiX, FiUsers } from 'react-icons/fi';
import Layout from '../../components/components/Layout';
import { getMessages, sendMessage, deleteMessage, getUsers, getDepartments } from '../../../utils/api/admin';

export async function getServerSideProps(context) {
  return requireRole(context, "admin");
}

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState(null);
  const itemsPerPage = 10;

  // Filter state
  const [messageType, setMessageType] = useState(''); // '' (none selected), 'inbox', 'sent'
  
  // Compose message form state
  const [composeData, setComposeData] = useState({
    receiver_type: 'student',
    receiver_ids: [],
    departmentId: '',
    sendToAllInDept: false,
    subject: '',
    body: ''
  });
  
  // Fetch reference data for the compose form
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [studentsResponse, facultyResponse, departmentsResponse] = await Promise.all([
          getUsers({ role: 'student' }),
          getUsers({ role: 'faculty' }),
          getDepartments()
        ]);
        
        setStudents(studentsResponse || []);
        setFaculty(facultyResponse || []);
        setDepartments(departmentsResponse || []);
      } catch (error) {
        console.error('Error fetching reference data:', error);
        showNotification('Failed to load data. Please refresh the page.', 'error');
      }
    };
    
    fetchReferenceData();
  }, []);
  
  // Filter students and faculty by department
  const filteredRecipients = () => {
    if (!composeData.departmentId) {
      return composeData.receiver_type === 'student' ? students : faculty;
    }
    
    const deptId = parseInt(composeData.departmentId, 10);
    
    if (composeData.receiver_type === 'student') {
      return students.filter(student => student.departmentId === deptId);
    } else {
      return faculty.filter(faculty => faculty.departmentId === deptId);
    }
  };
  
  // Reset page when message type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [messageType]);
  
  // Fetch messages when page changes or message type changes
  useEffect(() => {
    if (messageType) {
      fetchMessages();
    } else {
      setMessages([]);
      setTotalPages(1);
    }
  }, [messageType, currentPage]);
  
  const fetchMessages = async () => {
    if (!messageType) return;
    
    try {
      setLoading(true);
      const response = await getMessages({ 
        filter: messageType,
        page: currentPage,
        limit: itemsPerPage
      });
      
      setMessages(response.data || []);
      setTotalPages(Math.ceil(response.total / itemsPerPage) || 1);
    } catch (error) {
      console.error('Error fetching messages:', error);
      showNotification('Failed to load messages. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        setLoading(true);
        await deleteMessage(messageId);
        showNotification('Message deleted successfully!', 'success');
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
        showNotification('Failed to delete message. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (composeData.sendToAllInDept) {
      if (!composeData.departmentId) {
        showNotification('Please select a department for mass messaging.', 'error');
        return;
      }
    } else if (composeData.receiver_ids.length === 0) {
      showNotification('Please select at least one recipient.', 'error');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare data for API call
      const dataToSend = {
        ...composeData,
        departmentId: composeData.departmentId ? parseInt(composeData.departmentId, 10) : undefined
      };
      
      await sendMessage(dataToSend);
      
      showNotification('Message sent successfully!', 'success');
      setShowComposeForm(false);
      resetComposeForm();
      
      // If currently viewing sent messages, refresh the list
      if (messageType === 'sent') {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleComposeDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setComposeData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Reset recipient IDs when changing recipient type
    if (name === 'receiver_type' || name === 'departmentId') {
      setComposeData(prev => ({ ...prev, receiver_ids: [] }));
    }
  };
  
  const handleRecipientSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
    setComposeData(prev => ({ ...prev, receiver_ids: selectedOptions }));
  };
  
  const resetComposeForm = () => {
    setComposeData({
      receiver_type: 'student',
      receiver_ids: [],
      departmentId: '',
      sendToAllInDept: false,
      subject: '',
      body: ''
    });
  };
  
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };
  
  const toggleComposeForm = () => {
    setShowComposeForm(!showComposeForm);
    if (!showComposeForm) {
      resetComposeForm();
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Layout title="Messages">
      <Head>
        <title>Message Center | EduSync</title>
      </Head>

      <div className="p-6 bg-gray-100 min-h-screen space-y-6">
        {/* Loading indicator */}
        {loading && (
          <div className="fixed top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-50 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            <p className="text-sm">Loading Messages...</p>
          </div>
        )}
        
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-md ${
            notification.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
            notification.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
            'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiInfo className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm">{notification.message}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Message Center</h1>
          <button 
            onClick={toggleComposeForm}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-md shadow hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center"
          >
            {showComposeForm ? <FiX className="mr-2" /> : <FiPlus className="mr-2" />}
            {showComposeForm ? 'Cancel Compose' : 'Compose New Message'}
          </button>
        </div>

        {/* Message Type Selector */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Select Message Type</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setMessageType('inbox')}
              className={`px-4 py-2 rounded-md flex items-center ${
                messageType === 'inbox' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <FiMail className="mr-2" />
              Inbox
            </button>
            <button
              onClick={() => setMessageType('sent')}
              className={`px-4 py-2 rounded-md flex items-center ${
                messageType === 'sent' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <FiSend className="mr-2" />
              Sent
            </button>
          </div>
        </div>
        
        {/* Inline Compose Message Form */}
        {showComposeForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-800">Compose New Message</h2>
              <button 
                onClick={toggleComposeForm}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendMessage}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Type</label>
                    <select
                      name="receiver_type"
                      value={composeData.receiver_type}
                      onChange={handleComposeDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="both">Both Students & Faculty</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      name="departmentId"
                      value={composeData.departmentId}
                      onChange={handleComposeDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="sendToAllInDept"
                      name="sendToAllInDept"
                      checked={composeData.sendToAllInDept}
                      onChange={handleComposeDataChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sendToAllInDept" className="ml-2 block text-sm text-gray-700">
                      Send to all {composeData.receiver_type === 'both' ? 'users' : 
                      composeData.receiver_type === 'student' ? 'students' : 'faculty'} in selected department
                    </label>
                  </div>
                  
                  {!composeData.sendToAllInDept && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Recipients 
                        {composeData.departmentId && <span className="text-sm text-gray-500 ml-1">
                          ({departments.find(d => d.id === parseInt(composeData.departmentId))?.name || 'Department'})
                        </span>}
                      </label>
                      <select
                        multiple
                        size="6"
                        name="recipients"
                        onChange={handleRecipientSelection}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {composeData.receiver_type !== 'faculty' && filteredRecipients()
                          .filter(user => user.role === 'student')
                          .map(student => (
                            <option key={`student-${student.id}`} value={student.id}>
                              {student.name} ({student.email})
                            </option>
                          ))
                        }
                        {composeData.receiver_type !== 'student' && filteredRecipients()
                          .filter(user => user.role === 'faculty')
                          .map(teacher => (
                            <option key={`faculty-${teacher.id}`} value={teacher.id}>
                              {teacher.name} ({teacher.email})
                            </option>
                          ))
                        }
                      </select>
                      <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd key to select multiple recipients</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {composeData.receiver_ids.length} recipients
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={composeData.subject}
                      onChange={handleComposeDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter message subject"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      name="body"
                      value={composeData.body}
                      onChange={handleComposeDataChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="8"
                      placeholder="Type your message here..."
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={toggleComposeForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors"
                  disabled={loading}
                >
                  <FiSend className="mr-2" />
                  Send Message
                  {composeData.sendToAllInDept && <FiUsers className="ml-1" />}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Messages Display */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {!messageType ? (
            <div className="p-8 text-center">
              <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Select Message Type</h3>
              <p className="mt-1 text-gray-500">
                Please select either Inbox or Sent to view your messages.
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center">
              <FiMail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Messages</h3>
              <p className="mt-1 text-gray-500">
                {messageType === 'inbox' 
                  ? "You haven't received any messages yet." 
                  : "You haven't sent any messages yet."}
              </p>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {messageType === 'inbox' ? 'From' : 'To'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map(message => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <FiUser className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {messageType === 'inbox' ? message.sender_name : message.receiver_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {messageType === 'inbox' ? message.sender_type : message.receiver_type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {message.department_name || 'All Departments'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {message.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {message.body}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(message.sent_at)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button 
                          onClick={() => handleDeleteMessage(message.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === i + 1
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}