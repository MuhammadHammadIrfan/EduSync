import React, { useState, useEffect } from 'react';
import Select from 'react-select';

export default function EventForm({
  event,
  onSubmit,
  onCancel,
  audienceOptions,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    audience: [],
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        event_date: event.event_date || '',
        location: event.location || '',
        audience: event.audience
          ? event.audience.map((a) => ({
              label: a.charAt(0).toUpperCase() + a.slice(1),
              value: a.toLowerCase(),
            }))
          : [],
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAudienceChange = (selected) => {
    setFormData((prev) => ({ ...prev, audience: selected }));
  };

  const isValid =
    formData.title &&
    formData.description &&
    formData.event_date &&
    formData.location &&
    formData.audience.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const dataToSend = {
      ...formData,
      audience: formData.audience.map((a) => a.value),
    };

    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border p-4 rounded-sm shadow">
        <label className="block font-medium text-sm">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="border p-4 rounded-sm shadow">
        <label className="block font-medium text-sm">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
        />
      </div>
      <div className="border p-4 rounded-sm shadow">
        <label className="block font-medium text-sm">Date</label>
        <input
          type="date"
          name="event_date"
          value={formData.event_date}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="border p-4 rounded-sm shadow">
        <label className="block font-medium text-sm">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block font-medium text-sm">Target Audience</label>
        <Select
          isMulti
          value={formData.audience}
          onChange={handleAudienceChange}
          options={audienceOptions}
        />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn btn-primary ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isValid}
        >
          Save Event
        </button>
      </div>
    </form>
  );
}
