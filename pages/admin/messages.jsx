import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiMail, FiSend, FiTrash2, FiUser, FiFilter, FiPlus } from 'react-icons/fi';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import Layout from '../../components/Layout';

import { getMessages, getUsers, sendMessage, deleteMessage } from '../../utils/adminApi';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    filter: 'all', // 'all', 'inbox', 'sent'
  });

  // Form state for composing a message
  const [composeData, setComposeData] = useState({
    receiver_type: 'student',
    receiver_id: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch users for the compose form
        const studentsData = await getUsers({ role: 'student' });
        setStudents(studentsData);
        
        const facultyData = await getUsers({ role: 'faculty' });
        setFaculty(facultyData);
        
        // Fetch messages
        await fetchMessages();
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // Convert filters to query parameters
      const queryParams = { ...filters };
      
      const messagesData = await getMessages(queryParams);
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMessages();
  }, [filters]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const handleDeleteMessage = async (message) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(message.id);
        // Refresh the messages list
        fetchMessages();
      } catch (error) {
        console.error('Failed to delete message:', error);
        alert('Failed to delete message. Please try again.');
      }
    }
  };
  
  const handleComposeSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await sendMessage(composeData);
      
      // Reset form and refresh messages
      setShowComposeForm(false);
      setComposeData({
        receiver_type: 'student',
        receiver_id: '',
        subject: '',
        message: '',
      });
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };
  
  const handleComposeChange = (e) => {
    const { name, value } = e.target;
    setComposeData(prev => ({ ...prev, [name]: value }));
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Define columns for the data table
  const columns = [
    { 
      key: 'sender', 
      label: 'From',
      render: (row) => row.sender_name
    },
    { 
      key: 'receiver', 
      label: 'To',
      render: (row) => row.receiver_name
    },
    { 
      key: 'title', 
      label: 'Subject',
      render: (row) => row.title
    },
    { 
      key: 'content', 
      label: 'Message',
      render: (row) => (
        <div className="truncate max-w-xs">{row.content}</div>
      )
    },
    { 
      key: 'sent_at', 
      label: 'Date',
      render: (row) => formatDate(row.sent_at)
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleDeleteMessage(row)}
          className="p-1 text-red-600 hover:text-red-900"
          title="Delete Message"
        >
          <FiTrash2 className="h-5 w-5" />
        </button>
      )
    },
  ];
  
  // Generate filter options
  const filterOptions = [
    { 
      key: 'filter', 
      label: 'Filter By', 
      type: 'select', 
      options: [
        { value: 'all', label: 'All Messages' },
        { value: 'inbox', label: 'Inbox' },
        { value: 'sent', label: 'Sent' },
      ]
    },
  ];

  return (
    <>
      <Layout title="Messages">
    
      <Head>
        <title>Message Center | EduSync</title>
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Message Center</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowComposeForm(true)}
              className="btn btn-primary flex items-center"
            >
              <FiPlus className="mr-2" />
              Compose
            </button>
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          filters={filterOptions}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Compose Message Form */}
        {showComposeForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Compose New Message</h2>
            <form onSubmit={handleComposeSubmit}>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700">Recipient Type</label>
                    <select
                      name="receiver_type"
                      value={composeData.receiver_type}
                      onChange={handleComposeChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                    </select>
                  </div>
                  <div className="w-full md:w-2/3">
                    <label className="block text-sm font-medium text-gray-700">Recipient</label>
                    <select
                      name="receiver_id"
                      value={composeData.receiver_id}
                      onChange={handleComposeChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Select a recipient</option>
                      {composeData.receiver_type === 'student' ? (
                        students.map(student => (
                          <option key={student.id} value={student.id}>
                            {student.name}
                          </option>
                        ))
                      ) : (
                        faculty.map(member => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={composeData.subject}
                    onChange={handleComposeChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="message"
                    value={composeData.message}
                    onChange={handleComposeChange}
                    rows="4"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowComposeForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiSend className="inline-block mr-2 h-4 w-4" />
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Messages Data Table */}
        <DataTable
          columns={columns}
          data={messages}
          searchable={true}
          pagination={true}
          itemsPerPage={10}
          actionColumn={false}
        />
      </div>
      </Layout> 
    </>
  );
}