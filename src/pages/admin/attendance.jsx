import { requireRole } from '@/lib/requireRole';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiCheck, FiX, FiInfo, FiClock } from 'react-icons/fi';
import Layout from '../../components/components/Layout';
import { 
  getAttendance, 
  updateAttendance, 
  getDepartments,
  getClasses,
  getSections,
  getCourses,
  getUsers
} from '../../../utils/api/admin';

export async function getServerSideProps(context) {
  return requireRole(context, "admin");
}

export default function Attendance() {
  // State variables
  const [attendanceData, setAttendanceData] = useState({
    records: [],
    summary: { present: 0, absent: 0, late: 0, total: 0 }
  });
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Filter state
  const [filters, setFilters] = useState({
    departmentId: '',
    classId: '',
    sectionId: '',
    courseId: '',
    date: ''
  });

  // Fetch reference data on initial load
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [departmentsData, classesData, sectionsData, coursesData] = await Promise.all([
          getDepartments(),
          getClasses(),
          getSections(),
          getCourses()
        ]);
        
        setDepartments(departmentsData || []);
        setClasses(classesData || []);
        setSections(sectionsData || []);
        setCourses(coursesData || []);
      } catch (error) {
        console.error('Error fetching reference data:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchReferenceData();
  }, []);
  
  // Update filtered classes when department changes
  useEffect(() => {
    if (!filters.departmentId) {
      setFilteredClasses([]);
      return;
    }
    
    const deptId = parseInt(filters.departmentId);
    const classesForDept = classes.filter(cls => cls.departmentId === deptId);
    setFilteredClasses(classesForDept);
    
    // Reset class and section selection
    if (filters.classId) {
      const classExists = classesForDept.some(c => c.id === parseInt(filters.classId));
      if (!classExists) {
        setFilters(prev => ({
          ...prev,
          classId: '',
          sectionId: '',
          courseId: ''
        }));
      }
    }
  }, [filters.departmentId, classes]);
  
  // Update filtered sections when class changes
  useEffect(() => {
    if (!filters.classId) {
      setFilteredSections([]);
      return;
    }
    
    const classId = parseInt(filters.classId);
    const sectionsForClass = sections.filter(section => section.classId === classId);
    setFilteredSections(sectionsForClass);
    
    // Reset section selection if current selected section doesn't belong to the class
    if (filters.sectionId) {
      const sectionExists = sectionsForClass.some(s => s.id === parseInt(filters.sectionId));
      if (!sectionExists) {
        setFilters(prev => ({
          ...prev,
          sectionId: '',
          courseId: ''
        }));
      }
    }
  }, [filters.classId, sections]);
  
  // Update filtered courses when department changes
  useEffect(() => {
    if (!filters.departmentId) {
      setFilteredCourses([]);
      return;
    }
    
    const deptId = parseInt(filters.departmentId);
    const coursesForDept = courses.filter(course => course.departmentId === deptId);
    setFilteredCourses(coursesForDept);
    
    // Reset course selection
    if (filters.courseId) {
      const courseExists = coursesForDept.some(c => c.id === parseInt(filters.courseId));
      if (!courseExists) {
        setFilters(prev => ({
          ...prev,
          courseId: ''
        }));
      }
    }
  }, [filters.departmentId, courses]);
  
  // Fetch attendance records when all filters are set
  const fetchAttendanceRecords = async () => {
    // Check if all required filters are present
    if (!filters.departmentId || !filters.classId || !filters.sectionId || !filters.courseId) {
      setAttendanceData({ records: [], summary: { present: 0, absent: 0, late: 0, total: 0 } });
      return;
    }
    
    try {
      setLoading(true);
      const data = await getAttendance(filters);
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch attendance when filters change
  useEffect(() => {
    fetchAttendanceRecords();
  }, [filters]);
  
  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      
      // Reset dependent fields
      if (field === 'departmentId') {
        newFilters.classId = '';
        newFilters.sectionId = '';
        newFilters.courseId = '';
      } else if (field === 'classId') {
        newFilters.sectionId = '';
      }
      
      return newFilters;
    });
  };
  
  // Handle updating attendance status
  const handleUpdateStatus = async (attendanceId, newStatus) => {
    try {
      setLoading(true);
      await updateAttendance(attendanceId, { status: newStatus });
      fetchAttendanceRecords();
    } catch (error) {
      console.error('Error updating attendance status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Check if all filters are applied
  const areAllFiltersApplied = () => {
    return Boolean(
      filters.departmentId && 
      filters.classId && 
      filters.sectionId && 
      filters.courseId
    );
  };
  
  return (
    <Layout title="Attendance">
      <Head>
        <title>Attendance Management | EduSync</title>
      </Head>

      <div className="p-6 bg-gray-100 min-h-screen space-y-6">
        {/* Loading indicator */}
        {loading && (
         <div className="fixed top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-50 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            <p className="text-sm">Loading attendance...</p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Select Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select 
                value={filters.departmentId} 
                onChange={(e) => handleFilterChange('departmentId', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                disabled={initialLoading}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            
            {/* Class Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select 
                value={filters.classId} 
                onChange={(e) => handleFilterChange('classId', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                disabled={!filters.departmentId || initialLoading}
              >
                <option value="">Select Class</option>
                {filteredClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            
            {/* Section Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select 
                value={filters.sectionId} 
                onChange={(e) => handleFilterChange('sectionId', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                disabled={!filters.classId || initialLoading}
              >
                <option value="">Select Section</option>
                {filteredSections.map(section => (
                  <option key={section.id} value={section.id}>{section.name}</option>
                ))}
              </select>
            </div>
            
            {/* Course Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select 
                value={filters.courseId} 
                onChange={(e) => handleFilterChange('courseId', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                disabled={!filters.departmentId || initialLoading}
              >
                <option value="">Select Course</option>
                {filteredCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.course_code})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date (Optional)</label>
              <input 
                type="date" 
                value={filters.date} 
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
        </div>
        
        {/* Attendance Summary Cards */}
        {areAllFiltersApplied() && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <div className="h-6 w-6 text-blue-700 flex items-center justify-center font-bold">T</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-xl font-bold text-gray-800">
                  {attendanceData.summary.total}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <div className="h-6 w-6 text-green-700 flex items-center justify-center font-bold">P</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Present</p>
                <p className="text-xl font-bold text-gray-800">
                  {attendanceData.summary.present}
                  <span className="text-sm text-gray-500 ml-2">
                    ({attendanceData.summary.total ? ((attendanceData.summary.present / attendanceData.summary.total) * 100).toFixed(1) : 0}%)
                  </span>
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <div className="h-6 w-6 text-red-700 flex items-center justify-center font-bold">A</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Absent</p>
                <p className="text-xl font-bold text-gray-800">
                  {attendanceData.summary.absent}
                  <span className="text-sm text-gray-500 ml-2">
                    ({attendanceData.summary.total ? ((attendanceData.summary.absent / attendanceData.summary.total) * 100).toFixed(1) : 0}%)
                  </span>
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <div className="h-6 w-6 text-yellow-700 flex items-center justify-center font-bold">L</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Late</p>
                <p className="text-xl font-bold text-gray-800">
                  {attendanceData.summary.late}
                  <span className="text-sm text-gray-500 ml-2">
                    ({attendanceData.summary.total ? ((attendanceData.summary.late / attendanceData.summary.total) * 100).toFixed(1) : 0}%)
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Attendance Records */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {initialLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading data...</p>
            </div>
          ) : !areAllFiltersApplied() ? (
            <div className="p-8 text-center">
              <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Data to Display</h3>
              <p className="mt-1 text-gray-500">
                Please select a department, class, section, and course to view attendance records.
              </p>
            </div>
          ) : attendanceData.records.length === 0 ? (
            <div className="p-8 text-center">
              <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Attendance Records Found</h3>
              <p className="mt-1 text-gray-500">
                No attendance records found for the selected criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.records.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.student?.name || `Student #${record.studentId}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.course?.name || `Course #${record.courseId}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record.status === 'Present'
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'Absent'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(record.id, 'Present')}
                            className={`p-1 ${record.status === 'Present' ? 'bg-green-200' : 'bg-green-100'} text-green-700 hover:bg-green-200 rounded`}
                            title="Mark Present"
                          >
                            <FiCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(record.id, 'Absent')}
                            className={`p-1 ${record.status === 'Absent' ? 'bg-red-200' : 'bg-red-100'} text-red-700 hover:bg-red-200 rounded`}
                            title="Mark Absent"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(record.id, 'Late')}
                            className={`p-1 ${record.status === 'Late' ? 'bg-yellow-200' : 'bg-yellow-100'} text-yellow-700 hover:bg-yellow-200 rounded`}
                            title="Mark Late"
                          >
                            <FiClock className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}