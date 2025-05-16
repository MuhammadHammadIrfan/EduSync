import { requireRole } from '@/lib/requireRole';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiPlus, FiEdit3, FiTrash2, FiCalendar, FiList, FiInfo } from 'react-icons/fi';
import FilterBar from '../../components/components/FilterBar';
import Layout from '../../components/components/Layout';
import { 
  getSchedules, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule,
  getDepartments,
  getClasses,
  getSections,
  getCourses,
  getUsers
} from '../../../utils/api/admin';

export async function getServerSideProps(context) {
  return requireRole(context, "admin")
}

export default function Timetable() {
  // Core state
  const [schedules, setSchedules] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'week'
  const [filtersComplete, setFiltersComplete] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    departmentId: '',
    classId: '',
    sectionId: '',
    facultyId: '',
    day: ''
  });

  // Day mapping
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];
  
  const dayIndexMap = {
    'Monday': 0,
    'Tuesday': 1,
    'Wednesday': 2,
    'Thursday': 3,
    'Friday': 4,
    'Saturday': 5,
    'Sunday': 6
  };
  // Add this helper function:
  const formatTimeForInput = (timeValue) => {
    if (!timeValue) return '';
    
    try {
      // If it's a full ISO string (from DB)
      if (typeof timeValue === 'string' && timeValue.includes('T')) {
        const date = new Date(timeValue);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      }
      
      // If it's already in HH:MM format
      if (typeof timeValue === 'string' && timeValue.includes(':')) {
        const parts = timeValue.split(':');
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      }
      
      return '';
    } catch (e) {
      console.error('Error formatting time for input:', e);
      return '';
    }
  };
  // Load reference data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch lookup data for filters and form
        const [departmentsData, classesData, sectionsData, coursesData, facultyData] = 
          await Promise.all([
            getDepartments(),
            getClasses(),
            getSections(),
            getCourses(),
            getUsers({role: 'faculty'})
          ]);
        
        setDepartments(departmentsData || []);
        setClasses(classesData || []);
        setSections(sectionsData || []);
        setCourses(coursesData || []);
        setFaculty(facultyData || []);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setNotification({
          type: 'error',
          message: 'Failed to load initial data. Please refresh the page.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Check if filters are complete
  useEffect(() => {
    // For section view, we need departmentId, classId and sectionId
    if (filters.facultyId) {
      setFiltersComplete(true);
      fetchSchedules();
    } else if (filters.departmentId && filters.classId && filters.sectionId) {
      setFiltersComplete(true);
      fetchSchedules();
    } else {
      setFiltersComplete(false);
      setSchedules([]);
    }
  }, [filters]);
  
  // Fetch schedules based on complete filters
  const fetchSchedules = async () => {
    if (!filtersComplete) return;
    
    try {
      setLoading(true);
      
      // Add view type to filter params
      const queryParams = { ...filters };
      
      // Only include day filter in day view
      if (viewMode === 'day' && filters.day) {
        queryParams.day = filters.day;
      } else {
        delete queryParams.day;
      }
      
      const schedulesData = await getSchedules(queryParams);
      setSchedules(schedulesData || []);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      setNotification({
        type: 'error',
        message: 'Failed to fetch timetable data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Refetch when view mode changes
  useEffect(() => {
    if (filtersComplete) {
      fetchSchedules();
    }
  }, [viewMode]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(prev => {
      // Reset day when changing other filters
      if (newFilters.departmentId !== prev.departmentId || 
          newFilters.classId !== prev.classId || 
          newFilters.sectionId !== prev.sectionId || 
          newFilters.facultyId !== prev.facultyId) {
        return { 
          ...newFilters, 
          day: viewMode === 'day' ? (prev.day || 'Monday') : '' 
        };
      }
      return newFilters;
    });
  };
  
  const handleAddSchedule = () => {
    // Pre-populate some form fields from current filters
    const initialData = {
      departmentId: filters.departmentId || '',
      classId: filters.classId || '',
      sectionId: filters.sectionId || '',
      facultyId: filters.facultyId || ''
    };
    
    setSelectedSchedule(null);
    setShowAddForm(true);
  };
  
  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowAddForm(true);
  };
  
  const handleDeleteSchedule = async (schedule) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        setLoading(true);
        await deleteSchedule(schedule.id);
        fetchSchedules();
        setNotification({
          type: 'success',
          message: 'Schedule deleted successfully'
        });
      } catch (error) {
        console.error('Failed to delete schedule:', error);
        setNotification({
          type: 'error',
          message: 'Failed to delete schedule. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Update inside handleScheduleFormSubmit function
  const handleScheduleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      // Format time values correctly for API
      const formattedData = {
        ...formData,
        courseId: parseInt(formData.courseId, 10),
        facultyId: parseInt(formData.facultyId, 10),
        classId: parseInt(formData.classId, 10),
        sectionId: parseInt(formData.sectionId, 10)
        // No need to format start_time and end_time - the API will handle this
      };
      
      if (selectedSchedule) {
        await updateSchedule(selectedSchedule.id, formattedData);
        setNotification({
          type: 'success',
          message: 'Schedule updated successfully'
        });
      } else {
        await createSchedule(formattedData);
        setNotification({
          type: 'success',
          message: 'Schedule created successfully'
        });
      }
      
      // Reset form state and refresh schedule list
      setSelectedSchedule(null);
      setShowAddForm(false);
      fetchSchedules();
    } catch (error) {
      console.error('Failed to save schedule:', error);
      setNotification({
        type: 'error',
        message: 'Failed to save schedule. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDayChange = (day) => {
    setFilters(prev => ({ ...prev, day }));
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    try {
      // If it's a full ISO string with date and time
      if (timeString.includes('T')) {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // If it's just a time string (HH:MM:SS)
      const timeParts = timeString.split(':');
      if (timeParts.length < 2) return timeString;
      
      const hours = parseInt(timeParts[0]);
      const minutes = timeParts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${minutes} ${ampm}`;
    } catch (e) {
      console.error('Error formatting time:', e);
      return timeString;
    }
  };
  
  // Generate filter options
  const getFilterOptions = () => {
    if (filters.facultyId) {
      // Faculty view filters
      return [
        { 
          key: 'facultyId', 
          label: 'Faculty', 
          type: 'select', 
          placeholder: 'Select Faculty',
          options: faculty.map(f => ({ value: f.id, label: f.name }))
        },
        ...(viewMode === 'day' ? [{ 
          key: 'day', 
          label: 'Day', 
          type: 'select', 
          options: daysOfWeek.map(day => ({ value: day, label: day }))
        }] : [])
      ];
    }
    
    // Section view filters
    return [
      { 
        key: 'departmentId', 
        label: 'Department', 
        type: 'select', 
        placeholder: 'Select Department',
        options: departments.map(dept => ({ value: dept.id, label: dept.name }))
      },
      { 
        key: 'classId', 
        label: 'Class', 
        type: 'select', 
        placeholder: 'Select Class',
        dependsOn: 'departmentId',
        getOptionsFrom: (selectedFilters) => {
          // Filter classes based on department
          const filteredClasses = classes
            .filter(cls => !selectedFilters.departmentId || 
              cls.departmentId?.toString() === selectedFilters.departmentId.toString());
          return filteredClasses.map(cls => ({ value: cls.id, label: cls.name }));
        }
      },
      { 
        key: 'sectionId', 
        label: 'Section', 
        type: 'select', 
        placeholder: 'Select Section',
        dependsOn: 'classId',
        getOptionsFrom: (selectedFilters) => {
          // Filter sections based on class
          const filteredSections = sections
            .filter(sec => !selectedFilters.classId || 
              sec.classId?.toString() === selectedFilters.classId.toString());
          return filteredSections.map(sec => ({ value: sec.id, label: sec.name }));
        }
      },
      ...(viewMode === 'day' ? [{ 
        key: 'day', 
        label: 'Day', 
        type: 'select', 
        options: daysOfWeek.map(day => ({ value: day, label: day }))
      }] : [])
    ];
  };
  
  // Schedule form fields (for adding/editing)
  const scheduleFormFields = [
    { 
      name: 'courseId', 
      label: 'Course', 
      type: 'select',
      options: courses.map(course => ({ 
        value: course.id, 
        label: `${course.name} (${course.course_code})` 
      }))
    },
    { 
      name: 'facultyId', 
      label: 'Faculty', 
      type: 'select',
      options: faculty.map(f => ({ value: f.id, label: f.name }))
    },
    { 
      name: 'classId', 
      label: 'Class', 
      type: 'select',
      options: classes.map(cls => ({ value: cls.id, label: cls.name }))
    },
    { 
      name: 'sectionId', 
      label: 'Section', 
      type: 'select',
      options: sections
        .filter(sec => !selectedSchedule?.classId || 
          sec.classId?.toString() === selectedSchedule.classId?.toString())
        .map(sec => ({ value: sec.id, label: sec.name }))
    },
    { 
      name: 'day_of_week', 
      label: 'Day', 
      type: 'select',
      options: daysOfWeek.map(day => ({ value: day, label: day }))
    },
    { 
      name: 'start_time', 
      label: 'Start Time', 
      type: 'time'
    },
    { 
      name: 'end_time', 
      label: 'End Time', 
      type: 'time'
    },
  ];

  // Render day view timetable
  const renderDayView = () => {
    // Filter schedules for the selected day
    const daySchedules = schedules.filter(s => s.day_of_week === filters.day);
    
    // Sort by start time
    const sortedSchedules = [...daySchedules].sort((a, b) => 
      new Date(`1970-01-01T${a.start_time}`) - new Date(`1970-01-01T${b.start_time}`));
    
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-center bg-gray-50 p-4 border-b">
          <h3 className="text-lg font-medium text-gray-800">
            {filters.day || 'Select a day'}
          </h3>
        </div>
        
        {sortedSchedules.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {filters.facultyId ? 'Class & Section' : 'Faculty'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSchedules.map((schedule) => {
                const course = courses.find(c => c.id === schedule.courseId) || {};
                const teacher = faculty.find(f => f.id === schedule.facultyId) || {};
                const cls = classes.find(c => c.id === schedule.classId) || {};
                const section = sections.find(s => s.id === schedule.sectionId) || {};
                
                return (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.name ? `${course.name} (${course.course_code})` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {filters.facultyId 
                        ? `${cls.name || 'N/A'} - ${section.name || 'N/A'}`
                        : teacher.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {section.room_no || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditSchedule(schedule)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEdit3 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              No classes scheduled for {filters.day || 'the selected day'}.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render week view timetable
  const renderWeekView = () => {
    // Group schedules by day and sort by time
    const schedulesByDay = daysOfWeek.map(day => {
      const daySchedules = schedules.filter(s => s.day_of_week === day);
      return {
        day,
        schedules: [...daySchedules].sort((a, b) => 
          new Date(`1970-01-01T${a.start_time}`) - new Date(`1970-01-01T${b.start_time}`))
      };
    });
    
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {daysOfWeek.map(day => (
            <div key={day} className="bg-gray-50 p-3 text-center">
              <h3 className="font-medium text-sm">{day}</h3>
            </div>
          ))}
          
          {daysOfWeek.map(day => {
            const dayData = schedulesByDay.find(d => d.day === day);
            const daySchedules = dayData ? dayData.schedules : [];
            
            return (
              <div key={`content-${day}`} className="bg-white p-2 min-h-[200px] border-t overflow-y-auto max-h-[300px]">
                {daySchedules.length > 0 ? (
                  <div className="space-y-2">
                    {daySchedules.map(schedule => {
                      const course = courses.find(c => c.id === schedule.courseId) || {};
                      const teacher = faculty.find(f => f.id === schedule.facultyId) || {};
                      
                      return (
                        <div key={schedule.id} className="p-2 bg-blue-50 border border-blue-100 rounded text-xs">
                          <div className="font-medium text-blue-800">
                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                          </div>
                          <div className="font-medium mt-1 text-gray-900">
                            {course.name || 'Unknown Course'}
                          </div>
                          <div className="text-gray-600">
                            {filters.facultyId ? 'Class' : 'Teacher'}: {
                              filters.facultyId 
                                ? `${classes.find(c => c.id === schedule.classId)?.name || 'N/A'} - 
                                   ${sections.find(s => s.id === schedule.sectionId)?.name || 'N/A'}`
                                : teacher.name || 'N/A'
                            }
                          </div>
                          <div className="mt-1 flex justify-end space-x-1">
                            <button
                              onClick={() => handleEditSchedule(schedule)}
                              className="p-1 text-blue-600 hover:text-blue-900"
                            >
                              <FiEdit3 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(schedule)}
                              className="p-1 text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-gray-400">
                    No classes
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Layout title="Timetable">
        <Head>
          <title>Timetable Management | EduSync</title>
        </Head>

        <div className="p-6 bg-gray-100 min-h-screen space-y-6">
          {/* Notification */}
          {notification && (
            <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-md ${
              notification.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
              notification.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
              'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiInfo className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm">{notification.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
           <div className="fixed top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-50 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            <p className="text-sm">Loading timetable...</p>
          </div>
          )}

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Timetable Management</h1>
            <div className="flex space-x-2">
              <button 
                onClick={handleAddSchedule}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow flex items-center font-medium"
              >
                <FiPlus className="mr-2" />
                Add Schedule
              </button>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-800">View Options</h2>
            </div>
            
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setFilters(prev => ({ ...prev, facultyId: '' }))}
                className={`py-2 px-4 font-medium text-sm rounded-t-lg ${
                  !filters.facultyId
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Section Timetable
              </button>
              <button
                onClick={() => setFilters({
                  facultyId: faculty.length > 0 ? faculty[0].id : '',
                  day: 'Monday'
                })}
                className={`ml-2 py-2 px-4 font-medium text-sm rounded-t-lg ${
                  filters.facultyId
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Faculty Timetable
              </button>
            </div>
            
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setViewMode('day')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  viewMode === 'day' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                <FiList className="mr-2" /> 
                Daily View
              </button>
              
              <button
                onClick={() => setViewMode('week')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  viewMode === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                <FiCalendar className="mr-2" /> 
                Weekly View
              </button>
            </div>
            
            {/* Filters */}
            <FilterBar
              filters={getFilterOptions()}
              activeFilters={filters}
              onFilterChange={handleFilterChange}
              loading={loading}
              dependencies={{
                classId: ['departmentId'],
                sectionId: ['classId']
              }}
            />
          </div>

          {/* Day Selection in Day View */}
          {viewMode === 'day' && filtersComplete && (
            <div className="flex justify-center space-x-2 bg-white rounded-lg shadow p-4">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  onClick={() => handleDayChange(day)}
                  className={`px-4 py-2 rounded-md ${
                    filters.day === day 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}

          {/* Schedule Display */}
          {!filtersComplete ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Select filters to view timetable</h3>
              <p className="mt-1 text-gray-500">
                {filters.facultyId 
                  ? 'Please select a faculty to view their schedule.' 
                  : 'Please select a department, class, and section to view the timetable.'}
              </p>
            </div>
          ) : loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Loading timetable...</p>
            </div>
          ) : viewMode === 'day' ? (
            renderDayView()
          ) : (
            renderWeekView()
          )}

          {/* Add/Edit Schedule Form */}
          {showAddForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedSchedule ? 'Edit Schedule' : 'Add New Schedule'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  
                  // Create form data object
                  const formData = {};
                  scheduleFormFields.forEach(field => {
                    formData[field.name] = e.target[field.name].value;
                  });
                  
                  handleScheduleFormSubmit(formData);
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {scheduleFormFields.map((field) => (
                      <div key={field.name}>
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            id={field.name}
                            name={field.name}
                            defaultValue={selectedSchedule ? selectedSchedule[field.name] : ''}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === 'time' ? (
                          <input
                            type="time"
                            id={field.name}
                            name={field.name}
                            defaultValue={
                              selectedSchedule && selectedSchedule[field.name]
                                ? formatTimeForInput(selectedSchedule[field.name])
                                : ''
                            }
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        ) : (
                          <input
                            type={field.type || 'text'}
                            id={field.name}
                            name={field.name}
                            defaultValue={selectedSchedule ? selectedSchedule[field.name] : ''}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {selectedSchedule ? 'Update Schedule' : 'Create Schedule'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}