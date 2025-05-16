import React, { useState, useEffect } from 'react';
import { FiUser, FiDollarSign, FiCalendar, FiHash } from 'react-icons/fi';

export default function InvoiceForm({ invoice = null, onSubmit, students = [] }) {
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    due_date: '',
    paid: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If invoice data is provided, update the form
    if (invoice) {
      setFormData({
        id: invoice.id,
        invoice_number: invoice.invoice_number || '',
        studentId: invoice.studentId?.toString() || '',
        amount: invoice.amount?.toString() || '',
        due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
        paid: invoice.paid || false,
      });
    } else {
      // Reset form for new invoice
      setFormData({
        studentId: '',
        amount: '',
        due_date: '',
        paid: false,
      });
    }
  }, [invoice]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear validation error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.studentId) {
      newErrors.studentId = 'Student is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
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
        studentId: parseInt(formData.studentId),
        amount: parseFloat(formData.amount),
      };
      
      onSubmit(submissionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student */}
        <div className="form-group">
          <label htmlFor="studentId" className="form-label flex items-center">
            <FiUser className="mr-2 text-gray-500" />
            Student
          </label>
          <select
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className={`input ${errors.studentId ? 'border-red-500' : ''}`}
          >
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id.toString()}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>
          {errors.studentId && <p className="mt-1 text-xs text-red-500">{errors.studentId}</p>}
        </div>

        {/* Invoice Number (read-only for existing invoices) */}
        {invoice && (
          <div className="form-group">
            <label htmlFor="invoice_number" className="form-label flex items-center">
              <FiHash className="mr-2 text-gray-500" />
              Invoice Number
            </label>
            <input
              type="text"
              id="invoice_number"
              name="invoice_number"
              value={formData.invoice_number}
              readOnly
              className="input bg-gray-100"
            />
          </div>
        )}

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount" className="form-label flex items-center">
            <FiDollarSign className="mr-2 text-gray-500" />
            Amount
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`input ${errors.amount ? 'border-red-500' : ''}`}
            placeholder="Enter amount"
          />
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
        </div>

        {/* Due Date */}
        <div className="form-group">
          <label htmlFor="due_date" className="form-label flex items-center">
            <FiCalendar className="mr-2 text-gray-500" />
            Due Date
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className={`input ${errors.due_date ? 'border-red-500' : ''}`}
          />
          {errors.due_date && <p className="mt-1 text-xs text-red-500">{errors.due_date}</p>}
        </div>

        {/* Paid Status */}
        <div className="form-group flex items-center space-x-2">
          <input
            type="checkbox"
            id="paid"
            name="paid"
            checked={formData.paid}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="paid" className="text-sm font-medium text-gray-700">
            Mark as Paid
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </button>
      </div>
    </form>
  );
}
