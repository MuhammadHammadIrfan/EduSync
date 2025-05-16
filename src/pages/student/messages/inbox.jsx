import { requireRole } from "@/lib/requireRole";
import { useState, useEffect } from "react";
import { Inbox, Search, Loader2, Mail, AlertCircle, X, Book } from "lucide-react";
import StudentSidebar from "../../../components/studentSiderbar";
import { getReceivedMessages } from "../../../../utils/api/student.js";
import Head from "next/head";

export async function getServerSideProps(context) {
  return requireRole(context, "student");
}

export default function StudentInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCancellationFilter, setShowCancellationFilter] = useState(false);

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

  // Filter messages based on search and class cancellation filter
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      searchQuery === "" ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender_name?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCancellation = !showCancellationFilter || 
      message.subject.toLowerCase().includes("class cancellation") || 
      message.subject.toLowerCase().includes("leave");
       
    return matchesSearch && matchesCancellation;
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
        <title>Inbox | Student Portal</title>
      </Head>

      <StudentSidebar activePage="messages" />

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
                    checked={showCancellationFilter}
                    onChange={() => setShowCancellationFilter(!showCancellationFilter)}
                    className="sr-only"
                  />
                  <div className={`relative w-10 h-5 rounded-full transition-colors ${showCancellationFilter ? 'bg-blue-600' : 'bg-gray-200'}`}>
                    <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform transform ${showCancellationFilter ? 'translate-x-5' : ''}`}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700">Class cancellations only</span>
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
                    {filteredMessages.map((message) => {
                      const isCancellation = message.subject.toLowerCase().includes("class cancellation") || 
                                           message.subject.toLowerCase().includes("leave");
                      
                      return (
                        <li
                          key={message.id}
                          className={`cursor-pointer hover:bg-gray-50 ${
                            selectedMessage?.id === message.id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="px-4 py-3">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-gray-900">
                                {message.sender_name || "System"}
                              </p>
                              <p className="text-xs text-gray-500">{formatDate(message.sent_at)}</p>
                            </div>
                            <div className="flex items-center">
                              {isCancellation && (
                                <span className="mr-2 p-1 rounded-full bg-amber-100">
                                  <Book className="h-3 w-3 text-amber-600" />
                                </span>
                              )}
                              <p className="text-sm font-medium text-gray-900">{message.subject}</p>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{message.content?.replace(/\n/g, " ")}</p>
                          </div>
                        </li>
                      );
                    })}
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
                          {(selectedMessage.sender_name || "System").split(' ').map(n => n[0] || '').join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{selectedMessage.sender_name || "System"}</p>
                        <p className="text-xs text-gray-500">{selectedMessage.sender_email || ""}</p>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none">
                      {selectedMessage.content?.split('\n').map((paragraph, i) => (
                        paragraph.trim() === "" ? <br key={i} /> : <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                    
                    {/* Class Cancellation Notice */}
                    {selectedMessage.subject.toLowerCase().includes("class cancellation") && (
                      <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <p className="text-sm font-medium text-amber-800">
                          ⚠️ This is an official class cancellation notice. Please adjust your schedule accordingly.
                        </p>
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