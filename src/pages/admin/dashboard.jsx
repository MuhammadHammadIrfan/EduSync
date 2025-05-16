import { requireRole } from '@/lib/requireRole';
import { useState, useEffect } from 'react';
import Layout from '../../components/components/Layout';
import { FiUsers, FiBookOpen, FiCalendar, FiDollarSign } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { 
  getAdminDashboardStats, 
  getAllAnalytics 
} from '../../../utils/api/admin';

export async function getServerSideProps(context) {
  return requireRole(context, "admin")
}


// Dynamic import for chart components
const ChartComponent = dynamic(() => import('../../components/components/ChartComponent'), { ssr: false });
const AttendanceChart = dynamic(() => import('../../components/components/AttendanceChart'), { ssr: false });

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
        // Get both dashboard stats and analytics
        const [dashboardData, analyticsData] = await Promise.all([
          getAdminDashboardStats(),
          getAllAnalytics()
        ]);
        
        // Update state with combined data
        setStats({
          studentCount: dashboardData.studentCount,
          facultyCount: dashboardData.facultyCount,
          courseCount: dashboardData.courseCount,
          departmentCount: dashboardData.departmentCount,
          upcomingEvents: dashboardData.upcomingEvents,
          recentActivities: dashboardData.recentActivities,
          revenueData: analyticsData.revenueData,
          departmentDistribution: analyticsData.departmentDistribution,
          facultyPerformance: analyticsData.facultyPerformance,
          attendanceAnalytics: analyticsData.attendanceAnalytics
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
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
          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6 flex items-start space-x-4">
              <div className="rounded-full bg-blue-100 p-3">
                <FiUsers className="h-6 w-6 text-blue-600" />
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
            
            <div className="bg-white rounded-lg shadow p-6 flex items-start space-x-4">
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
            
            <div className="bg-white rounded-lg shadow p-6 flex items-start space-x-4">
              <div className="rounded-full bg-purple-100 p-3">
                <FiCalendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming events</p>
                <p className="text-2xl font-semibold">{stats.upcomingEvents.length}</p>
                <p className="text-sm text-gray-500">Next: {stats.upcomingEvents[0]?.title}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 flex items-start space-x-4">
              <div className="rounded-full bg-red-100 p-3">
                <FiDollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-semibold">
                  ${stats.revenueData ? (stats.revenueData.total_revenue / 1000).toFixed(1) + 'k' : '0'}
                </p>
                <p className="text-sm text-red-500">
                  Pending: ${stats.revenueData ? (stats.revenueData.total_pending / 1000).toFixed(1) + 'k' : '0'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Announcements & Activities section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Announcements section */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800">Announcements</h2>
              </div>
              <div className="p-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Science Exhibition</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Aug 15, 2023</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Academic</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Science Block</td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Upcoming
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Career Fair</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Sep 05, 2023</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Career</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">College Gymnasium</td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Upcoming
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Annual Sports Day</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Sep 20, 2023</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Sports</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Sports Complex</td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Upcoming
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Parent-Teacher Meeting</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Oct 10, 2023</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Academic</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Multiple Classrooms</td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Planning
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Orientation Day</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Jul 25, 2023</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Orientation</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">Main Auditorium</td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Recent Activity section */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {stats.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex">
                      <div className={`${activity.avatar_color} rounded-full h-10 w-10 flex items-center justify-center text-white flex-shrink-0`}>
                        {activity.user.charAt(0)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                          <p className="text-xs text-gray-500">{getRelativeTime(activity.timestamp)}</p>
                        </div>
                        <p className="text-sm text-gray-500">{activity.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Analytics section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Trends */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trends</h2>
              <AttendanceChart 
                data={stats.attendanceAnalytics?.student?.overall || {}} 
                type="student"
              />
            </div>
            
            {/* Faculty Performance graph */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Faculty Performance</h2>
              <div className="h-64">
                <ChartComponent
                  type="radar"
                  data={stats.facultyPerformance || {
                    labels: ['Teaching Quality', 'Student Feedback', 'Research', 'Punctuality', 'Mentorship'],
                    datasets: [
                      {
                        label: 'Department Average',
                        data: [4.2, 3.8, 3.5, 4.5, 4.0],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
                      },
                      {
                        label: 'Institution Average',
                        data: [3.8, 3.9, 3.7, 4.2, 3.8],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
                      }
                    ]
                  }}
                  options={{
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
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
          
          {/* Quick Action Cards */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition-colors duration-150 text-center">
                <FiUsers className="h-8 w-8 mx-auto mb-2" />
                <span className="text-sm font-medium">Add User</span>
              </button>
              <button className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg transition-colors duration-150 text-center">
                <FiBookOpen className="h-8 w-8 mx-auto mb-2" />
                <span className="text-sm font-medium">Create Course</span>
              </button>
              <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg transition-colors duration-150 text-center">
                <FiCalendar className="h-8 w-8 mx-auto mb-2" />
                <span className="text-sm font-medium">Schedule Event</span>
              </button>
              <button className="bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-lg transition-colors duration-150 text-center">
                <FiDollarSign className="h-8 w-8 mx-auto mb-2" />
                <span className="text-sm font-medium">Generate Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}