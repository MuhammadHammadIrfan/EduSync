import { requireRole } from '@/lib/requireRole';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Layout from '../../components/components/Layout';
import { FiChevronLeft, FiChevronRight, FiPlus, FiList } from 'react-icons/fi';
import { 
  getCourses, 
  createCourse, 
  updateCourse,
  deleteCourse,
  getDepartments,
} from '../../../utils/api/admin';

export async function getServerSideProps(context) {
  return requireRole(context, "admin");
}

const Courses = () => {
  // Define all state variables at the top of the component
  const [viewMode, setViewMode] = useState('list');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(10); // Display 10 courses per page

  // Fetch departments and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments for filter
        const departmentsData = await getDepartments();
        setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
        
        // Fetch courses
        const coursesData = await getCourses();
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter courses by department
  const filteredCourses = selectedDepartment
    ? courses.filter(course => 
        course.departmentId === selectedDepartment.value || 
        course.department?.id === selectedDepartment.value
      )
    : courses;

  // Get current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredCourses.length / coursesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Form submission handler
  const handleAddCourse = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const courseData = {
      name: formData.get('name'),
      course_code: formData.get('course_code'),
      departmentId: parseInt(formData.get('department'), 10),
      credit_hours: parseInt(formData.get('credit_hours'), 10)
    };
    
    try {
      setLoading(true);
      const newCourse = await createCourse(courseData);
      
      // Add to state
      setCourses(prev => [...prev, newCourse]);
      
      // Reset form
      event.target.reset();
      
      // Show success message
      alert('Course added successfully');
      
      // Switch back to list view
      setViewMode('list');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Format department options for the Select component
  const departmentOptions = departments.map(dept => ({
    value: dept.id,
    label: dept.name
  }));

  return (
    <Layout title="Courses Management">
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Header with action buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Course Management</h1>
          <div className="space-x-2">
            <button
              key="list"
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md flex items-center ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-blue-600 border border-blue-600'
              }`}
            >
              <FiList className="mr-1" />
              View Courses
            </button>
            <button
              key="add"
              onClick={() => setViewMode('add')}
              className={`px-4 py-2 my-2 rounded-md flex items-center ${
                viewMode === 'add' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-blue-600 border border-blue-600'
              }`}
            >
              <FiPlus className="mr-1" />
              Add Course
            </button>
          </div>
        </div>

        {/* Non-blocking loading indicator for operations */}
        {loading && (
          <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
            <p>Processing...</p>
          </div>
        )}

        {/* Initial loading state - shows skeleton UI instead of black screen */}
        {initialLoading ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="grid grid-cols-4 gap-4">
                    <div className="h-6 bg-gray-200 rounded col-span-1"></div>
                    <div className="h-6 bg-gray-200 rounded col-span-1"></div>
                    <div className="h-6 bg-gray-200 rounded col-span-1"></div>
                    <div className="h-6 bg-gray-200 rounded col-span-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Department filter - only shown in list view */}
            {viewMode === 'list' && (
              <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Department
                </label>
                <Select
                  isClearable
                  name="department"
                  options={departmentOptions}
                  value={selectedDepartment}
                  onChange={(selected) => {
                    setSelectedDepartment(selected);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                  className="basic-select"
                  classNamePrefix="select"
                  placeholder="All Departments"
                />
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {currentCourses.length === 0 ? (
                  <p className="text-gray-500 p-6 text-center">
                    {filteredCourses.length === 0 
                      ? "No courses available." 
                      : "No courses match the selected department."}
                  </p>
                ) : (
                  <>
                    {/* Courses table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Course Code
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Course Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Credit Hours
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Department
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentCourses.map((course) => (
                            <tr key={course.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                {course.course_code}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {course.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {course.credit_hours}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {course.department?.name || 'Unknown Department'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
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
                          disabled={currentPage >= Math.ceil(filteredCourses.length / coursesPerPage)}
                          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                            currentPage >= Math.ceil(filteredCourses.length / coursesPerPage)
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
                            Showing <span className="font-medium">{indexOfFirstCourse + 1}</span> to{' '}
                            <span className="font-medium">
                              {Math.min(indexOfLastCourse, filteredCourses.length)}
                            </span>{' '}
                            of <span className="font-medium">{filteredCourses.length}</span> courses
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
                            {[...Array(Math.ceil(filteredCourses.length / coursesPerPage)).keys()].map(number => (
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
                              disabled={currentPage >= Math.ceil(filteredCourses.length / coursesPerPage)}
                              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                currentPage >= Math.ceil(filteredCourses.length / coursesPerPage)
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
            )}

            {/* Add View */}
            {viewMode === 'add' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Add New Course</h2>
                <form onSubmit={handleAddCourse} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                      Course Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="course_code">
                      Course Code
                    </label>
                    <input
                      type="text"
                      name="course_code"
                      id="course_code"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="credit_hours">
                      Credit Hours
                    </label>
                    <input
                      type="number"
                      name="credit_hours"
                      id="credit_hours"
                      required
                      min="1"
                      max="6"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="department">
                      Department
                    </label>
                    <select
                      name="department"
                      id="department"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                      <option value="">Select Department</option>
                      {departmentOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Add Course
                    </button>
                    <button
                      type="button" 
                      onClick={() => setViewMode('list')}
                      className="ml-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Courses;