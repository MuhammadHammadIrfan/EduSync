import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { FiUsers, FiBookOpen, FiCalendar, FiDollarSign } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { getAllAnalytics } from '../../utils/adminApi';
import Link from 'next/link';
// Dynamic import for chart components
const ChartComponent = dynamic(() => import('../../components/ChartComponent'), { ssr: false });
const AttendanceChart = dynamic(() => import('../../components/AttendanceChart'), { ssr: false });

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    studentCount: 0,
    facultyCount: 0,
    courseCount: 0,
    departmentCount: 0,
    revenueData: null,
    departmentDistribution: null,
    facultyPerformance: null,
    attendanceAnalytics: null,
    upcomingEvents: [],
    recentActivities: []
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch analytics data
        const analyticsData = await getAllAnalytics();
        
        // Update state with fetched data
        setStats({
          studentCount: 8, // Would come from a different API endpoint in a real app
          facultyCount: 6,
          courseCount: 9,
          departmentCount: 5,
          revenueData: analyticsData.revenueData,
          departmentDistribution: analyticsData.departmentDistribution,
          facultyPerformance: analyticsData.facultyPerformance,
          attendanceAnalytics: analyticsData.attendanceAnalytics,
          upcomingEvents: [
            { id: 1, title: 'Science Exhibition', date: '2023-08-15' },
            { id: 2, title: 'Career Fair', date: '2023-09-05' },
            { id: 3, title: 'Annual Sports Day', date: '2023-09-20' }
          ],
          recentActivities: [
            { 
              id: 1, 
              user: 'Dr. Sarah Williams',
              action: 'Leave Request Approved',
              timestamp: '2023-08-15T10:00:00Z',
              avatar_color: 'bg-blue-500'
            },
            { 
              id: 2, 
              user: 'Sophia Lee',
              action: 'New Student Registered',
              timestamp: '2023-07-13T11:30:00Z',
              avatar_color: 'bg-green-500'
            },
            { 
              id: 3, 
              user: 'John Smith',
              action: 'Invoice Payment Received',
              timestamp: '2023-08-10T14:30:00Z',
              avatar_color: 'bg-purple-500'
            },
            { 
              id: 4, 
              user: 'Admin',
              action: '10 new students have been registered',
              timestamp: '2023-08-09T11:30:00Z',
              avatar_color: 'bg-orange-500'
            }
          ]
        });
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time relative to current time (e.g., "2 hours ago")
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
    } else if (diffMin > 0) {
      return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <Layout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
                    {/* Welcome message */}
          <h1 className="text-xl font-semibold text-gray-800">Welcome, Admin!</h1>

          {/* Quick Action Cards */}
          
          <div className="bg-white rounded-lg shadow gap-10 mb-10">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition-colors duration-150 text-center">
                <Link href="/admin/users">
                  <FiUsers className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Add User</span>
                </Link>

              </button>
              <button className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg transition-colors duration-150 text-center">
                <Link href="/admin/courses">
                  <FiBookOpen className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Create Course</span>
                </Link>
              </button>
              <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg transition-colors duration-150 text-center">
                <Link href="/admin/events">
                  <FiCalendar className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Schedule Event</span>
                </Link>
              </button>
              <button className="bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-lg transition-colors duration-150 text-center">
                <Link href="/admin/invoices">
                  <FiDollarSign className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Generate Invoice</span>
                </Link>
              </button>
            </div>
          </div>


          {/* Stat cards
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">Statistics</h2>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-18 flex items-center space-x-10 h-68">
              <div className="rounded-full bg-blue-100 p-3">
                <FiUsers className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Users</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-semibold">{stats.studentCount}</p>
                  <p className="text-sm text-gray-500">Students</p>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-semibold">{stats.facultyCount}</p>
                  <p className="text-sm text-gray-500">Faculty</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-18 flex items-center space-x-10 h-68">
              <div className="rounded-full bg-green-100 p-3">
                <FiBookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Academics</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-semibold">{stats.courseCount}</p>
                  <p className="text-sm text-gray-500">Courses</p>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-semibold">{stats.departmentCount}</p>
                  <p className="text-sm text-gray-500">Departments</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-18 flex items-center space-x-10 h-68">
              <div className="rounded-full bg-purple-100 p-3">
                <FiCalendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming events</p>
                <p className="text-2xl font-semibold">{stats.upcomingEvents.length}</p>
                <p className="text-sm text-gray-500">Next: {stats.upcomingEvents[0]?.title}</p>
              </div>
            </div>
            
            
          </div>
          </div>
           */}
          
          
          {/* Analytics section */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-10">
            {/* Attendance Trends */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow p-6 mb-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trends</h2>
              <AttendanceChart 
                data={stats.attendanceAnalytics?.student?.overall || {}} 
                type="student"
              />
            </div>
            
            {/* insert a students per course trend graph */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow p-6 mb-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Students per Course</h2>
              <div className="h-64">
                <ChartComponent
                  type="line"
                  data={{
                    labels: stats.studentsPerCourse?.labels || ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5'],
                    datasets: [
                      {
                        label: 'Number of Students',
                        data: stats.studentsPerCourse?.data || [120, 85, 90, 110, 95],
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Students',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Department distribution */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Department Distribution</h2>
              <div className="h-64">
                <ChartComponent
                  type="bar"
                  data={{
                    labels: stats.departmentDistribution?.labels || ['Science', 'Arts', 'Commerce', 'Engineering', 'Medical'],
                    datasets: [
                      {
                        label: 'Number of Students',
                        data: stats.departmentDistribution?.data || [120, 85, 90, 110, 95],
                        backgroundColor: [
                          'rgba(54, 162, 235, 0.7)',
                          'rgba(255, 99, 132, 0.7)',
                          'rgba(255, 206, 86, 0.7)',
                          'rgba(75, 192, 192, 0.7)',
                          'rgba(153, 102, 255, 0.7)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Students',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          
          
        </div>
      )}
    </Layout>
  );
}