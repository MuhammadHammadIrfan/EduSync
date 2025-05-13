import React, { useState, useEffect } from 'react';
import { FiMail, FiTrash2, FiEye, FiChevronLeft, FiSend } from 'react-icons/fi';
import Layout from '../../components/Layout';
import MultiSelectFilter from '../../components/MultiSelectFilter';
import { getMessages, sendMessage, deleteMessage, getRecipients } from '../../utils/adminApi';
import { mockMessages, mockRecipients } from '../../utils/mockData';

export default function Inbox() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [mode, setMode] = useState('list'); // 'list', 'view', 'compose', 'reply'
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load messages and recipients
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // In real app: const messages = await getMessages();
        const messages = mockMessages;
        setMessages(messages);
        
        // In real app: const recipients = await getRecipients();
        const recipients = mockRecipients;
        setRecipients(recipients);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredMessages = messages.filter(msg => 
    activeTab === 'inbox' ? msg.receiver === 'admin' : msg.sender === 'admin'
  );

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setMode('view');
  };

  const handleCompose = () => {
    setSelectedMessage(null);
    setMode('compose');
  };

  const handleReply = () => {
    setMode('reply');
  };

  const handleDelete = async (messageId) => {
    try {
      // In real app: await deleteMessage(messageId);
      setMessages(messages.filter(msg => msg.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
        setMode('list');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleSend = async (messageData) => {
    try {
      // In real app: const newMessage = await sendMessage(messageData);
      const newMessage = {
        id: `msg-${Date.now()}`,
        subject: messageData.subject,
        body: messageData.body,
        sender: 'admin',
        receiver: messageData.recipients[0].value, // Simplified for mock
        senderName: 'Admin',
        recipientNames: messageData.recipients.map(r => r.label),
        date: new Date().toISOString(),
        read: false
      };
      
      setMessages([newMessage, ...messages]);
      setMode('list');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <Layout title="Inbox">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {mode === 'compose' ? 'New Message' : 
               mode === 'reply' ? 'Reply' : 
               mode === 'view' ? selectedMessage?.subject || 'Message' : 'Inbox'}
            </h1>
            
            {mode !== 'list' && (
              <button 
                onClick={() => setMode('list')}
                className="md:hidden p-1 rounded-full hover:bg-gray-200"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex border-b">
          <button
            className={`flex-1 py-2 text-center ${activeTab === 'inbox' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('inbox')}
          >
            Inbox
          </button>
          <button
            className={`flex-1 py-2 text-center ${activeTab === 'sent' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent
          </button>
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Message list - always visible on desktop, conditional on mobile */}
          <div className={`w-full md:w-1/3 border-r ${mode !== 'list' ? 'hidden md:block' : ''}`}>
            <div className="p-2 border-b flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 text-sm rounded ${activeTab === 'inbox' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('inbox')}
                >
                  Inbox
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded ${activeTab === 'sent' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('sent')}
                >
                  Sent
                </button>
              </div>
              <button
                onClick={handleCompose}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Compose
              </button>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-180px)]">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading messages...</div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No messages found</div>
              ) : (
                filteredMessages.map(message => (
                  <div
                    key={message.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate pr-2">
                        {message.subject || '(No subject)'}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(message.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {activeTab === 'inbox' 
                        ? `From: ${message.senderName || 'Unknown'}`
                        : `To: ${message.recipientNames?.join(', ') || 'Unknown'}`}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 truncate">
                        {message.body.substring(0, 60)}{message.body.length > 60 ? '...' : ''}
                      </p>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMessage(message);
                          }}
                          className="text-gray-400 hover:text-blue-500 p-1"
                          title="View"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(message.id);
                          }}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message view/compose area */}
          <div className={`flex-1 ${mode === 'list' ? 'hidden md:flex md:items-center md:justify-center' : ''}`}>
            {mode === 'compose' && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">New Message</h2>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                  <MultiSelectFilter
                    label="Recipients"
                    options={recipients}
                    selected={[]}
                    onChange={() => {}}
                    groupMode={true}
                  />
                  <div className="mt-4">
                    <MessageComposer
                      onSend={handleSend}
                      onCancel={() => setMode('list')}
                      recipientOptions={recipients}
                      multipleRecipients={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'reply' && selectedMessage && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Reply</h2>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                  <MessageComposer
                    onSend={handleSend}
                    onCancel={() => setMode('view')}
                    recipientOptions={recipients}
                    isReply={true}
                    replyToMessage={selectedMessage}
                    multipleRecipients={true}
                  />
                </div>
              </div>
            )}

            {mode === 'view' && selectedMessage && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-semibold truncate">
                    {selectedMessage.subject || '(No subject)'}
                  </h2>
                  {activeTab === 'inbox' && (
                    <button
                      onClick={handleReply}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
                    >
                      <FiSend className="mr-1" /> Reply
                    </button>
                  )}
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="mb-4">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">
                            {activeTab === 'inbox' ? 'From:' : 'To:'}
                          </span>{' '}
                          {activeTab === 'inbox' 
                            ? selectedMessage.senderName || 'Unknown'
                            : selectedMessage.recipientNames?.join(', ') || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Date:</span> {formatDate(selectedMessage.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="prose max-w-none whitespace-pre-line">
                      {selectedMessage.body}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mode !== 'compose' && mode !== 'reply' && mode !== 'view' && (
              <div className="hidden md:flex items-center justify-center h-full">
                <div className="text-center p-8 max-w-md">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiMail className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {activeTab === 'inbox' ? 'No message selected' : 'No sent message selected'}
                  </h3>
                  <p className="text-gray-500">
                    Select a message from the list to view its contents
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}