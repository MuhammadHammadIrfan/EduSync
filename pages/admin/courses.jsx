import React, { useState } from 'react';
import Select from 'react-select';
import Papa from 'papaparse';
import FileUpload from '../../components/FileUpload';
import Layout from '../../components/Layout';
import { handleFormSubmit } from '../../utils/adminApi';
import { filterOptions, initialCourses } from '../../utils/mockData';

const requiredFields = ['course code', 'course name', 'credit hours'];

const Courses = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    department: [],
    class: [],
    faculty: [],
  });
  const [viewMode, setViewMode] = useState('list');
  const [courses, setCourses] = useState(initialCourses);

  const handleFilterChange = (selectedOptions, { name }) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [name]: selectedOptions || [],
    }));
  };

  const filteredCourses = courses.filter((course) => {
    const departmentMatch =
      selectedFilters.department.length === 0 ||
      selectedFilters.department.some((filter) => filter.value === course.department);
    const classMatch =
      selectedFilters.class.length === 0 ||
      selectedFilters.class.some((filter) => filter.value === course.class);
    const facultyMatch =
      selectedFilters.faculty.length === 0 ||
      selectedFilters.faculty.some((filter) => filter.value === course.faculty);
    return departmentMatch && classMatch && facultyMatch;
  });

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCourse = {
      name: formData.get('name'),
      department: formData.get('department'),
      class: formData.get('class'),
      faculty: formData.get('faculty'),
    };
    try {
      const addedCourse = await handleFormSubmit(newCourse);
      setCourses((prev) => [...prev, addedCourse]);
      setViewMode('list');
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleFileParse = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('Parsed data:', results.data);
        // TODO: Send parsed data to API or merge with existing courses
      },
      error: (err) => {
        console.error('CSV parsing error:', err);
        alert('Failed to parse CSV file.');
      },
    });
  };

  return (
    <Layout title="Courses">
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 md:mb-0 text-left">Courses</h1>
        <div className="flex flex-col md:flex-row md:space-x-2 w-full md:w-auto">
          {['list', 'import', 'add'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded w-full md:w-auto ${
                viewMode === mode ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
              }`}
            >
              {mode === 'list' ? 'View Courses' : mode === 'import' ? 'Import File' : 'Add Course'}
            </button>
          ))}
        </div>
      </div>

        {/* List View */}
        {viewMode === 'list' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {['department', 'class', 'faculty'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <Select
                    isMulti
                    name={field}
                    options={filterOptions[field]}
                    value={selectedFilters[field]}
                    onChange={handleFilterChange}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
              ))}
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              {filteredCourses.length === 0 ? (
                <p className="text-gray-500">No courses match the selected filters.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <li key={course.id} className="py-4">
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                      <p className="text-sm text-gray-500">
                        Department: {course.department}, Class: {course.class}, Faculty: {course.faculty}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* Import View */}
        {viewMode === 'import' && (
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Import Courses</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {['department', 'class', 'faculty'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <Select
                    isMulti
                    name={field}
                    options={filterOptions[field]}
                    value={selectedFilters[field]}
                    onChange={handleFilterChange}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
              ))}
            </div>

            <FileUpload
              accept=".csv"
              maxSize={5}
              requiredFields={requiredFields}
              onFileSelect={handleFileParse}
              label="Import Courses"
              helpText={`CSV must contain: ${requiredFields.map(f => `"${f}"`).join(', ')}`}
            />
          </div>
        )}

        {/* Add View */}
        {viewMode === 'add' && (
          <div className="bg-white shadow rounded-lg p-4">
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
              {['department', 'class', 'faculty'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <select
                    name={field}
                    id={field}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select {field}</option>
                    {filterOptions[field].map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
