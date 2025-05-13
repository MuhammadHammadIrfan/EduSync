"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { Send, User, Clock, Star, StarOff, Trash2, Mail, Loader2 } from "lucide-react"
import FacultySidebar from "../../../components/FacultySidebar"
import { getSentMessages } from "../../../utils/api"

export default function FacultyMessagesSent() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [starredMessages, setStarredMessages] = useState([])

  useEffect(() => {
    async function fetchMessages() {
      try {
        const messagesData = await getSentMessages()
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

  const getRecipientIcon = (recipientType) => {
    switch (recipientType) {
      case "student":
        return <User className="h-4 w-4 text-blue-500" />
      case "admin":
        return <User className="h-4 w-4 text-red-500" />
      default:
        return <Mail className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Sent Messages | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <FacultySidebar activePage="messages-sent" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-6xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Sent Messages</h1>

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
                <div className="border-r border-gray-200 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-800 flex items-center">
                      <Send className="h-5 w-5 text-blue-500 mr-2" />
                      Sent
                    </h2>
                  </div>

                  {messages.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 cursor-pointer transition-colors ${
                            selectedMessage && selectedMessage.id === message.id ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2">
                              <div className="flex-shrink-0 mt-1">{getRecipientIcon(message.recipient_type)}</div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{message.subject}</h3>
                                <p className="text-xs text-gray-500 line-clamp-1">To: {message.recipient_name}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-gray-500">{formatDate(message.sent_at)}</span>
                              {message.attachments && message.attachments.length > 0 && (
                                <span className="text-xs text-blue-500 mt-1">
                                  {message.attachments.length} attachment
                                  {message.attachments.length !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{message.content.split("\n")[0]}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Send className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-800 mb-1">No Sent Messages</h3>
                      <p className="text-gray-500">You haven't sent any messages yet</p>
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="col-span-2 flex flex-col overflow-hidden">
                  {selectedMessage ? (
                    <>
                      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-800 truncate">{selectedMessage.subject}</h2>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleStarred(selectedMessage.id)}
                            className="p-1 rounded-full hover:bg-gray-200"
                            aria-label={
                              starredMessages.includes(selectedMessage.id) ? "Unstar message" : "Star message"
                            }
                          >
                            {starredMessages.includes(selectedMessage.id) ? (
                              <Star className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <StarOff className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                          <button
                            className="p-1 rounded-full hover:bg-gray-200"
                            aria-label="Delete message"
                            onClick={() => {
                              setSelectedMessage(null)
                              // In a real app, you would also delete the message from the server
                              setMessages(messages.filter((m) => m.id !== selectedMessage.id))
                            }}
                          >
                            <Trash2 className="h-5 w-5 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-gray-200 rounded-full p-2 mr-3">
                              {getRecipientIcon(selectedMessage.recipient_type)}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-800">
                                To: {selectedMessage.recipient_name}
                              </h3>
                              <p className="text-xs text-gray-500">{selectedMessage.recipient_email}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(selectedMessage.sent_at)}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 overflow-y-auto flex-grow">
                        <div className="prose max-w-none">
                          {selectedMessage.content.split("\n").map((paragraph, index) => (
                            <p key={index} className="mb-4 text-sm text-gray-800">
                              {paragraph}
                            </p>
                          ))}
                        </div>

                        {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                          <div className="mt-6 border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                            <div className="space-y-2">
                              {selectedMessage.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className="flex items-center p-2 border border-gray-200 rounded-md bg-gray-50"
                                >
                                  <div className="flex-shrink-0 bg-blue-100 rounded p-2 mr-2">
                                    <svg
                                      className="h-4 w-4 text-blue-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-blue-600 truncate">{attachment}</p>
                                  </div>
                                  <div className="ml-2">
                                    <button className="text-xs text-blue-600 hover:text-blue-800">Download</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <Send className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Select a message</h3>
                      <p className="text-gray-500 max-w-md">
                        Choose a message from the list to view its contents here.
                      </p>
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
