import { requireRole } from '@/lib/requireRole';
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { FiPlus, FiCalendar, FiList, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Layout from '../../components/components/Layout';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import {
  getEvents,
  getDepartments,
  getClasses,
  getSections,
  createEvent,
  updateEvent,
  deleteEvent
} from '../../../utils/api/admin';

export async function getServerSideProps(context) {
  return requireRole(context, "admin");
}

export default function Events() {
  // Core state
  const [events, setEvents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    audienceTypes: [],
    eventDates: []
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10); // 10 events per page like in courses
  
  // Event form state - matching schema exactly
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: new Date(),
    audience: {
      type: 'all',
      ids: []
    }
  });

  // 1) Initial data load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setInitialLoading(true);
        
        // Fetch reference data in parallel
        const [departmentsData, classesData, sectionsData] = await Promise.all([
          getDepartments().catch(err => {
            console.error('Error fetching departments:', err);
            return [];
          }),
          getClasses().catch(err => {
            console.error('Error fetching classes:', err);
            return [];
          }),
          getSections().catch(err => {
            console.error('Error fetching sections:', err);
            return [];
          })
        ]);
        
        setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
        setClasses(Array.isArray(classesData) ? classesData : []);
        setSections(Array.isArray(sectionsData) ? sectionsData : []);
        
        // Now fetch events
        fetchEvents();
      } catch (err) {
        console.error('Error in initial data fetching:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, []);  // only once on mount

  // 2) Fetch events function - used for initial load and filter changes
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      // Convert the selected filter options to API query parameters
      const queryParams = {
        page: currentPage,
        limit: eventsPerPage
      };
      
      // Add audience type filters if selected
      if (filters.audienceTypes && filters.audienceTypes.length > 0) {
        queryParams.audienceTypes = filters.audienceTypes.map(o => o.value);
      }
      
      // Add event date filters if selected
      if (filters.eventDates && filters.eventDates.length > 0) {
        queryParams.eventDates = filters.eventDates.map(o => o.value);
      }

      const response = await getEvents(queryParams);
      
      // Handle the new response format with pagination
      if (response && response.events) {
        setEvents(response.events);
        
        // Update pagination info
        if (response.pagination) {
          // You can track total events length if needed
          setTotalEvents(response.pagination.total);
        }
      } else {
        // Handle legacy response format (just in case)
        setEvents(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, eventsPerPage]);

  // 3) Refetch events when filters change
  useEffect(() => {
    if (!initialLoading) {
      fetchEvents();
    }
  }, [filters, fetchEvents, initialLoading]);

  // Get current events for pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const nextPage = () => {
    if (currentPage < Math.ceil(totalEvents / eventsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterChange = (key, selectedOptions) => {
    setFilters(prev => ({ ...prev, [key]: selectedOptions || [] }));
  };

  const handleAddEvent = () => {
    setFormData({
      title: '',
      description: '',
      event_date: new Date(),
      audience: {
        type: 'all',
        ids: []
      }
    });
    setSelectedEvent(null);
    setShowAddForm(true);
  };

  const handleEditEvent = event => {
    // Extract audience information based on schema
    let audienceType = 'all';
    let audienceIds = [];
    
    if (event.audiences && event.audiences.length > 0) {
      // The audience_type in our schema is an enum (AudienceType)
      audienceType = event.audiences[0].audience_type.toLowerCase();
      audienceIds = event.audiences
        .filter(a => a.audience_type === audienceType)
        .map(a => a.audience_id);
    }
    
    setFormData({
      title: event.title,
      description: event.description,
      event_date: new Date(event.event_date),
      audience: {
        type: audienceType,
        ids: audienceIds
      }
    });
    
    setSelectedEvent(event);
    setShowAddForm(true);
  };

  const handleDeleteEvent = async event => {
    if (window.confirm(`Are you sure you want to delete the event "${event.title}"?`)) {
      try {
        setLoading(true);
        await deleteEvent(event.id);
        await fetchEvents(); // Refresh events list
      } catch (err) {
        console.error('Error deleting event:', err);
        alert('Failed to delete event. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAudienceChange = (type, ids = []) => {
    setFormData(prev => ({
      ...prev,
      audience: {
        type,
        ids
      }
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title.trim()) {
      alert('Event title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Event description is required');
      return;
    }
    
    if (!formData.event_date) {
      alert('Event date is required');
      return;
    }
    
    // Special handling for audience types that require IDs
    if (['department', 'class', 'section'].includes(formData.audience.type) && 
        (!Array.isArray(formData.audience.ids) || formData.audience.ids.length === 0)) {
      alert(`Please select at least one ${formData.audience.type}`);
      return;
    }
    
    try {
      setFormLoading(true);
      
      // Prepare event data according to schema.prisma Event and EventAudience models
      const eventData = {
        title: formData.title,
        description: formData.description,
        event_date: formData.event_date.toISOString(),
        // Audiences match the EventAudience model in schema.prisma
        audiences: [{
          audience_type: formData.audience.type.toUpperCase(), // Match enum in schema
          audience_ids: formData.audience.ids
        }]
      };

      if (selectedEvent) {
        await updateEvent(selectedEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }
      
      setShowAddForm(false);
      setSelectedEvent(null);
      await fetchEvents(); // Refresh events list
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Failed to save event. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = dateStr => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Table columns definition
  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description', render: (row) => row.description.length > 100 ? `${row.description.substring(0, 100)}...` : row.description },
    {
      key: 'event_date',
      label: 'Date & Time',
      render: row => formatDate(row.event_date)
    },
    {
      key: 'audiences',
      label: 'Target Audience',
      render: row => {
        if (!row.audiences || row.audiences.length === 0) return 'All';
        
        // Match AudienceType enum in schema.prisma
        const audienceMap = {
          ALL: 'All Users',
          STUDENT: 'Students',
          FACULTY: 'Faculty',
          DEPARTMENT: 'Department',
          CLASS: 'Class',
          SECTION: 'Section'
        };
        
        const audience = row.audiences[0];
        return audienceMap[audience.audience_type] || audience.audience_type;
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleEditEvent(row);
            }}
            className="p-1 text-blue-600 hover:text-blue-800"
            aria-label="Edit"
          >
            <FiEdit size={18} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteEvent(row);
            }}
            className="p-1 text-red-600 hover:text-red-800"
            aria-label="Delete"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  const calendarEvents = events.map(ev => ({
    id: ev.id,
    title: ev.title,
    date: new Date(ev.event_date),
    description: ev.description
  }));

  // Audience options matching the AudienceType enum in schema.prisma
  const audienceOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'student', label: 'Students Only' },
    { value: 'faculty', label: 'Faculty Only' },
    { value: 'department', label: 'Specific Department' },
    { value: 'class', label: 'Specific Class' },
    { value: 'section', label: 'Specific Section' }
  ];

  const dateOptions = events.length
    ? Array.from(new Set(events.map(e => e.event_date))).map(date => ({
        value: date,
        label: formatDate(date)
      }))
    : [];
  
  // Get options based on audience type
  const getAudienceTypeOptions = () => {
    switch(formData.audience.type) {
      case 'department':
        return departments.map(dept => ({ value: dept.id, label: dept.name }));
      case 'class':
        return classes.map(cls => ({ value: cls.id, label: cls.name }));
      case 'section':
        return sections.map(sec => ({ value: sec.id, label: sec.name }));
      default:
        return [];
    }
  };

  // This renders a table of events in list view with pagination
  const renderEventTable = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {currentEvents.length === 0 ? (
          <p className="text-gray-500 p-6 text-center">
            {events.length === 0 
              ? "No events found. Try different filters or create a new event." 
              : "No events match the selected filters."}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((col) => (
                      <th 
                        key={col.key} 
                        scope="col" 
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      {columns.map((col) => (
                        <td key={`${event.id}-${col.key}`} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {col.render ? col.render(event) : event[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination - Same style as courses page */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage >= Math.ceil(events.length / eventsPerPage)}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage >= Math.ceil(events.length / eventsPerPage)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstEvent + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastEvent, events.length)}
                    </span>{' '}
                    of <span className="font-medium">{events.length}</span> events
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(Math.ceil(events.length / eventsPerPage)).keys()].map(number => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage >= Math.ceil(events.length / eventsPerPage)}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage >= Math.ceil(events.length / eventsPerPage)
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Calendar view - simplified with upcoming events
  const renderCalendarView = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700">
          <div className="bg-white py-2">Sunday</div>
          <div className="bg-white py-2">Monday</div>
          <div className="bg-white py-2">Tuesday</div>
          <div className="bg-white py-2">Wednesday</div>
          <div className="bg-white py-2">Thursday</div>
          <div className="bg-white py-2">Friday</div>
          <div className="bg-white py-2">Saturday</div>
        </div>
        
        <div className="text-center mt-8 text-gray-500">
          <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Calendar view</h3>
          <p className="mt-1 text-sm text-gray-500">
            Calendar view is simplified in this version.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddEvent}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Event
            </button>
          </div>
        </div>
        
        {events.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Upcoming Events</h3>
            <div className="space-y-3">
              {events
                .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                .filter(event => new Date(event.event_date) >= new Date())
                .slice(0, 5)
                .map(event => (
                  <div key={event.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-blue-600">{event.title}</h4>
                    <p className="text-sm text-gray-700 mt-1">{formatDate(event.event_date)}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout title="Events">
      <Head>
        <title>Event Management | EduSync</title>
      </Head>

      <div className="p-6 bg-gray-100 min-h-screen space-y-6">
        {/* Non-blocking loading indicator */}
        {loading && !initialLoading && (
          <div className="fixed top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-50 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            <p className="text-sm">Loading events...</p>
          </div>
        )}
        
        {/* Header with action buttons */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
          
          <div className="flex items-center space-x-2">
            {/* Add Event Button - Highlighted */}
            <button 
              onClick={handleAddEvent} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow flex items-center font-medium transition-colors duration-200"
            >
              <FiPlus className="mr-1.5" size={18} /> 
              <span>Add Event</span>
            </button>
            
            {/* View Mode Toggle Buttons - Highlighted */}
            <div className="bg-white rounded-md shadow p-1 flex">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-3 py-1.5 rounded ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                } transition-colors duration-200`}
                aria-current={viewMode === 'list' ? 'page' : undefined}
              >
                <FiList className="mr-1.5" />
                <span className="font-medium">List</span>
              </button>
              
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center px-3 py-1.5 rounded ${
                  viewMode === 'calendar' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                } transition-colors duration-200`}
                aria-current={viewMode === 'calendar' ? 'page' : undefined}
              >
                <FiCalendar className="mr-1.5" />
                <span className="font-medium">Calendar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Initial loading skeleton */}
        {initialLoading ? (
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="grid grid-cols-4 gap-4">
                    <div className="h-6 bg-gray-200 rounded col-span-1"></div>
                    <div className="h-6 bg-gray-200 rounded col-span-2"></div>
                    <div className="h-6 bg-gray-200 rounded col-span-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Events</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audience Type
                  </label>
                  <Select
                    isMulti
                    options={audienceOptions}
                    value={filters.audienceTypes}
                    onChange={selected => handleFilterChange('audienceTypes', selected)}
                    placeholder="All audience types"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Dates
                  </label>
                  <Select
                    isMulti
                    options={dateOptions}
                    value={filters.eventDates}
                    onChange={selected => handleFilterChange('eventDates', selected)}
                    placeholder="All dates"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            </div>

            {/* Add/Edit Event Form - Highlighted */}
            {showAddForm && (
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedEvent ? 'Edit Event' : 'Add New Event'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {/* Title - Highlighted */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter event title"
                    />
                  </div>

                  {/* Description - Highlighted */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      required
                      rows={4}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Provide event details"
                    ></textarea>
                  </div>

                  {/* Event Date - Highlighted */}
                  <div>
                    <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date & Time <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      selected={formData.event_date}
                      onChange={(date) => handleFormChange('event_date', date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Audience Type - Highlighted */}
                  <div>
                    <label htmlFor="audience_type" className="block text-sm font-medium text-gray-700 mb-1">
                      Target Audience <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="audience_type"
                      name="audience_type"
                      value={formData.audience.type}
                      onChange={(e) => handleAudienceChange(e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="all">All Users</option>
                      <option value="student">Students Only</option>
                      <option value="faculty">Faculty Only</option>
                      <option value="department">Specific Department</option>
                      <option value="class">Specific Class</option>
                      <option value="section">Specific Section</option>
                    </select>
                  </div>

                  {/* Conditional audience selection - Highlighted */}
                  {['department', 'class', 'section'].includes(formData.audience.type) && (
                    <div>
                      <label htmlFor="audience_ids" className="block text-sm font-medium text-gray-700 mb-1">
                        Select {formData.audience.type === 'department' ? 'Departments' : 
                               formData.audience.type === 'class' ? 'Classes' : 'Sections'}
                        <span className="text-red-500">*</span>
                      </label>
                      <Select
                        isMulti
                        id="audience_ids"
                        name="audience_ids"
                        options={getAudienceTypeOptions()}
                        value={getAudienceTypeOptions().filter(option => 
                          formData.audience.ids.includes(option.value)
                        )}
                        onChange={(selected) => {
                          const ids = selected ? selected.map(item => item.value) : [];
                          handleAudienceChange(formData.audience.type, ids);
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder={`Select ${formData.audience.type}(s)`}
                      />
                    </div>
                  )}

                  {/* Form Actions - Highlighted */}
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="inline-flex justify-center items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {formLoading ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          {selectedEvent ? 'Updating...' : 'Saving...'}
                        </>
                      ) : (
                        selectedEvent ? 'Update Event' : 'Save Event'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Content based on view mode */}
            {viewMode === 'list' ? renderEventTable() : renderCalendarView()}
          </>
        )}
      </div>
    </Layout>
  );
}