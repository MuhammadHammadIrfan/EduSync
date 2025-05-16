import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get student department distribution
    const departments = await prisma.department.findMany();
    const deptStudentCounts = await Promise.all(
      departments.map(async (dept) => {
        const count = await prisma.student.count({
          where: { departmentId: dept.id },
        });
        return { id: dept.id, name: dept.name, count };
      })
    );

    const studentDepartmentDistribution = {
      labels: deptStudentCounts.map((d) => d.name),
      data: deptStudentCounts.map((d) => d.count),
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
      ].slice(0, deptStudentCounts.length),
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ].slice(0, deptStudentCounts.length),
    };

    // Get faculty department distribution
    const deptFacultyCounts = await Promise.all(
      departments.map(async (dept) => {
        const count = await prisma.faculty.count({
          where: { departmentId: dept.id },
        });
        return { id: dept.id, name: dept.name, count };
      })
    );

    const facultyDepartmentDistribution = {
      labels: deptFacultyCounts.map((d) => d.name),
      data: deptFacultyCounts.map((d) => d.count),
      backgroundColor: [
        'rgba(75, 70, 192, 0.7)',
        'rgba(54, 200, 135, 0.7)',
        'rgba(255, 150, 86, 0.7)',
        'rgba(255, 99, 192, 0.7)',
        'rgba(153, 150, 255, 0.7)',
        'rgba(200, 159, 64, 0.7)',
      ].slice(0, deptFacultyCounts.length),
      borderColor: [
        'rgba(75, 70, 192, 1)',
        'rgba(54, 200, 135, 1)',
        'rgba(255, 150, 86, 1)',
        'rgba(255, 99, 192, 1)',
        'rgba(153, 150, 255, 1)',
        'rgba(200, 159, 64, 1)',
      ].slice(0, deptFacultyCounts.length),
    };

    // Get invoice/revenue data
    const invoices = await prisma.invoice.findMany();
    const totalRevenue = invoices.reduce(
      (sum, inv) => sum + parseFloat(inv.amount),
      0
    );
    const totalPending = invoices
      .filter((inv) => !inv.paid)
      .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);

    const revenueData = {
      total_revenue: totalRevenue,
      total_pending: totalPending,
    };

    // Get faculty count
    const facultyCount = await prisma.faculty.count();

    // Get student count
    const studentCount = await prisma.student.count();

    // Get course count
    const courseCount = await prisma.course.count();

    // Get event count
    const eventCount = await prisma.event.count();

    // Get attendance data
    const attendanceData = await prisma.attendance.findMany();
    const presentCount = attendanceData.filter(
      (a) => a.status === 'Present'
    ).length;
    const totalCount = attendanceData.length;
    const attendanceRate =
      totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;

    const attendanceAnalytics = {
      student: {
        overall: {
          present: presentCount,
          total: totalCount,
          rate: parseFloat(attendanceRate),
        },
      },
    };

    // Return compiled analytics
    return res.status(200).json({
      studentDepartmentDistribution,
      facultyDepartmentDistribution,
      revenueData,
      metrics: {
        totalFaculty: facultyCount,
        totalEnrollments: studentCount,
        activeCourses: courseCount,
        totalEvents: eventCount,
      },
      attendanceAnalytics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res
      .status(500)
      .json({ message: 'Error fetching analytics', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
