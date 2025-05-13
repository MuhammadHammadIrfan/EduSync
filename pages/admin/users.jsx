import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Papa from 'papaparse';
import Layout from '../../components/Layout';
import UserForm from '../../components/UserForm';
import FileUpload from '../../components/FileUpload';
import Select from 'react-select';
import {
  getDepartments,
  getClasses,
  getSections,
  createUser,
  updateUser,
} from '../../utils/adminApi';

export default function Users() {
  const [userType, setUserType] = useState('student');
  const [action, setAction] = useState('add');
  const [activeTab, setActiveTab] = useState('manual');
  const [selectedUser, setSelectedUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [usersData, setUsersData] = useState([]);

  const userTypeOptions = [
    { value: 'student', label: 'Students' },
    { value: 'faculty', label: 'Faculty' },
  ];

  const actionOptions = [
    { value: 'add', label: 'Add Users' },
    { value: 'edit', label: 'Edit User' },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const dept = await getDepartments();
        const cls = await getClasses();
        const sec = await getSections();
        setDepartments(dept);
        setClasses(cls);
        setSections(sec);
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const handleFormSubmit = async (userData) => {
    try {
      if (selectedUser || action === 'edit') {
        await updateUser(selectedUser?.id || 'mockId', userData);
        alert('User updated successfully.');
      } else {
        await createUser(userData);
        alert('User created successfully.');
      }
      setSelectedUser(null);
    } catch (error) {
      console.error('User save error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleFileSelect = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields.map((h) => h.trim().toLowerCase());
        const allowed = ['name', 'email'];

        const isValid =
          headers.length === allowed.length &&
          allowed.every((field) => headers.includes(field));

        if (!isValid) {
          alert("CSV must contain only 'name' and 'email' fields.");
          return;
        }

        setUsersData(results.data);
        alert('File parsed successfully. You may now send this data to the server.');
      },
      error: (err) => {
        console.error('CSV error:', err);
        alert('Error reading CSV file.');
      },
    });
  };

  return (
    <Layout title="User Management">
      <Head>
        <title>User Management | EduSync</title>
      </Head>

      <div className="p-4 md:p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT PANEL */}
          <div className="bg-white shadow rounded-lg p-4 w-full md:w-1/4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Options</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">User Type</label>
                <Select
                  options={userTypeOptions}
                  value={userTypeOptions.find((opt) => opt.value === userType)}
                  onChange={(selected) => setUserType(selected.value)}
                  className="mt-1 text-sm"
                  classNamePrefix="select"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Action</label>
                <Select
                  options={actionOptions}
                  value={actionOptions.find((opt) => opt.value === action)}
                  onChange={(selected) => {
                    setAction(selected.value);
                    setActiveTab('manual');
                  }}
                  className="mt-1 text-sm"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white shadow rounded-lg p-4 w-full md:w-3/4">
            {action === 'add' && (
              <div className="flex space-x-2 border-b mb-4">
                <button
                  className={`flex-1 text-center py-2 text-sm font-medium ${
                    activeTab === 'manual'
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('manual')}
                >
                  Add Manually
                </button>
                <button
                  className={`flex-1 text-center py-2 text-sm font-medium ${
                    activeTab === 'excel'
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('excel')}
                >
                  Upload Excel
                </button>
              </div>
            )}

            {/* CONTENT */}
            {activeTab === 'manual' || action === 'edit' ? (
              <>
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  {action === 'edit' ? 'Edit User' : 'Add New User'} Manually
                </h3>
                <UserForm
                  user={selectedUser}
                  type={userType}
                  onSubmit={handleFormSubmit}
                  departments={departments}
                  classes={classes}
                  sections={sections}
                />
              </>
            ) : (
              <>
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Import {userType === 'student' ? 'Students' : 'Faculty'} from Excel
                </h3>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  label={`Upload ${userType === 'student' ? 'Students' : 'Faculty'} CSV`}
                  helpText="Only 'name' and 'email' columns are allowed in the file."
                  requiredFields={['name', 'email']}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
