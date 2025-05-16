import { requireRole } from '@/lib/requireRole';
import React, { useState, useEffect } from 'react';
import Layout from '../../components/components/Layout';

import Head from 'next/head';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/components/ui/card';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  UserPlus
} from 'lucide-react';
import { FiFileText } from 'react-icons/fi';

import ChartComponent from '../../components/components/ChartComponent';
import { getAllAnalytics } from '../../../utils/api/admin';

export async function getServerSideProps(context) {
  return requireRole(context, "admin")
}

export default function AnalyticsPage() {
  const [data, setData] = useState({
    studentDepartmentDistribution: {
      labels: [],
      data: [],
      backgroundColor: [],
      borderColor: []
    },
    facultyDepartmentDistribution: {
      labels: [],
      data: [],
      backgroundColor: [],
      borderColor: []
    },
    metrics: {
      totalEnrollments: 0,
      totalFaculty: 0,
      activeCourses: 0,
      totalEvents: 0
    },
    revenue: {
      total_revenue: 0,
      total_pending: 0
    },
    attendanceRate: 0,
    loading: true
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const analytics = await getAllAnalytics();
        
        setData({
          studentDepartmentDistribution: analytics.studentDepartmentDistribution || {
            labels: [],
            data: [],
            backgroundColor: [],
            borderColor: []
          },
          facultyDepartmentDistribution: analytics.facultyDepartmentDistribution || {
            labels: [],
            data: [],
            backgroundColor: [],
            borderColor: []
          },
          metrics: analytics.metrics || {
            totalEnrollments: 0,
            totalFaculty: 0,
            activeCourses: 0,
            totalEvents: 0
          },
          revenue: analytics.revenueData || {
            total_revenue: 0,
            total_pending: 0
          },
          attendanceRate: analytics.attendanceAnalytics?.student?.overall?.rate || 0,
          loading: false
        });
      } catch (error) {
        console.error('Failed to load analytics data:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    loadData();
  }, []);

  if (data.loading) {
    return (
      <Layout title="Analytics">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  // Default colors if none are provided by the API
  const defaultColors = [
    'rgba(75, 192, 192, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)'
  ];

  return (
    <Layout title="Analytics">
      <Head>
        <title>Analytics & Reports | EduSync</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center">
            <BarChart3 className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
            Analytics & Reports
          </h1>
        </div>
        <CardDescription>Overview of university performance metrics and trends.</CardDescription>

        {/* Metrics Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title="Total Enrollments" 
            icon={<Users className="h-5 w-5 text-blue-600" />} 
            value={data.metrics.totalEnrollments} 
            note="Students enrolled" 
            color="bg-blue-100 text-blue-600"
          />
          <MetricCard 
            title="Faculty Members" 
            icon={<UserPlus className="h-5 w-5 text-green-600" />} 
            value={data.metrics.totalFaculty} 
            note="Active faculty" 
            color="bg-green-100 text-green-600"
          />
          <MetricCard 
            title="Active Courses" 
            icon={<FiFileText className="h-5 w-5 text-purple-600" />} 
            value={data.metrics.activeCourses} 
            note="Courses offered" 
            color="bg-purple-100 text-purple-600"
          />
          <MetricCard 
            title="Events This Year" 
            icon={<Calendar className="h-5 w-5 text-orange-600" />} 
            value={data.metrics.totalEvents} 
            note="Campus events" 
            color="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Revenue and Attendance Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="lg:col-span-2 shadow-lg border-blue-100 hover:border-blue-200 transition-colors">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <CardTitle className="text-blue-700">Financial Overview</CardTitle>
              <CardDescription>Revenue and pending payments</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-700">${data.revenue.total_revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-red-600">${data.revenue.total_pending.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-lg border-green-100 hover:border-green-200 transition-colors">
            <CardHeader className="bg-green-50 rounded-t-lg">
              <CardTitle className="text-green-700">Attendance Rate</CardTitle>
              <CardDescription>Overall student attendance</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-center h-20">
                <div className="text-4xl font-bold text-green-700">
                  {parseFloat(data.attendanceRate).toFixed(1)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <ChartCard
            title="Faculty Department Distribution"
            description="Faculty members across different departments"
            type="pie"
            data={{
              labels: data.facultyDepartmentDistribution.labels,
              datasets: [{
                data: data.facultyDepartmentDistribution.data,
                backgroundColor: data.facultyDepartmentDistribution.backgroundColor.length > 0 
                  ? data.facultyDepartmentDistribution.backgroundColor 
                  : defaultColors,
                borderColor: data.facultyDepartmentDistribution.borderColor.length > 0
                  ? data.facultyDepartmentDistribution.borderColor
                  : defaultColors.map(color => color.replace('0.7', '1')),
                borderWidth: 1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    usePointStyle: true,
                    boxWidth: 10
                  }
                }
              }
            }}
            className="bg-indigo-50 border-indigo-100"
            titleColor="text-indigo-700"
          />

          <ChartCard
            title="Student Department Distribution"
            description="Student enrollment across different departments"
            type="doughnut"
            data={{
              labels: data.studentDepartmentDistribution.labels,
              datasets: [{
                data: data.studentDepartmentDistribution.data,
                backgroundColor: data.studentDepartmentDistribution.backgroundColor.length > 0 
                  ? data.studentDepartmentDistribution.backgroundColor 
                  : defaultColors,
                borderColor: data.studentDepartmentDistribution.borderColor.length > 0
                  ? data.studentDepartmentDistribution.borderColor
                  : defaultColors.map(color => color.replace('0.7', '1')),
                borderWidth: 1
              }]
            }}
            options={{
              cutout: '60%',
              animation: {
                animateScale: true,
                animateRotate: true
              },
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    usePointStyle: true,
                    boxWidth: 10
                  }
                }
              }
            }}
            className="bg-blue-50 border-blue-100"
            titleColor="text-blue-700"
          />
          
          <ChartCard
            title="Attendance Overview"
            description="Present vs. Absent attendance records"
            type="bar"
            data={{
              labels: ['Attendance Status'],
              datasets: [
                {
                  label: 'Present',
                  data: [data.attendanceRate],
                  backgroundColor: 'rgba(75, 192, 192, 0.7)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
                },
                {
                  label: 'Absent/Late',
                  data: [100 - data.attendanceRate],
                  backgroundColor: 'rgba(255, 99, 132, 0.7)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1
                }
              ]
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                }
              },
              plugins: {
                legend: {
                  position: 'top'
                }
              }
            }}
            className="bg-green-50 border-green-100"
            titleColor="text-green-700"
          />
          
          <ChartCard
            title="Revenue vs. Pending"
            description="Financial status overview"
            type="pie"
            data={{
              labels: ['Revenue Collected', 'Pending Payments'],
              datasets: [{
                data: [
                  data.revenue.total_revenue - data.revenue.total_pending, 
                  data.revenue.total_pending
                ],
                backgroundColor: [
                  'rgba(75, 192, 192, 0.7)',
                  'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
              }]
            }}
            options={{
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    usePointStyle: true,
                    boxWidth: 10
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      let label = context.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed !== undefined) {
                        label += new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(context.parsed);
                      }
                      return label;
                    }
                  }
                }
              }
            }}
            className="bg-yellow-50 border-yellow-100"
            titleColor="text-yellow-700"
          />
        </div>
      </div>
    </Layout>
  );
}

// Reusable Components
function MetricCard({ title, icon, value, note, color = "bg-gray-100 text-gray-600" }) {
  return (
    <Card className="shadow-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${color.includes('bg-') ? color : ''}`}>
        <CardTitle className={`text-sm font-medium ${color.includes('text-') ? color : 'text-gray-600'}`}>
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-gray-500">{note}</p>
      </CardContent>
    </Card>
  );
}

function ChartCard({ 
  title, 
  description, 
  type, 
  data, 
  options = {}, 
  className = "",
  titleColor = "text-gray-800" 
}) {
  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className={titleColor}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] sm:h-[350px]">
        <ChartComponent
          type={type}
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
              tooltip: {
                backgroundColor: 'white',
                titleColor: '#333',
                bodyColor: '#666',
                borderColor: '#ddd',
                borderWidth: 1,
                padding: 10,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cornerRadius: 4,
              },
              ...(options.plugins || {})
            },
            scales: type !== 'pie' && type !== 'doughnut' ? {
              y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { color: '#666' },
                ...(options.scales?.y || {})
              },
              x: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { color: '#666' },
                ...(options.scales?.x || {})
              }
            } : {},
            animation: {
              duration: 1000,
              easing: 'easeOutQuart'
            },
            ...options
          }}
        />
      </CardContent>
    </Card>
  );
}