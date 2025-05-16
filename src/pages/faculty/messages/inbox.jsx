import { requireRole } from "@/lib/requireRole";
import { useState, useEffect } from "react";
import { Inbox, Search, Loader2, Mail, AlertCircle, X, ChevronRight } from "lucide-react";
import FacultySidebar from "../../../components/FacultySidebar";
import { getReceivedMessages } from "../../../../utils/api/faculty";
import Head from "next/head";
import Link from "next/link";

export async function getServerSideProps(context) {
  return requireRole(context, "faculty");
}

export default function FacultyInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [leaveRequestFilter, setLeaveRequestFilter] = useState(false);

  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true);
        const receivedMessages = await getReceivedMessages();
        setMessages(receivedMessages || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  // Filter messages based on search and leave request filter
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      searchQuery === "" ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender_name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesLeaveFilter = !leaveRequestFilter || 
      (message.subject.toLowerCase().includes("leave request") || 
       (message.leaveRequest !== null));
       
    return matchesSearch && matchesLeaveFilter;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Inbox | Faculty Portal</title>
      </Head>

      <FacultySidebar activePage="messages" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Inbox</h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-grow">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={leaveRequestFilter}
                    onChange={() => setLeaveRequestFilter(!leaveRequestFilter)}
                    className="sr-only"
                  />
                  <div className={`relative w-10 h-5 rounded-full transition-colors ${leaveRequestFilter ? 'bg-blue-600' : 'bg-gray-200'}`}>
                    <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform transform ${leaveRequestFilter ? 'translate-x-5' : ''}`}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700">Leave requests only</span>
                </label>
              </div>
            </div>

            <div className="flex h-[calc(100vh-240px)]">
              <div className={`w-full md:w-2/5 ${selectedMessage ? 'hidden md:block' : 'block'} border-r border-gray-200 overflow-y-auto`}>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center h-32 px-4">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-500">{error}</span>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
                    <Inbox className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No messages found</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredMessages.map((message) => (
                      <li
                        key={message.id}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          selectedMessage?.id === message.id ? "bg-blue-50" : ""
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="px-4 py-3">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm font-medium ${!message.read ? "text-gray-900" : "text-gray-700"}`}>
                              {message.sender_name}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(message.sent_at)}</p>
                          </div>
                          <p className={`text-sm ${!message.read ? "font-medium text-gray-900" : "text-gray-700"}`}>{message.subject}</p>
                          <p className="text-xs text-gray-500 truncate">{message.content.replace(/\n/g, " ")}</p>
                          
                          {/* Leave Request Status Badge if applicable */}
                          {message.leaveRequest && (
                            <span className={`inline-flex mt-1 items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                              message.leaveRequest.status === 'Approved' 
                                ? 'bg-green-100 text-green-800' 
                                : message.leaveRequest.status === 'Rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {message.leaveRequest.status}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={`w-full md:w-3/5 ${selectedMessage ? 'block' : 'hidden md:block'} overflow-y-auto bg-white`}>
                {selectedMessage ? (
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="md:hidden text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <div className="flex-1 md:flex md:justify-between md:items-center">
                        <h2 className="text-lg font-medium">{selectedMessage.subject}</h2>
                        <p className="text-sm text-gray-500">{new Date(selectedMessage.sent_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-6 border-b border-gray-200 pb-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <span className="font-medium text-sm">
                          {selectedMessage.sender_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{selectedMessage.sender_name}</p>
                        <p className="text-xs text-gray-500">{selectedMessage.sender_email}</p>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none">
                      {selectedMessage.content.split('\n').map((paragraph, i) => (
                        paragraph.trim() === "" ? <br key={i} /> : <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                    
                    {/* Leave Request Details Section */}
                    {selectedMessage.leaveRequest && (
                      <div className="mt-6 border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Leave Request Details</h3>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">Status</p>
                              <p className={`font-medium ${
                                selectedMessage.leaveRequest.status === 'Approved' 
                                  ? 'text-green-700' 
                                  : selectedMessage.leaveRequest.status === 'Rejected'
                                    ? 'text-red-700'
                                    : 'text-yellow-700'
                              }`}>{selectedMessage.leaveRequest.status}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Date</p>
                              <p className="font-medium">
                                {new Date(selectedMessage.leaveRequest.leaveDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Course</p>
                              <p className="font-medium">
                                {selectedMessage.leaveRequest.course?.course_code || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Course Name</p>
                              <p className="font-medium">
                                {selectedMessage.leaveRequest.course?.name || 'N/A'}
                              </p>
                            </div>
                          </div>
                          
                          {/* View full details link */}
                          <Link
                            href="/faculty/leaveRequests"
                            className="flex items-center justify-end text-blue-600 text-sm font-medium mt-2 hover:text-blue-800"
                          >
                            View all leave requests <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Mail className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500">Select a message to view</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}