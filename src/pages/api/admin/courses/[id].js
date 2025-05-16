import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  const courseId = parseInt(id, 10);

  if (isNaN(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  // Check if course exists
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // PUT - update course
  if (req.method === 'PUT') {
    try {
      const { name, course_code, departmentId, credit_hours } = req.body;

      if (!name || !departmentId || !credit_hours) {
        return res.status(400).json({
          message: 'Course name, department ID, and credit hours are required',
        });
      }

      // If course_code is being changed, check if the new code conflicts with existing codes
      if (course_code !== course.course_code) {
        const existingCourse = await prisma.course.findUnique({
          where: { course_code },
        });

        if (existingCourse) {
          return res
            .status(409)
            .json({ message: 'Course code already exists' });
        }
      }

      const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: {
          name,
          course_code,
          departmentId: parseInt(departmentId, 10),
          credit_hours: parseInt(credit_hours, 10),
        },
        include: {
          department: true,
        },
      });

      return res.status(200).json(updatedCourse);
    } catch (error) {
      console.error('Error updating course:', error);
      return res.status(500).json({ message: 'Error updating course' });
    } finally {
      await prisma.$disconnect();
    }
  }
  // DELETE - delete course
  else if (req.method === 'DELETE') {
    try {
      // Check if course is being used in schedules, attendance, etc.
      const scheduleCount = await prisma.classSchedule.count({
        where: { courseId },
      });

      const attendanceCount = await prisma.attendance.count({
        where: { courseId },
      });

      if (scheduleCount > 0 || attendanceCount > 0) {
        return res.status(400).json({
          message:
            'Cannot delete course that is in use. Remove all schedules and attendance records first.',
        });
      }

      await prisma.course.delete({
        where: { id: courseId },
      });

      return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      return res.status(500).json({ message: 'Error deleting course' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
