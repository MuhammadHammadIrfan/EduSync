import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';

import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  UserPlus
} from 'lucide-react';
import { FiFileText } from 'react-icons/fi';

import ChartComponent from '../../components/ChartComponent';

import {
  getDepartmentDistribution,
  getFacultyPerformance,
  getRevenueData,
  getAttendanceAnalytics
} from '../../utils/adminApi';

import {
  mockMonthlyEnrollment,
  mockEventData,
  mockMetrics
} from '../../utils/mockData';

const pastelColors = [
  '#A8DADC',
  '#FFE5EC',
  '#FDCB9E',
  '#B5EAD7',
  '#E2F0CB',
  '#C7CEEA',
  '#FFDAC1',
  '#FF9AA2',
  '#D5AAFF',
  '#B4F8C8'
];

export default function AnalyticsPage() {
  const [data, setData] = useState({
    monthlyEnrollment: [],
    coursePopularity: [],
    financialOverview: [],
    eventData: [],
    metrics: null,
    loading: true
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          departmentDistribution,
          facultyPerformance,
          revenueData,
          attendanceAnalytics
        ] = await Promise.all([
          getDepartmentDistribution(),
          getFacultyPerformance(),
          getRevenueData(),
          getAttendanceAnalytics()
        ]);

        const coursePopularity = departmentDistribution.labels.map((label, index) => ({
          name: label,
          students: departmentDistribution.data[index] * 50
        }));

        setData({
          monthlyEnrollment: mockMonthlyEnrollment,
          coursePopularity,
          financialOverview: revenueData.monthly_revenue
            .filter(m => m.amount)
            .map(month => ({
              name: month.month,
              income: month.amount,
              expenses: month.amount * 0.6
            })),
          eventData: mockEventData,
          metrics: mockMetrics,
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Layout title="Analytics">
        <Head>
          <title>Analytics & Reports | Admin Portal</title>
        </Head>

        <div className="px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center">
              <BarChart3 className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              Analytics & Reports
            </h1>
          </div>
          <CardDescription>
            Overview of university performance metrics and trends.
          </CardDescription>

          {/* Metrics Cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Enrollments"
              icon={<Users className="h-5 w-5 text-primary" />}
              value={data.metrics.totalEnrollments}
              note="+5.2% from last month"
            />
            <MetricCard
              title="Faculty Members"
              icon={<UserPlus className="h-5 w-5 text-green-500" />}
              value={data.metrics.totalFaculty}
              note="+2 new faculty this year"
            />
            <MetricCard
              title="Active Courses"
              icon={<FiFileText className="h-5 w-5 text-purple-500" />}
              value={data.metrics.activeCourses}
              note="+2 new courses this semester"
            />
            <MetricCard
              title="Events This Year"
              icon={<Calendar className="h-5 w-5 text-orange-500" />}
              value={data.metrics.totalEvents}
              note="5 upcoming events"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2">
            <ChartCard
              title="Monthly Enrollment Trends"
              description="Student and faculty additions over the past 6 months."
              type="bar"
              data={{
                labels: data.monthlyEnrollment.map(item => item.month),
                datasets: [
                  {
                    label: 'New Students',
                    data: data.monthlyEnrollment.map(item => item.students),
                    backgroundColor: pastelColors[0],
                    borderRadius: 4
                  },
                  {
                    label: 'New Faculty',
                    data: data.monthlyEnrollment.map(item => item.faculty),
                    backgroundColor: pastelColors[1],
                    borderRadius: 4
                  }
                ]
              }}
            />

            <ChartCard
              title="Department Distribution"
              description="Student enrollment across different departments."
              type="doughnut"
              data={{
                labels: data.coursePopularity.map(item => item.name),
                datasets: [
                  {
                    data: data.coursePopularity.map(item => item.students),
                    backgroundColor: pastelColors.slice(
                      0,
                      data.coursePopularity.length
                    ),
                    borderWidth: 0
                  }
                ]
              }}
              options={{
                cutout: '70%',
                animation: {
                  animateScale: true,
                  animateRotate: true
                }
              }}
            />
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2">
            <ChartCard
              title="University Events"
              description="Number of events conducted each month."
              type="bar"
              data={{
                labels: data.eventData.map(item => item.month),
                datasets: [
                  {
                    label: 'Events',
                    data: data.eventData.map(item => item.events),
                    backgroundColor: pastelColors.slice(
                      0,
                      data.eventData.length
                    ),
                    borderRadius: 4
                  }
                ]
              }}
              options={{ plugins: { legend: { display: false } } }}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

// Reusable Components
function MetricCard({ title, icon, value, note }) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, description, type, data, options = {} }) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                bodyColor: 'hsl(var(--foreground))',
                titleColor: 'hsl(var(--foreground))',
                borderWidth: 1
              },
              ...(options.plugins || {})
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: 'hsl(var(--border))' },
                ticks: { color: 'hsl(var(--muted-foreground))' }
              },
              x: {
                grid: { color: 'hsl(var(--border))' },
                ticks: { color: 'hsl(var(--muted-foreground))' }
              }
            },
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
