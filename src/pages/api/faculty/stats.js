import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated session
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get userId from query or session
    const userId = parseInt(req.query.userId || session.user.id, 10);

    // Check role
    if (session.user.role !== 'faculty' && session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Not authorized' });
    }

    // Verify the user is accessing their own data
    if (
      session.user.id.toString() !== userId.toString() &&
      session.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ error: 'Forbidden - Not authorized to access this data' });
    }

    // 1. Find classes the faculty teaches through ClassSchedule
    const classSchedules = await prisma.classSchedule.findMany({
      where: { facultyId: userId },
      select: {
        classId: true,
        sectionId: true,
        courseId: true,
      },
      distinct: ['classId', 'sectionId', 'courseId'],
    });

    // 2. Find sections where faculty is an advisor
    const advisorSections = await prisma.section.findMany({
      where: { advisorId: userId },
      select: { id: true, classId: true },
    });

    // 3. Find courses assigned to faculty through FacultyCourse
    const facultyCourses = await prisma.facultyCourse.findMany({
      where: { facultyId: userId },
      select: { courseId: true },
    });

    // Count unique classes
    const classIdsFromSchedule = classSchedules.map((c) => c.classId);
    const classIdsFromSections = advisorSections.map((s) => s.classId);
    const uniqueClasses = new Set([
      ...classIdsFromSchedule,
      ...classIdsFromSections,
    ]);

    // Count unique sections
    const sectionIdsFromSchedule = classSchedules.map((c) => c.sectionId);
    const sectionIdsFromAdvisor = advisorSections.map((s) => s.id);
    const uniqueSections = new Set([
      ...sectionIdsFromSchedule,
      ...sectionIdsFromAdvisor,
    ]);

    // Count unique courses
    const courseIdsFromSchedule = classSchedules.map((c) => c.courseId);
    const courseIdsFromFaculty = facultyCourses.map((fc) => fc.courseId);
    const uniqueCourses = new Set([
      ...courseIdsFromSchedule,
      ...courseIdsFromFaculty,
    ]);

    // Count students
    // Students can be linked to a faculty in two ways:
    // 1. Students in sections where faculty is an advisor
    // 2. Students in sections where faculty teaches

    // Get all section IDs where faculty either teaches or is an advisor
    const allSectionIds = [...uniqueSections];

    const studentCount = await prisma.student.count({
      where: {
        sectionId: {
          in: allSectionIds,
        },
      },
    });

    // Calculate average attendance for faculty's courses
    let totalAttendance = 0;
    let totalEntries = 0;
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        courseId: {
          in: [...uniqueCourses],
        },
      },
    });

    if (attendanceRecords.length > 0) {
      const present = attendanceRecords.filter(
        (a) => a.status === 'Present'
      ).length;
      totalEntries = attendanceRecords.length;
      totalAttendance = Math.round((present / totalEntries) * 100);
    } else {
      totalAttendance = 0; // No attendance records found
    }

    const stats = {
      totalClasses: uniqueClasses.size,
      totalSections: uniqueSections.size,
      totalCourses: uniqueCourses.size,
      totalStudents: studentCount,
      averageAttendance: totalAttendance || 85, // Use calculated value or default to 85%
      upcomingAssignments: 3, // Placeholder - future feature
      pendingGrades: 2, // Placeholder - future feature
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching faculty stats:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch faculty statistics' });
  } finally {
    await prisma.$disconnect();
  }
}
