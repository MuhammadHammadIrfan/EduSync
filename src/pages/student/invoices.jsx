"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { FileText, Download, Calendar, User, Mail, Briefcase, Users, Building, Filter, Loader2 } from "lucide-react"
import StudentSidebar from "../../components/StudentSidebar"
import { getStudentInvoices, getCurrentStudent } from "../../utils/api"

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [yearFilter, setYearFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    async function fetchData() {
      try {
        const [invoicesData, studentData] = await Promise.all([getStudentInvoices(), getCurrentStudent()])
        setInvoices(invoicesData)
        setStudent(studentData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load invoice data")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Group invoices by year
  const groupInvoicesByYear = (invoices) => {
    const grouped = {}

    invoices.forEach((invoice) => {
      const year = invoice.academicYear
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(invoice)
    })

    // Sort years in descending order
    return Object.keys(grouped)
      .sort((a, b) => b - a)
      .map((year) => ({
        year,
        invoices: grouped[year].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)),
      }))
  }

  // Filter invoices based on selected filters
  const getFilteredInvoices = () => {
    let filtered = [...invoices]

    if (yearFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.academicYear === yearFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter)
    }

    return groupInvoicesByYear(filtered)
  }

  // Get unique years from invoices
  const getYears = () => {
    const years = new Set(invoices.map((invoice) => invoice.academicYear))
    return Array.from(years).sort((a, b) => b - a)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle download invoice
  const handleDownload = (invoiceId) => {
    // This would be replaced with actual PDF generation and download logic
    console.log(`Downloading invoice ${invoiceId}`)
    alert(`Download functionality will be implemented in the future. Invoice ID: ${invoiceId}`)
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Unpaid":
        return "bg-red-100 text-red-800"
      case "Partial":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Render invoice card
  const renderInvoiceCard = (invoice) => {
    return (
      <div key={invoice.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-800">{invoice.invoiceNumber}</h3>
              <p className="text-sm text-gray-500">{invoice.description}</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-sm font-medium text-gray-800">{formatCurrency(invoice.amount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Semester</p>
              <p className="text-sm font-medium text-gray-800">{invoice.semester}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Issue Date</p>
              <p className="text-sm font-medium text-gray-800">{formatDate(invoice.issueDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="text-sm font-medium text-gray-800">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <button
              onClick={() => handleDownload(invoice.id)}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download as PDF
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render invoice table row
  const renderInvoiceTableRow = (invoice) => {
    return (
      <tr key={invoice.id} className="hover:bg-gray-50">
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-800">{invoice.invoiceNumber}</div>
          <div className="text-xs text-gray-500">{invoice.description}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm text-gray-800">{formatCurrency(invoice.amount)}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm text-gray-800">{invoice.semester}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm text-gray-800">{formatDate(invoice.issueDate)}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm text-gray-800">{formatDate(invoice.dueDate)}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}>
            {invoice.status}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-right">
          <button
            onClick={() => handleDownload(invoice.id)}
            className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Download
          </button>
        </td>
      </tr>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Invoices | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <StudentSidebar activePage="invoices" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Invoices</h1>

          {loading ? (
            <div className="flex justify-center items-center py-16 bg-white rounded-lg shadow">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 bg-white rounded-lg shadow">{error}</div>
          ) : (
            <>
              {/* Student Information Card */}
              {student && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Student Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-medium text-gray-800">{student.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-800">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Briefcase className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Student ID</p>
                        <p className="text-sm font-medium text-gray-800">{student.studentId}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Building className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Department</p>
                        <p className="text-sm font-medium text-gray-800">{student.department}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Class & Section</p>
                        <p className="text-sm font-medium text-gray-800">
                          {student.class} - Section {student.section}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-medium text-gray-800 mb-4 sm:mb-0 flex items-center">
                    <Filter className="h-5 w-5 text-gray-500 mr-2" />
                    Filters
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div>
                      <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="all">All Years</option>
                        {getYears().map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="all">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Partial">Partial</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoices */}
              {getFilteredInvoices().length > 0 ? (
                getFilteredInvoices().map((group) => (
                  <div key={group.year} className="mb-8">
                    <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      Academic Year {group.year}
                    </h2>

                    {/* Table view for larger screens */}
                    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Invoice
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Amount
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Semester
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Issue Date
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Due Date
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {group.invoices.map((invoice) => renderInvoiceTableRow(invoice))}
                        </tbody>
                      </table>
                    </div>

                    {/* Card view for mobile */}
                    <div className="md:hidden grid grid-cols-1 gap-4">
                      {group.invoices.map((invoice) => renderInvoiceCard(invoice))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No Invoices Found</h3>
                  <p className="text-gray-500">There are no invoices matching your current filters.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
