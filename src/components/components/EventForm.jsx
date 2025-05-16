import React, { useState, useEffect } from 'react';
import { FiCalendar, FiEdit3, FiUsers, FiInfo } from 'react-icons/fi';

export default function EventForm({
  event = null,
  onSubmit,
  departments = [],
  classes = [],
  sections = [],
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    audience_type: 'all',
    audience_id: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        id: event.id,
        title: event.title || '',
        description: event.description || '',
        event_date: event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : '',
        audience_type: event.audience_type || 'all',
        audience_id: event.audience_id?.toString() || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        event_date: '',
        audience_type: 'all',
        audience_id: '',
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'audience_type') {
      setFormData((prev) => ({ ...prev, audience_id: '' }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.event_date) newErrors.event_date = 'Event date is required';
    if (formData.audience_type !== 'all' && !formData.audience_id) newErrors.audience_id = 'Please select a target audience';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submissionData = {
        ...formData,
        audience_id: formData.audience_id ? parseInt(formData.audience_id) : undefined,
      };
      onSubmit(submissionData);
    }
  };

  const getAudienceOptions = () => {
    switch (formData.audience_type) {
      case 'department':
        return departments.map((dept) => ({ id: dept.id, name: dept.name }));
      case 'class':
        return classes.map((cls) => ({ id: cls.id, name: cls.name }));
      case 'section':
        return sections.map((section) => ({ id: section.id, name: `${section.name}` }));
      default:
        return [];
    }
  };

  const audienceOptions = getAudienceOptions();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="title" className="form-label flex items-center">
            <FiEdit3 className="mr-2 text-gray-500" />
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter event title"
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="event_date" className="form-label flex items-center">
            <FiCalendar className="mr-2 text-gray-500" />
            Event Date
          </label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            className={`input ${errors.event_date ? 'border-red-500' : ''}`}
          />
          {errors.event_date && <p className="mt-1 text-xs text-red-500">{errors.event_date}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="audience_type" className="form-label flex items-center">
            <FiUsers className="mr-2 text-gray-500" />
            Target Audience
          </label>
          <select
            id="audience_type"
            name="audience_type"
            value={formData.audience_type}
            onChange={handleChange}
            className={`input ${errors.audience_type ? 'border-red-500' : ''}`}
          >
            <option value="all">All Users</option>
            <option value="student">All Students</option>
            <option value="faculty">All Faculty</option>
            <option value="department">Specific Department</option>
            <option value="class">Specific Class</option>
            <option value="section">Specific Section</option>
          </select>
          {errors.audience_type && <p className="mt-1 text-xs text-red-500">{errors.audience_type}</p>}
        </div>

        {formData.audience_type !== 'all' && formData.audience_type !== 'student' && formData.audience_type !== 'faculty' && (
          <div className="form-group">
            <label htmlFor="audience_id" className="form-label flex items-center">
              <FiUsers className="mr-2 text-gray-500" />
              Select Audience
            </label>
            <select
              id="audience_id"
              name="audience_id"
              value={formData.audience_id}
              onChange={handleChange}
              className={`input ${errors.audience_id ? 'border-red-500' : ''}`}
            >
              <option value="">Select...</option>
              {audienceOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors.audience_id && <p className="mt-1 text-xs text-red-500">{errors.audience_id}</p>}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="description" className="form-label flex items-center">
            <FiInfo className="mr-2 text-gray-500" />
            Event Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`input ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Enter event description"
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          Save Event
        </button>
      </div>
    </form>
  );
}
