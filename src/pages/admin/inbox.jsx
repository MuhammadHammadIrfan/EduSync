import { requireRole } from '@/lib/requireRole';
import React, { useState } from 'react';
import MessageComposer from '../../components/components/MessageComposer';
import Layout from '../../components/components/Layout';

export async function getServerSideProps(context) {
  return requireRole(context, "admin")
}


export default function Inbox({ inboxMessages, sentMessages, onSend }) {
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' or 'sent'
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMode, setReplyMode] = useState(false);

  const handleReply = (message) => {
    setSelectedMessage(message);
    setReplyMode(true);
  };

  const handleSend = (data) => {
    onSend(data);
    setReplyMode(false);
    setSelectedMessage(null);
  };

  const renderMessages = (messages) =>
    messages.map((msg) => (
      <div
        key={msg.id}
        className="border-b py-3 cursor-pointer hover:bg-gray-50 px-2"
        onClick={() => setSelectedMessage(msg)}
      >
        <p className="font-medium">{msg.subject}</p>
        <p className="text-sm text-gray-600">From: {msg.sender_name}</p>
      </div>
    ));

  return (
    <Layout title='inbox'>
    <div className="bg-white rounded shadow p-6">
      <div className="flex space-x-4 mb-4">
        <button
          className={`btn ${activeTab === 'inbox' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => { setActiveTab('inbox'); setSelectedMessage(null); }}
        >
          Inbox
        </button>
        <button
          className={`btn ${activeTab === 'sent' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => { setActiveTab('sent'); setSelectedMessage(null); }}
        >
          Sent
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 border-r pr-4">
          {renderMessages(activeTab === 'inbox' ? inboxMessages : sentMessages)}
        </div>

        <div className="col-span-2">
          {replyMode ? (
            <MessageComposer
              onSend={handleSend}
              recipientOptions={[]}
              isReply={true}
              replyToMessage={selectedMessage}
            />
          ) : selectedMessage ? (
            <div className="space-y-2">
              <h3 className="text-lg font-bold">{selectedMessage.subject}</h3>
              <p className="text-gray-600 text-sm">From: {selectedMessage.sender_name}</p>
              <p className="text-gray-800 mt-2">{selectedMessage.body}</p>

              {activeTab === 'inbox' && (
                <button
                  className="btn btn-sm btn-secondary mt-4"
                  onClick={() => handleReply(selectedMessage)}
                >
                  Reply
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Select a message to view.</p>
          )}
        </div>
      </div>
    </div>
    </Layout>
  );
}
