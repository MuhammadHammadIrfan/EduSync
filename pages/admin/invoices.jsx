import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  FiPlus,
  FiDollarSign,
  FiCheck,
  FiDownload,
  FiClock
} from 'react-icons/fi';
import Layout from '../../components/Layout';
import DataTable from '../../components/DataTable';
import InvoiceForm from '../../components/InvoiceForm';
import {
  getInvoices,
  getUsers,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoicePaid,
  generateInvoicesForAll
} from '../../utils/adminApi';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    month: null,
    categories: []
  });
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateData, setGenerateData] = useState({
    categories: [],
    departments: [],
    month: null,
    amount: ''
  });

  const categoryOptions = [
    { value: 'hostel', label: 'Hostel' },
    { value: 'exam', label: 'Exam' },
    { value: 'semester', label: 'Semester' }
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const studentsData = await getUsers({ role: 'student' });
        setStudents(studentsData);

        const uniqueDepartments = [
          ...new Set(studentsData.map((s) => s.department))
        ].map((dept) => ({ label: dept, value: dept }));
        setDepartments(uniqueDepartments);

        await fetchInvoices();
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const allInvoices = await getInvoices({});
      setInvoices(allInvoices);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  const handleFormSubmit = async (invoiceData) => {
    try {
      if (selectedInvoice) {
        await updateInvoice(selectedInvoice.id, invoiceData);
      } else {
        await createInvoice(invoiceData);
      }
      setSelectedInvoice(null);
      setShowAddForm(false);
      fetchInvoices();
    } catch (error) {
      console.error('Failed to save invoice:', error);
      alert('Failed to save invoice. Please try again.');
    }
  };

  const handleGenerateInvoices = async () => {
    const { categories, departments, month, amount } = generateData;
    if (!categories.length || !departments.length || !month || !amount) {
      alert('Please fill all fields.');
      return;
    }

    const selectedStudents = students.filter((s) =>
      departments.includes(s.department)
    );

    try {
      await generateInvoicesForAll({
        students: selectedStudents,
        categories,
        month,
        amount
      });
      setShowGenerateModal(false);
      fetchInvoices();
    } catch (error) {
      console.error('Failed to generate invoices:', error);
    }
  };

  const columns = [
    { key: 'invoice_number', label: 'Invoice #' },
    {
      key: 'student',
      label: 'Student',
      render: (row) => {
        const student = students.find((s) => s.id === row.studentId);
        return student ? student.name : 'N/A';
      }
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(row.amount)
    },
    {
      key: 'due_date',
      label: 'Due Date',
      render: (row) => new Date(row.due_date).toLocaleDateString()
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            row.paid
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.paid ? 'Paid' : 'Unpaid'}
        </span>
      )
    },
    {
      key: 'generated_at',
      label: 'Generated On',
      render: (row) => new Date(row.generated_at).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          {!row.paid && (
            <button
              onClick={() => markInvoicePaid(row.id).then(fetchInvoices)}
              className="p-1 text-green-600 hover:text-green-900"
              title="Mark as Paid"
            >
              <FiCheck className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() =>
              window.open(`/api/admin/invoices/${row.id}/pdf`, '_blank')
            }
            className="p-1 text-blue-600 hover:text-blue-900"
            title="Download PDF"
          >
            <FiDownload className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  const handleResetFilters = () => {
    setFilters({
      status: '',
      month: null,
      categories: []
    });
  };

  return (
    <>
      <Layout title="Invoices">
        <Head>
          <title>Invoice Management | EduSync</title>
        </Head>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Invoice Management
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedInvoice(null);
                  setShowAddForm(true);
                }}
                className="btn btn-primary flex items-center"
              >
                <FiPlus className="mr-2" />
                Create Invoice
              </button>
              <button
                onClick={() => setShowGenerateModal(true)}
                className="btn btn-secondary flex items-center"
              >
                <FiDollarSign className="mr-2" />
                Generate All
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <Select
              options={[{ label: 'Pending', value: 'pending' }, { label: 'Overdue', value: 'overdue' }]}
              placeholder="Filter by Status"
              onChange={(opt) =>
                setFilters((prev) => ({ ...prev, status: opt?.value || '' }))
              }
              isClearable
              className="w-full md:w-64"
            />
            <DatePicker
              selected={filters.month}
              onChange={(date) =>
                setFilters((prev) => ({ ...prev, month: date }))
              }
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              placeholderText="Select Month"
              className="border px-4 py-2 rounded w-full md:w-64"
            />
            <Select
              isMulti
              options={categoryOptions}
              onChange={(selectedOptions) =>
                setFilters((prev) => ({
                  ...prev,
                  categories: selectedOptions.map((option) => option.value)
                }))
              }
              placeholder="Select Categories"
              className="w-full md:w-64"
            />
            <button
              onClick={handleResetFilters}
              className="btn btn-danger md:w-32 mt-4 md:mt-0"
            >
              Reset Filters
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  {selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}
                </h2>
                <button
                  className="text-sm text-red-500 hover:underline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
              <InvoiceForm
                invoice={selectedInvoice}
                onSubmit={handleFormSubmit}
                students={students}
              />
            </div>
          )}

          {/* Tabular Layout (Visible on Medium Screens and Larger) */}
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={invoices}
              pagination={true}
              itemsPerPage={10}
            />
          </div>

          {/* Card Layout (Visible on Small Screens) */}
          <div className="md:hidden">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="text-lg font-semibold">{invoice.invoice_number}</h3>
                <p><strong>Student:</strong> {students.find(s => s.id === invoice.studentId)?.name || 'N/A'}</p>
                <p><strong>Amount:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.amount)}</p>
                <p><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {invoice.paid ? 'Paid' : 'Unpaid'}</p>
                <p><strong>Generated On:</strong> {new Date(invoice.generated_at).toLocaleDateString()}</p>
                <div className="flex space-x-2">
                  {!invoice.paid && (
                    <button
                      onClick={() => markInvoicePaid(invoice.id).then(fetchInvoices)}
                      className="p-2 text-green-600 hover:text-green-900"
                      title="Mark as Paid"
                    >
                      <FiCheck className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      window.open(`/api/admin/invoices/${invoice.id}/pdf`, '_blank')
                    }
                    className="p-2 text-blue-600 hover:text-blue-900"
                    title="Download PDF"
                  >
                    <FiDownload className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate All Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">
                Generate Invoices for All Students
              </h2>

              <div className="space-y-4">
                <label>
                  Categories:
                  <Select
                    isMulti
                    options={categoryOptions}
                    onChange={(opt) =>
                      setGenerateData((prev) => ({
                        ...prev,
                        categories: opt.map((o) => o.value)
                      }))
                    }
                  />
                </label>

                <label>
                  Departments:
                  <Select
                    isMulti
                    options={departments}
                    onChange={(opt) =>
                      setGenerateData((prev) => ({
                        ...prev,
                        departments: opt.map((o) => o.value)
                      }))
                    }
                  />
                </label>

                <label>
                  Month:
                  <DatePicker
                    selected={generateData.month}
                    onChange={(date) =>
                      setGenerateData((prev) => ({ ...prev, month: date }))
                    }
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    className="border px-4 py-2 rounded w-full"
                  />
                </label>

                <label>
                  Amount:
                  <input
                    type="number"
                    value={generateData.amount}
                    onChange={(e) =>
                      setGenerateData((prev) => ({
                        ...prev,
                        amount: e.target.value
                      }))
                    }
                    className="border px-4 py-2 rounded w-full"
                  />
                </label>

                <div className="flex justify-end space-x-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowGenerateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleGenerateInvoices}
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}
