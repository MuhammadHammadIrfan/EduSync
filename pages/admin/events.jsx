import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiPlus, FiCalendar, FiList, FiUpload } from 'react-icons/fi';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import EventForm from '../../components/EventForm';
import Calendar from '../../components/Calendar';
import Select from 'react-select';
import Papa from 'papaparse';

import {
  getEvents,
  getDepartments,
  getClasses,
  getSections,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../../utils/adminApi';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    audienceTypes: [],
    eventDates: [],
  });
  const [uploadAudience, setUploadAudience] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [departmentsData, classesData, sectionsData] = await Promise.all([
          getDepartments(),
          getClasses(),
          getSections(),
        ]);
        setDepartments(departmentsData);
        setClasses(classesData);
        setSections(sectionsData);
        await fetchEvents();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const queryParams = {
        audienceTypes: filters.audienceTypes.map((option) => option.value),
        eventDates: filters.eventDates.map((option) => option.value),
      };
      const data = await getEvents(queryParams);
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const handleFilterChange = (key, selectedOptions) => {
    setFilters((prev) => ({ ...prev, [key]: selectedOptions }));
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowAddForm(true);
    setShowUploadPanel(false);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowAddForm(true);
    setShowUploadPanel(false);
  };

  const handleDeleteEvent = async (event) => {
    if (window.confirm(`Delete "${event.title}"?`)) {
      await deleteEvent(event.id);
      fetchEvents();
    }
  };

  const handleFormSubmit = async (eventData) => {
    try {
      if (selectedEvent) {
        await updateEvent(selectedEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }
      setShowAddForm(false);
      setSelectedEvent(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert('Failed to save event.');
    }
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleUploadSubmit = () => {
    if (!uploadFile) return alert('Please select a file.');

    Papa.parse(uploadFile, {
      header: true,
      complete: async (results) => {
        const requiredFields = ['title', 'description', 'date', 'location'];
        const invalidRow = results.data.find((row) =>
          requiredFields.some((field) => !row[field])
        );

        if (invalidRow) {
          return alert('Each row must include title, description, date, and location.');
        }

        try {
          for (const row of results.data) {
            await createEvent({
              title: row.title,
              description: row.description,
              event_date: row.date,
              location: row.location,
              audience: uploadAudience.map((a) => a.value),
            });
          }
          alert('Events uploaded successfully.');
          setShowUploadPanel(false);
          setUploadFile(null);
          setUploadAudience([]);
          fetchEvents();
        } catch (err) {
          console.error(err);
          alert('Failed to upload events.');
        }
      },
    });
  };

  const handleManualUpload = () => {
    if (!selectedFile || uploadAudience.length === 0) {
      alert('Please select a file and audience before uploading.');
      return;
    }

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const requiredFields = ['title', 'description', 'date', 'location'];
        const headers = results.meta.fields.map((h) => h.trim().toLowerCase());

        const isValid =
          headers.length === requiredFields.length &&
          requiredFields.every((field) => headers.includes(field));

        if (!isValid) {
          alert('CSV must contain only: title, description, date, location');
          return;
        }

        try {
          const audience = uploadAudience.map((a) => a.value);
          for (let event of results.data) {
            await createEvent({ ...event, audience });
          }
          alert('Events uploaded successfully.');
          fetchEvents();
          // Reset UI
          setShowUploadPanel(false);
          setSelectedFile(null);
          setUploadAudience([]);
        } catch (err) {
          console.error(err);
          alert('Failed to upload events.');
        }
      },
      error: (err) => {
        console.error('CSV parse error:', err);
        alert('Error reading the file.');
      },
    });
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    {
      key: 'event_date',
      label: 'Date',
      render: (row) => formatDate(row.event_date),
    },
  ];

  const calendarEvents = events.map((event) => ({
    ...event,
    date: new Date(event.event_date),
    title: event.title,
  }));

  const audienceOptions = [
    { value: 'all', label: 'All' },
    { value: 'student', label: 'Student' },
    { value: 'faculty', label: 'Faculty' },
  ];

  const dateOptions =
    events.length > 0
      ? [...new Set(events.map((e) => e.event_date))].map((date) => ({
          value: date,
          label: formatDate(date),
        }))
      : [];

  return (
    <Layout title="Events">
      <Head>
        <title>Event Management | EduSync</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h1 className="text-2xl font-bold">Event Management</h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleAddEvent} className="btn btn-primary">
              <FiPlus className="mr-1" /> Create Event
            </button>
            <button
              onClick={() => {
                setShowUploadPanel(!showUploadPanel);
                setShowAddForm(false);
              }}
              className="btn btn-outline"
            >
              <FiUpload className="mr-1" /> Upload Events
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
            >
              <FiList className="mr-1" /> List
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-sm">Event Audience</label>
            <Select
              isMulti
              options={audienceOptions}
              value={filters.audienceTypes}
              onChange={(selected) => handleFilterChange('audienceTypes', selected)}
            />
          </div>
          <div>
            <label className="font-medium text-sm">Event Dates</label>
            <Select
              isMulti
              options={dateOptions}
              value={filters.eventDates}
              onChange={(selected) => handleFilterChange('eventDates', selected)}
            />
          </div>
        </div>

        {/* Upload Panel */}
        {showUploadPanel && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <div>
              <label className="font-medium text-sm">Select Audience</label>
              <Select
                isMulti
                options={audienceOptions}
                value={uploadAudience}
                onChange={setUploadAudience}
              />
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="block"
            />

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowUploadPanel(false);
                  setUploadAudience([]);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleManualUpload}
                disabled={!selectedFile || uploadAudience.length === 0}
              >
                Upload Events
              </button>
            </div>
          </div>
        )}

        {/* Create/Edit Panel */}
        {showAddForm && (
          <div className="bg-white p-6 rounded shadow">
            <EventForm
              event={selectedEvent}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowAddForm(false);
                setSelectedEvent(null);
              }}
              departments={departments}
              classes={classes}
              sections={sections}
            />
          </div>
        )}

        {/* List or Calendar */}
        {viewMode === 'list' ? (
          <DataTable
            columns={columns}
            data={events}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        ) : (
          <div className="bg-white rounded shadow p-6">
            <Calendar events={calendarEvents} onDateClick={() => {}} />
          </div>
        )}
      </div>
    </Layout>
  );
}
