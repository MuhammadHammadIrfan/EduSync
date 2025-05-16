const { PrismaClient, AttendanceStatus } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAttendance() {
  console.log('🔄 Starting to seed attendance data...');

  // Get all class schedules
  const classSchedules = await prisma.classSchedule.findMany({
    include: {
      course: true,
      section: true,
      class: true,
    },
  });

  // Get all students
  const students = await prisma.student.findMany({
    include: {
      section: true,
      class: true,
    },
  });

  // Create a map of class and section to students for easier lookup
  const studentsBySectionAndClass = new Map();
  students.forEach((student) => {
    const key = `${student.classId}-${student.sectionId}`;
    if (!studentsBySectionAndClass.has(key)) {
      studentsBySectionAndClass.set(key, []);
    }
    studentsBySectionAndClass.get(key).push(student);
  });

  // Helper function to get a date for a specific weekday in the past 10 weeks
  function getDateForWeekday(weekday, weeksAgo) {
    const weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const weekdayIndex = weekdays.indexOf(weekday);

    if (weekdayIndex === -1) {
      throw new Error(`Invalid weekday: ${weekday}`);
    }

    const today = new Date();
    const targetDate = new Date();

    // Move back by the specified number of weeks
    targetDate.setDate(today.getDate() - 7 * weeksAgo);

    // Find the correct weekday within that week
    const currentDayOfWeek = targetDate.getDay();
    const daysToAdd = (weekdayIndex - currentDayOfWeek + 7) % 7;

    targetDate.setDate(targetDate.getDate() + daysToAdd);

    // Set time to 00:00:00
    targetDate.setHours(0, 0, 0, 0);

    return targetDate;
  }

  // Helper function to get a random status with realistic probabilities
  function getRandomStatus() {
    const random = Math.random() * 100;
    if (random < 85) {
      // 85% present
      return AttendanceStatus.Present;
    } else if (random < 95) {
      // 10% absent
      return AttendanceStatus.Absent;
    } else {
      // 5% late
      return AttendanceStatus.Late;
    }
  }

  // Store attendance records we'll create
  const attendanceRecords = [];

  // For each class schedule
  for (const schedule of classSchedules) {
    // Get students in this class and section
    const key = `${schedule.classId}-${schedule.sectionId}`;
    const sectionStudents = studentsBySectionAndClass.get(key) || [];

    if (sectionStudents.length === 0) {
      console.warn(
        `No students found for class ${schedule.class.name}, section ${schedule.section.name}`
      );
      continue;
    }

    console.log(
      `Processing attendance for ${schedule.course.name} (${schedule.course.course_code}) - ${schedule.class.name}, ${schedule.section.name}: ${sectionStudents.length} students`
    );

    // Create attendance for 10 past classes
    for (let weeksAgo = 10; weeksAgo > 0; weeksAgo--) {
      const classDate = getDateForWeekday(schedule.day_of_week, weeksAgo);

      // Skip future dates
      if (classDate > new Date()) {
        continue;
      }

      // For each student in this section
      for (const student of sectionStudents) {
        // Create attendance record with random status
        attendanceRecords.push({
          studentId: student.id,
          courseId: schedule.courseId,
          date: classDate,
          status: getRandomStatus(),
        });
      }
    }
  }

  // Chunk the records to avoid overwhelming the database
  const chunkSize = 1000;
  const chunks = [];
  for (let i = 0; i < attendanceRecords.length; i += chunkSize) {
    chunks.push(attendanceRecords.slice(i, i + chunkSize));
  }

  // Process each chunk
  let createdCount = 0;
  for (const [index, chunk] of chunks.entries()) {
    console.log(
      `Processing chunk ${index + 1}/${chunks.length} (${
        chunk.length
      } records)...`
    );

    // Use createMany for efficiency
    const result = await prisma.attendance.createMany({
      data: chunk,
      skipDuplicates: true, // Skip existing records
    });

    createdCount += result.count;
    console.log(`Created ${result.count} attendance records`);
  }

  console.log(
    `✅ Completed seeding attendance data. Created a total of ${createdCount} records.`
  );
}

module.exports = seedAttendance;
