import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiHash, FiBook, FiClock } from 'react-icons/fi';

export default function CourseForm({ 
  course = null, 
  onSubmit, 
  departments = []
}) {
  const [formData, setFormData] = useState({
    name: '',
    course_code: '',
    departmentId: '',
    credit_hours: 3,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If course data is provided, update the form
    if (course) {
      setFormData({
        id: course.id,
        name: course.name || '',
        course_code: course.course_code || '',
        departmentId: course.departmentId?.toString() || '',
        credit_hours: course.credit_hours || 3,
      });
    } else {
      // Reset form for new course
      setFormData({
        name: '',
        course_code: '',
        departmentId: '',
        credit_hours: 3,
      });
    }
  }, [course]);

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
      newErrors.name = 'Course name is required';
    }
    
    if (!formData.course_code.trim()) {
      newErrors.course_code = 'Course code is required';
    }
    
    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }
    
    if (!formData.credit_hours || formData.credit_hours < 1) {
      newErrors.credit_hours = 'Credit hours must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Convert to appropriate data types
      const submissionData = {
        ...formData,
        departmentId: parseInt(formData.departmentId),
        credit_hours: parseInt(formData.credit_hours),
      };
      
      onSubmit(submissionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label flex items-center">
            <FiBook className="mr-2 text-gray-500" />
            Course Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter course name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Course Code */}
        <div className="form-group">
          <label htmlFor="course_code" className="form-label flex items-center">
            <FiHash className="mr-2 text-gray-500" />
            Course Code
          </label>
          <input
            type="text"
            id="course_code"
            name="course_code"
            value={formData.course_code}
            onChange={handleChange}
            className={`input ${errors.course_code ? 'border-red-500' : ''}`}
            placeholder="Enter course code (e.g., CS101)"
          />
          {errors.course_code && <p className="mt-1 text-xs text-red-500">{errors.course_code}</p>}
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

        {/* Credit Hours */}
        <div className="form-group">
          <label htmlFor="credit_hours" className="form-label flex items-center">
            <FiClock className="mr-2 text-gray-500" />
            Credit Hours
          </label>
          <input
            type="number"
            id="credit_hours"
            name="credit_hours"
            value={formData.credit_hours}
            onChange={handleChange}
            min="1"
            max="6"
            className={`input ${errors.credit_hours ? 'border-red-500' : ''}`}
          />
          {errors.credit_hours && <p className="mt-1 text-xs text-red-500">{errors.credit_hours}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          {course ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
}
