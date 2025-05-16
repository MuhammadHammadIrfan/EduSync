import { requireRole } from '@/lib/requireRole';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  FiPlus,
  FiDollarSign,
  FiCheck,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiInfo
} from 'react-icons/fi';
import Layout from '../../components/components/Layout';
import Select from 'react-select';
import { getInvoices, markInvoicePaid } from '../../../utils/api/admin';

export async function getServerSideProps(context) {
  return requireRole(context, "admin");
}

export default function Invoices() {
  // Core state
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(10);

  // Calculate pagination values
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  // Filter options
  const statusOptions = [
    { value: 'paid', label: 'Paid Invoices' },
    { value: 'unpaid', label: 'Unpaid Invoices' }
  ];

  // Fetch invoices based on filter
  const fetchInvoices = async (status) => {
    if (!status) {
      setFilteredInvoices([]);
      return;
    }

    setLoading(true);
    try {
      // Convert status option to boolean for API query
      const isPaid = status === 'paid';
      
      // Use the getInvoices function with status filter
      const data = await getInvoices({ status: isPaid ? 'paid' : 'unpaid' });
      
      // Store all invoices
      setInvoices(data || []);
      
      // Filter based on paid status
      setFilteredInvoices(data.filter(invoice => 
        status === 'paid' ? invoice.paid : !invoice.paid
      ));
      
      // Reset to first page when filter changes
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setNotification({
        type: 'error',
        message: 'Failed to fetch invoices'
      });
    } finally {
      setLoading(false);
    }
  };

  // Update filter and fetch invoices
  const handleStatusChange = (selected) => {
    setActiveFilter(selected);
    fetchInvoices(selected?.value);
  };

  // Handle marking invoice as paid
  const handleMarkPaid = async (invoiceId) => {
    if (window.confirm('Are you sure you want to mark this invoice as paid?')) {
      setLoading(true);
      try {
        await markInvoicePaid(invoiceId);
        
        // Refresh invoices with current filter
        if (activeFilter?.value) {
          fetchInvoices(activeFilter.value);
        }
        
        setNotification({
          type: 'success',
          message: 'Invoice marked as paid successfully'
        });
      } catch (error) {
        console.error('Error marking invoice as paid:', error);
        setNotification({
          type: 'error',
          message: 'Failed to mark invoice as paid'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Show notification about upcoming features
  const showFeatureNotification = (feature) => {
    setNotification({
      type: 'info',
      message: `${feature} functionality will be implemented later.`
    });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Layout title="Invoices">
      <Head>
        <title>Invoice Management | EduSync</title>
      </Head>

      <div className="p-6 bg-gray-100 min-h-screen space-y-6">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-md ${
            notification.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
            notification.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
            'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiInfo className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm">{notification.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Non-blocking loading indicator */}
        {loading && (
          <div className="fixed top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-50 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            <p className="text-sm">Loading invoices...</p>
          </div>
        )}
        
        {/* Header with action buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Invoice Management</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Highlighted Create Invoice button */}
            <button 
              onClick={() => showFeatureNotification('Create Invoice')} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow flex items-center justify-center font-medium transition-colors duration-200 relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-3 bg-blue-800 transform -skew-x-12 group-hover:w-full group-hover:skew-x-0 transition-all duration-300"></div>
              <FiPlus className="mr-1.5 relative z-10" size={18} /> 
              <span className="relative z-10">Create Invoice</span>
            </button>
            
            {/* Highlighted Generate Invoices button */}
            <button 
              onClick={() => showFeatureNotification('Generate Invoices')} 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow flex items-center justify-center font-medium transition-colors duration-200 relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-3 bg-green-800 transform -skew-x-12 group-hover:w-full group-hover:skew-x-0 transition-all duration-300"></div>
              <FiDollarSign className="mr-1.5 relative z-10" size={18} /> 
              <span className="relative z-10">Generate Invoices</span>
            </button>
          </div>
        </div>

        {/* Status filter */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Filter Invoices</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Status
              </label>
              <Select
                options={statusOptions}
                value={activeFilter}
                onChange={handleStatusChange}
                placeholder="Select status to view invoices"
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
              />
            </div>
          </div>
        </div>

        {/* Invoices table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {!activeFilter ? (
            <div className="p-8 text-center">
              <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No invoices to display</h3>
              <p className="mt-1 text-gray-500">
                Select "Paid Invoices" or "Unpaid Invoices" from the filter above to view invoices.
              </p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-8 text-center">
              <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No matching invoices</h3>
              <p className="mt-1 text-gray-500">
                There are no {activeFilter.value === 'paid' ? 'paid' : 'unpaid'} invoices to display.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Invoice #</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Generated On</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentInvoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {invoice.invoice_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {invoice.student?.name || `Student #${invoice.studentId}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(invoice.due_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            invoice.paid 
                              ? 'bg-green-100 text-green-800' 
                              : new Date(invoice.due_date) < new Date() 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {invoice.paid 
                              ? 'Paid' 
                              : new Date(invoice.due_date) < new Date()
                                ? 'Overdue'
                                : 'Unpaid'
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(invoice.generated_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            {!invoice.paid && (
                              <button
                                onClick={() => handleMarkPaid(invoice.id)}
                                className="p-1 text-green-600 hover:text-green-900"
                                title="Mark as Paid"
                              >
                                <FiCheck className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              onClick={() => showFeatureNotification('Download Invoice')}
                              className="p-1 text-blue-600 hover:text-blue-900"
                              title="Download PDF"
                            >
                              <FiDownload className="h-5 w-5" />
                            </button>
                          </div>
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
                    disabled={currentPage >= totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage >= totalPages
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
                      Showing <span className="font-medium">{indexOfFirstInvoice + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastInvoice, filteredInvoices.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredInvoices.length}</span> invoices
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
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => paginate(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={nextPage}
                        disabled={currentPage >= totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage >= totalPages
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
      </div>
    </Layout>
  );
}