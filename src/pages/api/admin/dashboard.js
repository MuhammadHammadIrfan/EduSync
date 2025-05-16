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

    // Get counts for dashboard stats
    const studentCount = await prisma.student.count();
    const facultyCount = await prisma.faculty.count();
    const courseCount = await prisma.course.count();
    const departmentCount = await prisma.department.count();

    // Get upcoming events (3 nearest future events)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = await prisma.event.findMany({
      where: {
        event_date: { gte: today },
      },
      orderBy: { event_date: 'asc' },
      take: 3,
      select: {
        id: true,
        title: true,
        event_date: true,
      },
    });

    // Format events for response
    const formattedEvents = upcomingEvents.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.event_date.toISOString().split('T')[0],
    }));

    // Get recent activities - this would normally come from an activity log table
    // For now, we'll mock some activities or get from other tables
    const recentLeaveRequests = await prisma.leaveRequest.findMany({
      where: {
        status: 'Approved',
      },
      orderBy: { updated_at: 'desc' },
      take: 2,
      include: {
        faculty: true,
      },
    });

    const recentMessages = await prisma.message.findMany({
      orderBy: { sent_at: 'desc' },
      take: 2,
    });

    // Format activities for response
    const recentActivities = [
      ...recentLeaveRequests.map((leave) => ({
        id: `leave-${leave.id}`,
        user: leave.faculty.name,
        action: 'Leave Request Approved',
        timestamp: leave.updated_at.toISOString(),
        avatar_color: 'bg-blue-500',
      })),
      ...recentMessages.map((message) => ({
        id: `msg-${message.id}`,
        user: message.sender_type === 'admin' ? 'Admin' : 'User',
        action:
          message.sender_type === 'admin' ? 'Message Sent' : 'Message Received',
        timestamp: message.sent_at.toISOString(),
        avatar_color:
          message.sender_type === 'admin' ? 'bg-green-500' : 'bg-purple-500',
      })),
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 3);

    const dashboardData = {
      studentCount,
      facultyCount,
      courseCount,
      departmentCount,
      upcomingEvents: formattedEvents,
      recentActivities,
    };

    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ message: 'Error fetching dashboard data' });
  } finally {
    await prisma.$disconnect();
  }
}
