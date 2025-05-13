import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiFilter, FiDownload, FiUsers, FiUser } from 'react-icons/fi';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import Layout from '../../components/Layout';
import MultiSelectFilter from '../../components/MultiSelectFilter';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Attendance() {
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('students'); // 'students' or 'faculty'
  const [attendanceData, setAttendanceData] = useState(null);

  // Filter options
  const [studentFilters, setStudentFilters] = useState({
    courses: [],
    classes: [],
    sections: [],
    months: [],
    years: []
  });

  const [facultyFilters, setFacultyFilters] = useState({
    faculty: [],
    months: [],
    years: []
  });

  // Available options for filters
  const courseOptions = ['CS', 'SE', 'IS', 'EE', 'DS', 'AI'];
  const classOptions = ['2021', '2022', '2023', '2024'];
  const sectionOptions = ['A', 'B', 'C', 'D'];
  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const yearOptions = ['2021', '2022', '2023', '2024'];
  const facultyOptions = [
    'Dr. Smith (CS)', 'Prof. Johnson (SE)', 'Dr. Williams (IS)',
    'Prof. Brown (EE)', 'Dr. Davis (DS)', 'Prof. Miller (AI)'
  ];

  // Mock data fetch - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate mock data based on filters
        const data = viewType === 'students' 
          ? generateStudentAttendanceData(studentFilters)
          : generateFacultyAttendanceData(facultyFilters);
        
        setAttendanceData(data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewType, studentFilters, facultyFilters]);

  // Generate mock student attendance data based on filters
  const generateStudentAttendanceData = (filters) => {
    const totalStudents = 120; // Base number
    const present = Math.floor(totalStudents * 0.85);
    const absent = Math.floor(totalStudents * 0.10);
    const late = totalStudents - present - absent;

    return {
      summary: {
        present,
        absent,
        late,
        presentPercentage: Math.round((present / totalStudents) * 100),
        absentPercentage: Math.round((absent / totalStudents) * 100),
        latePercentage: Math.round((late / totalStudents) * 100),
        total: totalStudents
      },
      trends: {
        labels: filters.months.length > 0 ? filters.months : ['August', 'September', 'October'],
        present: filters.months.map((_, i) => present + (i * 2)),
        absent: filters.months.map((_, i) => absent - i),
        late: filters.months.map((_, i) => late + (i % 2))
      }
    };
  };

  // Generate mock faculty attendance data based on filters
  const generateFacultyAttendanceData = (filters) => {
    const totalFaculty = filters.faculty.length > 0 ? filters.faculty.length * 5 : 30;
    const present = Math.floor(totalFaculty * 0.92);
    const absent = Math.floor(totalFaculty * 0.05);
    const late = totalFaculty - present - absent;

    return {
      summary: {
        present,
        absent,
        late,
        presentPercentage: Math.round((present / totalFaculty) * 100),
        absentPercentage: Math.round((absent / totalFaculty) * 100),
        latePercentage: Math.round((late / totalFaculty) * 100),
        total: totalFaculty
      },
      trends: {
        labels: filters.months.length > 0 ? filters.months : ['August', 'September', 'October'],
        present: filters.months.map((_, i) => present + i),
        absent: filters.months.map((_, i) => absent - (i % 2)),
        late: filters.months.map((_, i) => late + (i % 3))
      }
    };
  };

  // Chart options for animation and styling
  const chartOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      animateScale: true,
      animateRotate: true
    },
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  // Pie chart data
  const pieChartData = (data) => ({
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [data.present, data.absent, data.late],
        backgroundColor: [
          'rgba(133, 215, 188, 0.7)', // Pastel green
          'rgba(129, 163, 217, 0.7)', // Pastel red
          'rgb(210, 161, 148)'  // Pastel blue
        ],
        borderColor: [
          'rgba(133, 215, 188, 0.7)', // Pastel green
          'rgba(129, 163, 217, 0.7)', // Pastel red
          'rgb(210, 161, 148)'  // Pastel blue
        ],
        borderWidth: 1,
      },
    ],
  });

  // Bar chart data
  const barChartData = (labels, present, absent, late) => ({
    labels,
    datasets: [
      {
        label: 'Present',
        data: present,
        backgroundColor: 'rgba(133, 215, 188, 0.7)',
      },
      {
        label: 'Absent',
        data: absent,
        backgroundColor: 'rgba(129, 163, 217, 0.7)',
      },
      {
        label: 'Late',
        data: late,
        backgroundColor: 'rgb(210, 161, 148)',
      },
    ],
  });


  return (
    <Layout title="Attendance">
      <Head>
        <title>Attendance Analytics | EduSync</title>
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Attendance Analytics</h1>
          
        </div>

        {/* View Type Toggle */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setViewType('students')}
            className={`py-2 px-4 font-medium text-sm border-b-2 flex items-center ${
              viewType === 'students'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiUsers className="mr-2" />
            Student Attendance
          </button>
          <button
            onClick={() => setViewType('faculty')}
            className={`py-2 px-4 font-medium text-sm border-b-2 flex items-center ${
              viewType === 'faculty'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiUser className="mr-2" />
            Faculty Attendance
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            <FiFilter className="mr-2" />
            Filters
          </h2>
          
          {viewType === 'students' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <MultiSelectFilter
                label="Courses"
                options={courseOptions}
                selected={studentFilters.courses}
                onChange={(selected) => setStudentFilters({...studentFilters, courses: selected})}
              />
              <MultiSelectFilter
                label="Classes"
                options={classOptions}
                selected={studentFilters.classes}
                onChange={(selected) => setStudentFilters({...studentFilters, classes: selected})}
              />
              <MultiSelectFilter
                label="Sections"
                options={sectionOptions}
                selected={studentFilters.sections}
                onChange={(selected) => setStudentFilters({...studentFilters, sections: selected})}
              />
              <MultiSelectFilter
                label="Months"
                options={monthOptions}
                selected={studentFilters.months}
                onChange={(selected) => setStudentFilters({...studentFilters, months: selected})}
              />
              <MultiSelectFilter
                label="Years"
                options={yearOptions}
                selected={studentFilters.years}
                onChange={(selected) => setStudentFilters({...studentFilters, years: selected})}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MultiSelectFilter
                label="Faculty Members"
                options={facultyOptions}
                selected={facultyFilters.faculty}
                onChange={(selected) => setFacultyFilters({...facultyFilters, faculty: selected})}
              />
              <MultiSelectFilter
                label="Months"
                options={monthOptions}
                selected={facultyFilters.months}
                onChange={(selected) => setFacultyFilters({...facultyFilters, months: selected})}
              />
              <MultiSelectFilter
                label="Years"
                options={yearOptions}
                selected={facultyFilters.years}
                onChange={(selected) => setFacultyFilters({...facultyFilters, years: selected})}
              />
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Data Display */}
        {!loading && attendanceData && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <div className="h-8 w-8 text-green-700 flex items-center justify-center font-bold text-xl">
                    {attendanceData.summary.presentPercentage}%
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Present</p>
                  <p className="text-xl font-bold text-gray-800">
                    {attendanceData.summary.present} / {attendanceData.summary.total}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div className="rounded-full bg-red-100 p-3 mr-4">
                  <div className="h-8 w-8 text-red-700 flex items-center justify-center font-bold text-xl">
                    {attendanceData.summary.absentPercentage}%
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Absent</p>
                  <p className="text-xl font-bold text-gray-800">
                    {attendanceData.summary.absent} / {attendanceData.summary.total}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <div className="h-8 w-8 text-blue-700 flex items-center justify-center font-bold text-xl">
                    {attendanceData.summary.latePercentage}%
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Late</p>
                  <p className="text-xl font-bold text-gray-800">
                    {attendanceData.summary.late} / {attendanceData.summary.total}
                  </p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  {viewType === 'students' ? 'Student' : 'Faculty'} Attendance Distribution
                </h2>
                <div className="h-64">
                  <Pie 
                    data={pieChartData(attendanceData.summary)} 
                    options={chartOptions} 
                  />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  {viewType === 'students' ? 'Student' : 'Faculty'} Attendance Trends
                </h2>
                <div className="h-64">
                  <Bar 
                    data={barChartData(
                      attendanceData.trends.labels,
                      attendanceData.trends.present,
                      attendanceData.trends.absent,
                      attendanceData.trends.late
                    )} 
                    options={chartOptions} 
                  />
                </div>
              </div>
            </div>

            {/* Detailed Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Detailed Summary</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Present
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attendanceData.summary.present}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attendanceData.summary.presentPercentage}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          Absent
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attendanceData.summary.absent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attendanceData.summary.absentPercentage}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          Late
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attendanceData.summary.late}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attendanceData.summary.latePercentage}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}