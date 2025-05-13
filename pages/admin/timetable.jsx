import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiChevronLeft, FiChevronRight, FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import FilterBar from '../../components/FilterBar';
import Layout from '../../components/Layout';

import DataTable from '../../components/DataTable';
import { 
  getSchedules, 
  getDepartments, 
  getClasses, 
  getSections, 
  getCourses, 
  getUsers, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule 
} from '../../utils/adminApi';

export default function Timetable() {
  const [schedules, setSchedules] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('student'); // 'student' or 'faculty'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState({
    departmentId: '',
    classId: '',
    sectionId: '',
    facultyId: '',
    day: '',
  });

  // Day mapping
  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  
  // Set default day to current day
  useEffect(() => {
    const today = daysOfWeek[new Date().getDay()];
    setFilters(prev => ({ ...prev, day: today }));
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch lookup data for filters and form
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);
        
        const classesData = await getClasses();
        setClasses(classesData);
        
        const sectionsData = await getSections();
        setSections(sectionsData);
        
        const coursesData = await getCourses();
        setCourses(coursesData);
        
        const facultyData = await getUsers({role: 'faculty'});
        setFaculty(facultyData);
        
        // Fetch schedules based on filters
        await fetchSchedules();
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      
      // Add view type to filter params
      const queryParams = {
        ...filters,
        view_type: viewType,
      };
      
      const schedulesData = await getSchedules(queryParams);
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSchedules();
  }, [filters, viewType]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const handleAddSchedule = () => {
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
        await deleteSchedule(schedule.id);
        // Refresh the schedule list
        fetchSchedules();
      } catch (error) {
        console.error('Failed to delete schedule:', error);
        alert('Failed to delete schedule. Please try again.');
      }
    }
  };
  
  const handleScheduleFormSubmit = async (formData) => {
    try {
      if (selectedSchedule) {
        // Update existing schedule
        await updateSchedule(selectedSchedule.id, formData);
      } else {
        // Create new schedule
        await createSchedule(formData);
      }
      
      // Reset form state and refresh schedule list
      setSelectedSchedule(null);
      setShowAddForm(false);
      fetchSchedules();
    } catch (error) {
      console.error('Failed to save schedule:', error);
      alert('Failed to save schedule. Please try again.');
    }
  };
  
  const handlePreviousDay = () => {
    const currentDayIndex = daysOfWeek.indexOf(filters.day);
    if (currentDayIndex > 0) {
      const previousDay = daysOfWeek[currentDayIndex - 1];
      setFilters(prev => ({ ...prev, day: previousDay }));
    } else {
      const previousDay = daysOfWeek[daysOfWeek.length - 1];
      setFilters(prev => ({ ...prev, day: previousDay }));
    }
  };
  
  const handleNextDay = () => {
    const currentDayIndex = daysOfWeek.indexOf(filters.day);
    if (currentDayIndex < daysOfWeek.length - 1) {
      const nextDay = daysOfWeek[currentDayIndex + 1];
      setFilters(prev => ({ ...prev, day: nextDay }));
    } else {
      const nextDay = daysOfWeek[0];
      setFilters(prev => ({ ...prev, day: nextDay }));
    }
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // If it's a full ISO string with date and time
    if (timeString.includes('T')) {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If it's just a time string (HH:MM:SS)
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };
  
  // Generate filter options based on view type
  const getFilterOptions = () => {
  if (viewType === 'student') {
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
          // Filter classes based on department and ensure uniqueness
          const filteredClasses = classes
            .filter(cls => !selectedFilters.departmentId || 
              cls.departmentId?.toString() === selectedFilters.departmentId.toString());
          const uniqueClasses = Array.from(new Set(filteredClasses.map(cls => cls.id)))
            .map(id => filteredClasses.find(cls => cls.id === id));
          return uniqueClasses.map(cls => ({ value: cls.id, label: cls.name }));
        }
      },
      { 
        key: 'sectionId', 
        label: 'Section', 
        type: 'select', 
        placeholder: 'Select Section',
        dependsOn: 'classId',
        getOptionsFrom: (selectedFilters) => {
          // Filter sections based on class and ensure uniqueness
          const filteredSections = sections
            .filter(sec => !selectedFilters.classId || 
              sec.classId?.toString() === selectedFilters.classId.toString());
          const uniqueSections = Array.from(new Set(filteredSections.map(sec => sec.id)))
            .map(id => filteredSections.find(sec => sec.id === id));
          return uniqueSections.map(sec => ({ value: sec.id, label: sec.name }));
        }
      },
      { 
        key: 'day', 
        label: 'Day', 
        type: 'select', 
        options: daysOfWeek.map(day => ({ value: day, label: day }))
      },
    ];
  } else {
    return [
      { 
        key: 'facultyId', 
        label: 'Faculty', 
        type: 'select', 
        placeholder: 'Select Faculty',
        options: faculty.map(f => ({ value: f.id, label: f.name }))
      },
      { 
        key: 'departmentId', 
        label: 'Department', 
        type: 'select', 
        placeholder: 'Select Department',
        options: departments.map(dept => ({ value: dept.id, label: dept.name }))
      },
      { 
        key: 'day', 
        label: 'Day', 
        type: 'select', 
        options: daysOfWeek.map(day => ({ value: day, label: day }))
      },
    ];
  }
};

  // Schedule form fields (for adding/editing)
  const scheduleFormFields = [
    { 
      name: 'courseId', 
      label: 'Course', 
      type: 'select',
      options: courses.map(course => ({ value: course.id, label: `${course.name} (${course.course_code})` }))
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
        .filter(sec => !selectedSchedule?.classId || sec.classId === selectedSchedule.classId)
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

  // Group schedules by time slots for a more organized display
  const groupSchedulesByTime = () => {
    // Create time slots from 8 AM to 8 PM (can be adjusted)
    const timeSlots = [];
    
    for (let hour = 8; hour <= 20; hour++) {
      timeSlots.push(`${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`);
    }
    
    // Group schedules by time slot
    const grouped = timeSlots.map(slot => {
      const slotsSchedules = schedules.filter(schedule => {
        const startTime = formatTime(schedule.start_time);
        return startTime === slot;
      });
      
      return {
        timeSlot: slot,
        schedules: slotsSchedules
      };
    });
    
    // Filter out empty time slots
    return grouped.filter(group => group.schedules.length > 0);
  };

  return (
    <Layout title="Timetable">
    
      <Head>
        <title>Timetable Management | EduSync</title>
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Timetable Management</h1>
          <div className="flex space-x-2">
            <button 
              onClick={handleAddSchedule}
              className="btn btn-primary flex items-center"
            >
              <FiPlus className="mr-2" />
              Add Schedule
            </button>
          </div>
        </div>

        {/* View Type Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setViewType('student')}
            className={`py-2 px-4 font-medium text-sm rounded-t-lg ${viewType === 'student' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
          >
            Student View
          </button>
          <button
            onClick={() => setViewType('faculty')}
            className={`ml-2 py-2 px-4 font-medium text-sm rounded-t-lg ${viewType === 'faculty' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
          >
            Faculty View
          </button>
        </div>

        {/* Filters */}
        <FilterBar
          filters={getFilterOptions()}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
          dependencies={{ classId: ['departmentId'], sectionId: ['classId'] }}
        />

        {/* Day Navigation */}
        <div className="flex justify-between items-center bg-white rounded-lg shadow p-4">
          <button 
            onClick={handlePreviousDay}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg font-medium text-gray-800">
            {filters.day || 'Select a day'}
          </h2>
          
          <button 
            onClick={handleNextDay}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule Data Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Loading timetable...</p>
          </div>
        ) : schedules.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
              {schedules.map(schedule => (
                <div key={schedule.id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold">{schedule.course.name}</h3>
                  <p>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</p>
                  <p>{schedule.faculty.name}</p>
                  <p>{schedule.department.name}</p>
                  <p>{schedule.class.name}</p>
                  <p>{schedule.section.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No schedules found for the selected filters.</p>
          </div>
        )}

        {/* Add/Edit Schedule Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              {selectedSchedule ? 'Edit Schedule' : 'Add New Schedule'}
            </h2>
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
                  <div key={field.name} className="form-group">
                    <label htmlFor={field.name} className="form-label">
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        defaultValue={selectedSchedule ? selectedSchedule[field.name] : ''}
                        className="input"
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
                        defaultValue={selectedSchedule && selectedSchedule[field.name] ? new Date(selectedSchedule[field.name]).toTimeString().slice(0, 5) : ''}
                        className="input"
                        required
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        id={field.name}
                        name={field.name}
                        defaultValue={selectedSchedule ? selectedSchedule[field.name] : ''}
                        className="input"
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
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedSchedule ? 'Update Schedule' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
