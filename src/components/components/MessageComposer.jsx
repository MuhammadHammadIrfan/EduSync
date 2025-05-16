import React, { useState } from 'react';
import { FiUser, FiMessageSquare, FiSend } from 'react-icons/fi';

export default function MessageComposer({ 
  onSend, 
  recipientOptions = [],
  isReply = false,
  replyToMessage = null 
}) {
  const [formData, setFormData] = useState({
    receiver_type: isReply && replyToMessage ? replyToMessage.sender_type : 'student',
    receiver_id: isReply && replyToMessage ? replyToMessage.sender_id : '',
    subject: isReply && replyToMessage ? `Re: ${replyToMessage.subject}` : '',
    body: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!isReply && !formData.receiver_id) {
      newErrors.receiver_id = 'Recipient is required';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.body.trim()) {
      newErrors.body = 'Message body is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submissionData = {
      ...formData,
      receiver_id: parseInt(formData.receiver_id),
    };

    onSend(submissionData);

    if (!isReply) {
      setFormData({ receiver_type: 'student', receiver_id: '', subject: '', body: '' });
    } else {
      setFormData(prev => ({ ...prev, body: '' }));
    }
  };

  const filteredRecipients = recipientOptions.filter(
    option => option.type === formData.receiver_type
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {isReply ? 'Reply to Message' : 'Compose New Message'}
      </h3>

      {!isReply && (
        <>
          {/* Receiver Type */}
          <div className="form-group">
            <label className="form-label">Recipient Type</label>
            <div className="flex space-x-4">
              {['student', 'faculty', 'admin'].map(type => (
                <label key={type} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="receiver_type"
                    value={type}
                    checked={formData.receiver_type === type}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Receiver */}
          <div className="form-group">
            <label htmlFor="receiver_id" className="form-label flex items-center">
              <FiUser className="mr-2 text-gray-500" />
              Recipient
            </label>
            <select
              id="receiver_id"
              name="receiver_id"
              value={formData.receiver_id}
              onChange={handleChange}
              className={`input ${errors.receiver_id ? 'border-red-500' : ''}`}
            >
              <option value="">Select Recipient</option>
              {filteredRecipients.map(rec => (
                <option key={rec.id} value={rec.id}>
                  {rec.name} ({rec.email})
                </option>
              ))}
            </select>
            {errors.receiver_id && <p className="text-red-500 text-sm">{errors.receiver_id}</p>}
          </div>

          {/* Subject */}
          <div className="form-group">
            <label htmlFor="subject" className="form-label flex items-center">
              <FiMessageSquare className="mr-2 text-gray-500" />
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`input ${errors.subject ? 'border-red-500' : ''}`}
              placeholder="Message subject"
            />
            {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
          </div>
        </>
      )}

      {isReply && replyToMessage && (
        <div className="bg-gray-100 p-4 border rounded-md mb-4 text-sm text-gray-700">
          <p><strong>From:</strong> {replyToMessage.sender_name} ({replyToMessage.sender_type})</p>
          <p><strong>Subject:</strong> {replyToMessage.subject}</p>
          <p className="mt-2 italic">{replyToMessage.body}</p>
        </div>
      )}

      {/* Body */}
      <div className="form-group">
        <label htmlFor="body" className="form-label flex items-center">
          <FiMessageSquare className="mr-2 text-gray-500" />
          Message
        </label>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          rows="5"
          className={`input ${errors.body ? 'border-red-500' : ''}`}
          placeholder="Type your message..."
        />
        {errors.body && <p className="text-red-500 text-sm">{errors.body}</p>}
      </div>

      <div className="text-right">
        <button type="submit" className="btn btn-primary flex items-center">
          <FiSend className="mr-2" />
          {isReply ? 'Send Reply' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}
