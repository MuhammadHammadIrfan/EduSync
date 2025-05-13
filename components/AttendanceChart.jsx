import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with no SSR for Chart.js component
const ChartComponent = dynamic(
  () => import('./ChartComponent'),
  { ssr: false }
);

const AttendanceChart = ({ data = {}, type = 'student' }) => {
  // Default data if none provided
  const defaultData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    present: [85, 82, 88, 90, 85],
    absent: [10, 12, 8, 5, 10],
    late: [5, 6, 4, 5, 5],
  };

  // Use provided data or fallback to default
  const chartData = {
    labels: data.labels || defaultData.labels,
    present: data.present || defaultData.present,
    absent: data.absent || defaultData.absent,
    late: data.late || defaultData.late,
  };

  return (
    <div className="w-full h-80 p-4 bg-white rounded-lg shadow">
      <ChartComponent
        type="line"
        data={{
          labels: chartData.labels,
          datasets: [
            {
              label: 'Present',
              data: chartData.present,
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.3,
            },
            {
              label: 'Absent',
              data: chartData.absent,
              borderColor: '#EF4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.3,
            },
            {
              label: 'Late',
              data: chartData.late,
              borderColor: '#F59E0B',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              tension: 0.3,
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: `${type === 'student' ? 'Student' : 'Faculty'} Attendance Trend`,
              font: { size: 16 },
            },
            legend: {
              position: 'bottom',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Percentage',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default AttendanceChart;