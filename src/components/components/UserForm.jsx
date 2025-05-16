import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiKey, FiBookOpen, FiUsers, FiHash } from 'react-icons/fi';

export default function UserForm({ 
  user = null, 
  type = 'student', 
  onSubmit, 
  departments = [], 
  classes = [], 
  sections = [] 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    departmentId: '',
    classId: '',
    sectionId: '',
    role: type,
  });

  const [filteredClasses, setFilteredClasses] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If user data is provided, update the form
    if (user) {
      setFormData({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't populate password for security
        departmentId: user.departmentId?.toString() || '',
        classId: user.classId?.toString() || '',
        sectionId: user.sectionId?.toString() || '',
        role: type,
      });
    } else {
      // Reset form for new user
      setFormData({
        name: '',
        email: '',
        password: '',
        departmentId: '',
        classId: '',
        sectionId: '',
        role: type,
      });
    }
  }, [user, type]);

  useEffect(() => {
    // Filter classes based on selected department
    if (formData.departmentId) {
      const filtered = classes.filter(c => c.departmentId.toString() === formData.departmentId);
      setFilteredClasses(filtered);
      
      // Reset classId if selected class is not in filtered list
      if (filtered.length > 0 && formData.classId && !filtered.find(c => c.id.toString() === formData.classId)) {
        setFormData(prev => ({ ...prev, classId: '', sectionId: '' }));
      }
    } else {
      setFilteredClasses([]);
      setFormData(prev => ({ ...prev, classId: '', sectionId: '' }));
    }
  }, [formData.departmentId, classes]);

  useEffect(() => {
    // Filter sections based on selected class
    if (formData.classId) {
      const filtered = sections.filter(s => s.classId.toString() === formData.classId);
      setFilteredSections(filtered);
      
      // Reset sectionId if selected section is not in filtered list
      if (filtered.length > 0 && formData.sectionId && !filtered.find(s => s.id.toString() === formData.sectionId)) {
        setFormData(prev => ({ ...prev, sectionId: '' }));
      }
    } else {
      setFilteredSections([]);
      setFormData(prev => ({ ...prev, sectionId: '' }));
    }
  }, [formData.classId, sections]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!user && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!user && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }
    
    if (type === 'student') {
      if (!formData.classId) {
        newErrors.classId = 'Class is required';
      }
      
      if (!formData.sectionId) {
        newErrors.sectionId = 'Section is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Convert IDs to numbers
      const submissionData = {
        ...formData,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
        classId: formData.classId ? parseInt(formData.classId) : undefined,
        sectionId: formData.sectionId ? parseInt(formData.sectionId) : undefined,
      };
      
      onSubmit(submissionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label flex items-center">
            <FiUser className="mr-2 text-gray-500" />
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label flex items-center">
            <FiMail className="mr-2 text-gray-500" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Enter email"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password" className="form-label flex items-center">
            <FiKey className="mr-2 text-gray-500" />
            {user ? 'New Password (leave blank to keep current)' : 'Password'}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`input ${errors.password ? 'border-red-500' : ''}`}
            placeholder={user ? '••••••••' : 'Enter password'}
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        {/* Department */}
        <div className="form-group">
          <label htmlFor="departmentId" className="form-label flex items-center">
            <FiBookOpen className="mr-2 text-gray-500" />
            Department
          </label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className={`input ${errors.departmentId ? 'border-red-500' : ''}`}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id.toString()}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.departmentId && <p className="mt-1 text-xs text-red-500">{errors.departmentId}</p>}
        </div>

        {/* Class (for students only) */}
        {type === 'student' && (
          <div className="form-group">
            <label htmlFor="classId" className="form-label flex items-center">
              <FiUsers className="mr-2 text-gray-500" />
              Class
            </label>
            <select
              id="classId"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              className={`input ${errors.classId ? 'border-red-500' : ''}`}
              disabled={!formData.departmentId}
            >
              <option value="">Select Class</option>
              {filteredClasses.map(cls => (
                <option key={cls.id} value={cls.id.toString()}>
                  {cls.name}
                </option>
              ))}
            </select>
            {errors.classId && <p className="mt-1 text-xs text-red-500">{errors.classId}</p>}
          </div>
        )}

        {/* Section (for students only) */}
        {type === 'student' && (
          <div className="form-group">
            <label htmlFor="sectionId" className="form-label flex items-center">
              <FiHash className="mr-2 text-gray-500" />
              Section
            </label>
            <select
              id="sectionId"
              name="sectionId"
              value={formData.sectionId}
              onChange={handleChange}
              className={`input ${errors.sectionId ? 'border-red-500' : ''}`}
              disabled={!formData.classId}
            >
              <option value="">Select Section</option>
              {filteredSections.map(section => (
                <option key={section.id} value={section.id.toString()}>
                  {section.name}
                </option>
              ))}
            </select>
            {errors.sectionId && <p className="mt-1 text-xs text-red-500">{errors.sectionId}</p>}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          {user ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
}
