"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { Inbox, User, Clock, Star, StarOff, Trash2, Mail, AlertCircle, Loader2 } from "lucide-react"
import StudentSidebar from "../../../components/StudentSidebar"
import { getReceivedMessages } from "../../../utils/api"

export default function MessagesInbox() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [starredMessages, setStarredMessages] = useState([])

  useEffect(() => {
    async function fetchMessages() {
      try {
        const messagesData = await getReceivedMessages()
        setMessages(messagesData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching messages:", err)
        setError("Failed to load messages")
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const toggleStarred = (messageId) => {
    if (starredMessages.includes(messageId)) {
      setStarredMessages(starredMessages.filter((id) => id !== messageId))
    } else {
      setStarredMessages([...starredMessages, messageId])
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()

    // If the message is from today, show the time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    }

    // If the message is from this year, show the month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    // Otherwise, show the full date
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const getSenderIcon = (senderType) => {
    switch (senderType) {
      case "faculty":
        return <User className="h-4 w-4 text-blue-500" />
      case "admin":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Mail className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Messages Inbox | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <StudentSidebar activePage="messages-received" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-6xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Messages Inbox</h1>

          {loading ? (
            <div className="flex justify-center items-center py-16 bg-white rounded-lg shadow">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 bg-white rounded-lg shadow">{error}</div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div
                className="grid grid-cols-1 md:grid-cols-3"
                style={{ minHeight: "500px", height: "calc(100vh - 200px)", maxHeight: "800px" }}
              >
                {/* Message List */}
                <div className="col-span-1 border-r border-gray-200 overflow-y-auto scrollbar-thin">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-800 flex items-center">
                      <Inbox className="h-5 w-5 text-blue-500 mr-2" />
                      Inbox
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 cursor-pointer transition-colors ${
                            selectedMessage?.id === message.id
                              ? "bg-blue-50"
                              : message.read
                                ? "hover:bg-gray-50"
                                : "bg-blue-50/30 hover:bg-blue-50/50 font-medium"
                          }`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2">
                              <div className="mt-1">{getSenderIcon(message.sender_type)}</div>
                              <div>
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">{message.sender_name}</p>
                                <p className="text-xs text-gray-500">{message.sender_type}</p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">{formatDate(message.sent_at)}</div>
                          </div>
                          <p className="text-sm font-medium text-gray-800 mt-1 line-clamp-1">{message.subject}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{message.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p>Your inbox is empty</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className="col-span-2 flex flex-col h-full">
                  {selectedMessage ? (
                    <>
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-medium text-gray-800 line-clamp-1">{selectedMessage.subject}</h2>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleStarred(selectedMessage.id)}
                              className="p-1 rounded-full hover:bg-gray-200"
                              title={starredMessages.includes(selectedMessage.id) ? "Unstar" : "Star"}
                            >
                              {starredMessages.includes(selectedMessage.id) ? (
                                <Star className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <StarOff className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                            <button className="p-1 rounded-full hover:bg-gray-200" title="Delete">
                              <Trash2 className="h-5 w-5 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        className="p-4 flex-grow overflow-y-auto scrollbar-thin"
                        style={{ maxHeight: "calc(100vh - 300px)" }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              {getSenderIcon(selectedMessage.sender_type)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{selectedMessage.sender_name}</p>
                              <p className="text-xs text-gray-500">{selectedMessage.sender_email}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(selectedMessage.sent_at)}
                          </div>
                        </div>
                        <div className="prose max-w-none">
                          <p className="whitespace-pre-line">{selectedMessage.content}</p>
                        </div>
                        {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedMessage.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className="flex items-center p-2 bg-gray-50 border border-gray-200 rounded-md"
                                >
                                  <span className="text-xs text-gray-600">{attachment}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p>Select a message to read</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
