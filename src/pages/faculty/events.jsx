"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { CalendarDays, MapPin, Clock, Calendar, Tag, Users, Loader2, Filter } from "lucide-react"
import FacultySidebar from "../../components/FacultySidebar"
import { getUpcomingEventsList } from "../../utils/api"

export default function FacultyEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsData = await getUpcomingEventsList()
        setEvents(eventsData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events data")
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Get unique categories from events
  const getCategories = () => {
    const categories = new Set(events.map((event) => event.category))
    return Array.from(categories).sort()
  }

  // Filter events based on selected filters
  const getFilteredEvents = () => {
    let filtered = [...events]

    if (categoryFilter !== "all") {
      filtered = filtered.filter((event) => event.category === categoryFilter)
    }

    if (departmentFilter !== "all") {
      if (departmentFilter === "my-department") {
        // Filter for events specific to the faculty's department (CS in this case)
        filtered = filtered.filter((event) => event.department_id === 1 || event.department_id === null)
      } else if (departmentFilter === "department-specific") {
        // Filter for events that are department-specific
        filtered = filtered.filter((event) => event.department_id !== null)
      }
    }

    return filtered
  }

  // Group events by month
  const groupEventsByMonth = (events) => {
    const grouped = {}

    events.forEach((event) => {
      const date = new Date(event.event_date)
      const monthYear = date.toLocaleString("default", { month: "long", year: "numeric" })

      if (!grouped[monthYear]) {
        grouped[monthYear] = []
      }

      grouped[monthYear].push(event)
    })

    // Sort events within each month by date
    Object.keys(grouped).forEach((month) => {
      grouped[month].sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    })

    return grouped
  }

  // Format date for display
  const formatEventDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Get days remaining until event
  const getDaysRemaining = (dateString) => {
    const eventDate = new Date(dateString)
    const today = new Date()

    // Reset time to compare just the dates
    today.setHours(0, 0, 0, 0)
    eventDate.setHours(0, 0, 0, 0)

    const diffTime = eventDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    return `${diffDays} days remaining`
  }

  const filteredEvents = getFilteredEvents()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Head>
        <title>Upcoming Events | EduSync</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <FacultySidebar activePage="upcoming-events" />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-5xl mx-auto">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Upcoming Events</h1>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-medium text-gray-800 mb-4 sm:mb-0 flex items-center">
                <Filter className="h-5 w-5 text-blue-500 mr-2" />
                Filters
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="all">All Categories</option>
                    {getCategories().map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="all">All Departments</option>
                    <option value="my-department">My Department</option>
                    <option value="department-specific">Department Specific</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16 bg-white rounded-lg shadow">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 bg-white rounded-lg shadow">{error}</div>
          ) : filteredEvents.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupEventsByMonth(filteredEvents)).map(([month, monthEvents]) => (
                <div key={month} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800 flex items-center">
                      <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                      {month}
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {monthEvents.map((event) => (
                      <div key={event.id} className="p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center mb-1">
                              <h3 className="text-lg font-medium text-gray-800">{event.title}</h3>
                              {event.category && (
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  {event.category}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center text-gray-500">
                                <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                                {formatEventDate(event.event_date)}
                              </div>
                              <div className="flex items-center text-gray-500">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                {event.time}
                              </div>
                              <div className="flex items-center text-gray-500">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                {event.location}
                              </div>
                              {event.organizer && (
                                <div className="flex items-center text-gray-500">
                                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                                  {event.organizer}
                                </div>
                              )}
                              {event.tags && event.tags.length > 0 && (
                                <div className="flex items-center text-gray-500 col-span-2">
                                  <Tag className="h-4 w-4 mr-2 text-gray-400" />
                                  <div className="flex flex-wrap gap-1">
                                    {event.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 md:mt-0 md:ml-6 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getDaysRemaining(event.event_date)}
                            </span>
                            {event.is_mandatory && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1 block">
                                Mandatory
                              </span>
                            )}
                            {event.registration_required && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1 block">
                                Registration Required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">No Events Found</h3>
              <p className="text-gray-500">There are no upcoming events matching your current filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
