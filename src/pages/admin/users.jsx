import { requireRole } from '@/lib/requireRole';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { FiUserPlus, FiUpload, FiFilter, FiX, FiInfo } from 'react-icons/fi';
import FilterBar from '../../components/components/FilterBar';
import Layout from '../../components/components/Layout';
import Papa from 'papaparse';
import DataTable from '../../components/components/DataTable';
import FileUpload from '../../components/components/FileUpload';
import { 
  getUsers, 
  getDepartments, 
  getClasses,
  getSections,
  createUser,
  updateUser,
  deleteUser,
  importUsers
} from '../../../utils/api/admin';

export async function getServerSideProps(context) {
  return requireRole(context, "admin")
}

export default function Users() {
  const [activeTab, setActiveTab] = useState('students');
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false); // Don't start with loading true
  const [dataLoaded, setDataLoaded] = useState(false); // Track if initial data is loaded
  const [tableLoading, setTableLoading] = useState(false); // Separate loading state for table
  const [importLoading, setImportLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    departmentId: '',
    classId: '',
    sectionId: '',
  });
  
  // Debounce timer for filters
  const filterTimer = useRef(null);
  
  // Import form state
  const [importState, setImportState] = useState({
    departmentId: '',
    classId: '',
    sectionId: '',
    csvData: null
  });
  
  // Form data for adding/editing a user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    departmentId: '',
    classId: '',
    sectionId: ''
  });

  // Fetch all reference data only once on component mount
  useEffect(() => {
    let mounted = true;
    
    const fetchReferenceData = async () => {
      try {
        setLoading(true);
        
        // Fetch all reference data in parallel, with error handling for each
        const [departmentsData, classesData, sectionsData] = await Promise.all([
          getDepartments().catch(err => {
            console.error('Failed to fetch departments:', err);
            return [];
          }),
          getClasses().catch(err => {
            console.error('Failed to fetch classes:', err);
            return [];
          }),
          getSections().catch(err => {
            console.error('Failed to fetch sections:', err);
            return [];
          })
        ]);
        
        // Only update state if component is still mounted
        if (mounted) {
          setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
          setClasses(Array.isArray(classesData) ? classesData : []);
          setSections(Array.isArray(sectionsData) ? sectionsData : []);
          setDataLoaded(true);
        }
      } catch (error) {
        console.error('Failed to fetch reference data:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    fetchReferenceData();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  // Fetch users when tab changes or when data operations complete
  // Focus on the problematic useCallback and useEffect code

// Remove 'filters' from dependency array to prevent re-creation on every filter change
  const fetchUsers = useCallback(async (filterParams = filters) => {
    if (!dataLoaded) return; // Don't fetch if reference data isn't loaded yet
    
    try {
      setTableLoading(true);
      
      // Convert filters to query parameters
      const queryParams = {
        role: activeTab === 'students' ? 'student' : 'faculty',
        ...filterParams
      };
      
      const usersData = await getUsers(queryParams);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setTableLoading(false);
    }
  }, [dataLoaded, activeTab]); // Remove filters from dependency array
    
  // When tab changes, reset filters and fetch users
  useEffect(() => {
    if (dataLoaded) {
      // Reset filters when changing tabs
      const resetFilters = {
        search: '',
        departmentId: '',
        classId: '',
        sectionId: '',
      };
      
      setFilters(resetFilters);
      fetchUsers(resetFilters);
    }
  }, [activeTab, dataLoaded, fetchUsers]);
  
  // Reset form data when changing tabs
  useEffect(() => {
    resetFormData();
  }, [activeTab]);
  
  const resetFormData = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      departmentId: '',
      classId: '',
      sectionId: ''
    });
    
    setImportState({
      departmentId: '',
      classId: '',
      sectionId: '',
      csvData: null
    });
  };
  
  // Handle filter changes with debounce
  const handleFilterChange = (newFilters) => {
    // When changing department, reset class and section filters
    if (newFilters.departmentId !== filters.departmentId) {
      newFilters.classId = '';
      newFilters.sectionId = '';
    }
    
    // When changing class, reset section filter
    if (newFilters.classId !== filters.classId) {
      newFilters.sectionId = '';
    }
    
    // Update filters immediately for UI
    setFilters(newFilters);
    
    // Debounce the actual data fetching
    if (filterTimer.current) {
      clearTimeout(filterTimer.current);
    }
    
    filterTimer.current = setTimeout(() => {
      fetchUsers(newFilters);
    }, 500); // Increase to 500ms for more safety
  };

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (filterTimer.current) {
        clearTimeout(filterTimer.current);
      }
    };
  }, []);
  
  // Handle add user button click
  const handleAddUser = () => {
    setSelectedUser(null);
    resetFormData();
    setShowAddForm(true);
    setShowImportForm(false);
  };
  
  // Handle import users button click
  const handleImportUsers = () => {
    setShowImportForm(true);
    setShowAddForm(false);
    resetFormData();
  };
  
  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', // Don't populate password for security
      departmentId: user.departmentId?.toString() || '',
      classId: user.classId?.toString() || '',
      sectionId: user.sectionId?.toString() || ''
    });
    setShowAddForm(true);
    setShowImportForm(false);
  };
  
  // Handle delete user
  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        setTableLoading(true);
        await deleteUser(user.id);
        // Refresh the user list
        await fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user. Please try again.');
      } finally {
        setTableLoading(false);
      }
    }
  };
  
  // Handle input change in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle user form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const userData = {
        ...formData,
        type: activeTab === 'students' ? 'student' : 'faculty'
      };
      
      if (selectedUser) {
        // Update existing user
        await updateUser(selectedUser.id, userData);
      } else {
        // Create new user
        await createUser(userData);
      }
      
      // Reset form state and refresh user list
      setSelectedUser(null);
      setShowAddForm(false);
      resetFormData();
      await fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      alert('Failed to save user: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle CSV file parsing
  const handleCsvParse = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields.map(h => h.trim().toLowerCase());
        const requiredFields = ['name', 'email'];
        
        const hasAllRequiredFields = requiredFields.every(field => headers.includes(field));
        
        if (!hasAllRequiredFields) {
          alert(`Invalid file format. The CSV must contain columns for: ${requiredFields.join(', ')}`);
          return;
        }
        
        // Set the parsed data to state
        setImportState({
          ...importState,
          csvData: results.data
        });
        
        console.log('Parsed CSV data:', results.data);
      },
      error: (err) => {
        console.error('CSV parsing error:', err);
        alert('Failed to parse the CSV file. Please check the format and try again.');
      }
    });
  };
  
  // Handle import form field changes
  const handleImportFieldChange = (e) => {
    const { name, value } = e.target;
    
    // When changing department, reset class and section
    if (name === 'departmentId' && value !== importState.departmentId) {
      setImportState({
        ...importState,
        [name]: value,
        classId: '',
        sectionId: ''
      });
    }
    // When changing class, reset section
    else if (name === 'classId' && value !== importState.classId) {
      setImportState({
        ...importState,
        [name]: value,
        sectionId: ''
      });
    }
    else {
      setImportState({
        ...importState,
        [name]: value
      });
    }
  };
  
  // Handle CSV import submission
  const handleImportSubmit = async (e) => {
    e.preventDefault();
    
    // Validate import data
    if (!importState.departmentId) {
      alert('Please select a department');
      return;
    }
    
    if (activeTab === 'students' && (!importState.classId || !importState.sectionId)) {
      alert('Please select both class and section for student imports');
      return;
    }
    
    if (!importState.csvData || importState.csvData.length === 0) {
      alert('Please upload a valid CSV file with user data');
      return;
    }
    
    try {
      setImportLoading(true);
      
      // Prepare data for import API
      const importData = {
        type: activeTab === 'students' ? 'student' : 'faculty',
        departmentId: importState.departmentId,
        classId: importState.classId,
        sectionId: importState.sectionId,
        users: importState.csvData
      };
      
      // Make API request to import users
      const result = await importUsers(importData);
      
      // Show results
      alert(`Import completed: ${result.success} users imported successfully, ${result.failed} failed.`);
      
      // Reset import form and refresh users
      setShowImportForm(false);
      resetFormData();
      await fetchUsers();
    } catch (error) {
      console.error('Failed to import users:', error);
      alert('Failed to import users: ' + (error.message || 'Unknown error'));
    } finally {
      setImportLoading(false);
    }
  };
  
  // Define columns for the data table
  const studentColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'department', 
      label: 'Department',
      render: (row) => {
        const dept = departments.find(d => d.id === row.departmentId);
        return dept ? dept.name : 'N/A';
      }
    },
    { 
      key: 'class', 
      label: 'Class',
      render: (row) => {
        const cls = classes.find(c => c.id === row.classId);
        return cls ? cls.name : 'N/A';
      }
    },
    { 
      key: 'section', 
      label: 'Section',
      render: (row) => {
        const sec = sections.find(s => s.id === row.sectionId);
        return sec ? sec.name : 'N/A';
      }
    },
  ];
  
  const facultyColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'department', 
      label: 'Department',
      render: (row) => {
        const dept = departments.find(d => d.id === row.departmentId);
        return dept ? dept.name : 'N/A';
      }
    },
  ];
  
  // Generate filter options for each dropdown
  const filterOptions = activeTab === 'students' 
    ? [
        { 
          key: 'departmentId', 
          label: 'Department', 
          type: 'select', 
          options: departments.map(dept => ({ value: dept.id, label: dept.name }))
        },
        { 
          key: 'classId', 
          label: 'Class', 
          type: 'select', 
          options: classes
            .filter(cls => !filters.departmentId || cls.departmentId === parseInt(filters.departmentId, 10))
            .map(cls => ({ value: cls.id, label: cls.name }))
        },
        { 
          key: 'sectionId', 
          label: 'Section', 
          type: 'select', 
          options: sections
            .filter(sec => !filters.classId || sec.classId === parseInt(filters.classId, 10))
            .map(sec => ({ value: sec.id, label: sec.name }))
        },
      ]
    : [
        { 
          key: 'departmentId', 
          label: 'Department', 
          type: 'select', 
          options: departments.map(dept => ({ value: dept.id, label: dept.name }))
        }
      ];

  return (
    <Layout title="User Management">
      <Head>
        <title>User Management | EduSync</title>
      </Head>

      <div className="p-6 bg-gray-100 min-h-screen space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === 'students' ? 'Student Management' : 'Faculty Management'}
          </h1>
          <div className="flex space-x-2">
            <button 
              onClick={handleAddUser} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 flex items-center"
              disabled={loading}
            >
              <FiUserPlus className="mr-2" />
              Add {activeTab === 'students' ? 'Student' : 'Faculty'}
            </button>
            <button 
              onClick={handleImportUsers} 
              className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 flex items-center"
              disabled={loading}
            >
              <FiUpload className="mr-2" />
              Import CSV
            </button>
          </div>
        </div>

        {/* Non-blocking loading indicator */}
        {loading && (
          <div className="fixed top-0 right-0 m-6 bg-white p-4 rounded-lg shadow-lg z-50 flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
            <p>Loading data...</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('students')}
              disabled={loading}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              disabled={loading}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'faculty'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Faculty
            </button>
          </div>
        </div>

        {/* Filters */}
        {dataLoaded && (
          <FilterBar
            filters={filterOptions}
            activeFilters={filters}
            onFilterChange={handleFilterChange}
            disabled={tableLoading}
          />
        )}

        {/* Add/Edit User Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedUser
                  ? `Edit ${activeTab === 'students' ? 'Student' : 'Faculty'}`
                  : `Add New ${activeTab === 'students' ? 'Student' : 'Faculty'}`}
              </h2>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedUser(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* User form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password {selectedUser && <span className="text-xs text-gray-500">(Leave blank to keep unchanged)</span>}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!selectedUser}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    id="departmentId"
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class (for students only) */}
                {activeTab === 'students' && (
                  <div>
                    <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
                      Class
                    </label>
                    <select
                      id="classId"
                      name="classId"
                      value={formData.classId}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!formData.departmentId}
                    >
                      <option value="">Select Class</option>
                      {classes
                        .filter(cls => !formData.departmentId || cls.departmentId === parseInt(formData.departmentId, 10))
                        .map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Section (for students only) */}
                {activeTab === 'students' && (
                  <div>
                    <label htmlFor="sectionId" className="block text-sm font-medium text-gray-700 mb-1">
                      Section
                    </label>
                    <select
                      id="sectionId"
                      name="sectionId"
                      value={formData.sectionId}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!formData.classId}
                    >
                      <option value="">Select Section</option>
                      {sections
                        .filter(sec => !formData.classId || sec.classId === parseInt(formData.classId, 10))
                        .map(sec => (
                          <option key={sec.id} value={sec.id}>
                            {sec.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Form buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : selectedUser ? 'Update' : 'Add'} {activeTab === 'students' ? 'Student' : 'Faculty'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Import Users Form */}
        {showImportForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Import {activeTab === 'students' ? 'Students' : 'Faculty'} from CSV
              </h2>
              <button 
                onClick={() => setShowImportForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 flex items-start">
              <FiInfo className="text-blue-500 mt-1 mr-2 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>CSV Format Instructions:</strong>
                </p>
                <ul className="list-disc ml-5 text-sm text-blue-700">
                  <li>CSV file must contain <strong>name</strong> and <strong>email</strong> columns only</li>
                  <li>Default password will be set to: <strong>{activeTab === 'students' ? 'student@123' : 'faculty@123'}</strong></li>
                  <li>Department{activeTab === 'students' ? ', class, and section' : ''} are selected below</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              {/* Department selection */}
              <div>
                <label htmlFor="import-departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  id="import-departmentId"
                  name="departmentId"
                  value={importState.departmentId}
                  onChange={handleImportFieldChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class selection (students only) */}
              {activeTab === 'students' && (
                <div>
                  <label htmlFor="import-classId" className="block text-sm font-medium text-gray-700 mb-1">
                    Class *
                  </label>
                  <select
                    id="import-classId"
                    name="classId"
                    value={importState.classId}
                    onChange={handleImportFieldChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!importState.departmentId}
                  >
                    <option value="">Select Class</option>
                    {classes
                      .filter(cls => !importState.departmentId || cls.departmentId === parseInt(importState.departmentId, 10))
                      .map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Section selection (students only) */}
              {activeTab === 'students' && (
                <div>
                  <label htmlFor="import-sectionId" className="block text-sm font-medium text-gray-700 mb-1">
                    Section *
                  </label>
                  <select
                    id="import-sectionId"
                    name="sectionId"
                    value={importState.sectionId}
                    onChange={handleImportFieldChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!importState.classId}
                  >
                    <option value="">Select Section</option>
                    {sections
                      .filter(sec => !importState.classId || sec.classId === parseInt(importState.classId, 10))
                      .map(sec => (
                        <option key={sec.id} value={sec.id}>
                          {sec.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* File upload */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV File *
                </label>
                <div className={`border-2 border-dashed p-4 rounded-md ${importState.csvData ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleCsvParse(e.target.files[0]);
                      }
                    }}
                    className="w-full"
                  />
                  {importState.csvData && (
                    <p className="mt-2 text-sm text-green-700">
                      ✓ {importState.csvData.length} users loaded from CSV
                    </p>
                  )}
                </div>
              </div>

              {/* Sample template download */}
              <div className="mt-2 text-sm text-gray-600">
                <p>Download sample CSV template:</p>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    // Generate sample CSV content
                    const headers = "name,email\n";
                    const row1 = "John Smith,john@example.com\n";
                    const row2 = "Jane Doe,jane@example.com\n";
                    const csvContent = headers + row1 + row2;
                    
                    // Create a download link
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${activeTab}-template.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  {activeTab === 'students' ? 'Students' : 'Faculty'} Template.csv
                </a>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowImportForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!importState.departmentId || !importState.csvData || 
                    (activeTab === 'students' && (!importState.classId || !importState.sectionId)) ||
                    importLoading}
                  className={`px-4 py-2 rounded-md ${
                    !importState.departmentId || !importState.csvData || 
                    (activeTab === 'students' && (!importState.classId || !importState.sectionId)) ||
                    importLoading
                      ? 'bg-blue-300 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {importLoading ? 'Importing...' : 'Import Users'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data Table with non-blocking loading indicator */}
        <div className="relative">
          {tableLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                <p>Loading users...</p>
              </div>
            </div>
          )}
          
          <DataTable
            columns={activeTab === 'students' ? studentColumns : facultyColumns}
            data={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            searchable={true}
            pagination={true}
            itemsPerPage={10}
            loading={!dataLoaded} // Only show table loading on initial load
          />
        </div>
      </div>
    </Layout>
  );
}