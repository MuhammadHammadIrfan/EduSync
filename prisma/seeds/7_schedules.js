const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedClassSchedules() {
  try {
    // Clear existing schedules to avoid conflicts
    await prisma.classSchedule.deleteMany({});
    console.log('✅ Cleared existing class schedules');

    // STEP 1: Get all course-section pairs and link them with faculty
    console.log('Fetching data from database...');
    const courseSections = await prisma.courseSection.findMany({
      include: {
        course: true,
        section: {
          include: {
            class: {
              include: {
                department: true,
              },
            },
          },
        },
      },
    });

    // Get all faculty
    const allFaculty = await prisma.faculty.findMany();

    // Get existing faculty course assignments
    const existingFacultyCourses = await prisma.facultyCourse.findMany();

    console.log(`Found ${courseSections.length} course-section pairs`);
    console.log(`Found ${existingFacultyCourses.length} faculty-course pairs`);
    console.log(`Found ${allFaculty.length} faculty members`);

    // STEP 2: Ensure every course has at least one faculty member assigned
    // Create faculty course assignments for courses with no faculty
    const coursesWithoutFaculty = new Set();
    const facCourseAssignments = new Map();

    // Build map of existing faculty-course assignments
    existingFacultyCourses.forEach((fc) => {
      const key = fc.courseId.toString();
      if (!facCourseAssignments.has(key)) {
        facCourseAssignments.set(key, []);
      }
      facCourseAssignments.get(key).push(fc.facultyId);
    });

    // Check which courses don't have faculty assigned
    courseSections.forEach((cs) => {
      const key = cs.courseId.toString();
      if (
        !facCourseAssignments.has(key) ||
        facCourseAssignments.get(key).length === 0
      ) {
        coursesWithoutFaculty.add(cs.courseId);
      }
    });

    // Assign faculty to courses without any assigned faculty
    if (coursesWithoutFaculty.size > 0) {
      console.log(
        `Found ${coursesWithoutFaculty.size} courses without faculty. Assigning faculty...`
      );

      const newFacultyCourseData = [];
      const coursesById = {};

      // Get course details
      const coursesWithoutFacultyArray = Array.from(coursesWithoutFaculty);
      const courseDetails = await prisma.course.findMany({
        where: { id: { in: coursesWithoutFacultyArray } },
      });

      courseDetails.forEach((course) => {
        coursesById[course.id] = course;
      });

      // Assign faculty based on departmentId
      coursesWithoutFaculty.forEach((courseId) => {
        const course = coursesById[courseId];
        if (!course) return;

        // Find faculty from the same department
        const departmentFaculty = allFaculty.filter(
          (f) => f.departmentId === course.departmentId
        );

        if (departmentFaculty.length > 0) {
          // Assign to 2 faculty members from the same department
          for (let i = 0; i < Math.min(2, departmentFaculty.length); i++) {
            newFacultyCourseData.push({
              facultyId: departmentFaculty[i].id,
              courseId: courseId,
            });

            // Update our tracking map
            if (!facCourseAssignments.has(courseId.toString())) {
              facCourseAssignments.set(courseId.toString(), []);
            }
            facCourseAssignments
              .get(courseId.toString())
              .push(departmentFaculty[i].id);
          }
        } else {
          // If no faculty from same department, assign to any faculty
          const facultyToAssign = allFaculty[courseId % allFaculty.length];
          newFacultyCourseData.push({
            facultyId: facultyToAssign.id,
            courseId: courseId,
          });

          // Update our tracking map
          if (!facCourseAssignments.has(courseId.toString())) {
            facCourseAssignments.set(courseId.toString(), []);
          }
          facCourseAssignments
            .get(courseId.toString())
            .push(facultyToAssign.id);
        }
      });

      // Create the new faculty-course assignments
      if (newFacultyCourseData.length > 0) {
        await prisma.facultyCourse.createMany({
          data: newFacultyCourseData,
          skipDuplicates: true,
        });
        console.log(
          `✅ Created ${newFacultyCourseData.length} new faculty-course assignments`
        );
      }
    }

    // Refresh faculty course assignments after adding new ones
    const facultyCourses = await prisma.facultyCourse.findMany({
      include: {
        faculty: true,
        course: true,
      },
    });

    console.log(`Updated faculty-course pairs: ${facultyCourses.length}`);

    // STEP 3: Define scheduling parameters
    // Define days and time slots for scheduling
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Define time slots (9 AM to 5 PM with 1.5 hour sessions)
    const timeSlots = [
      { start: '09:00', end: '10:30' },
      { start: '10:45', end: '12:15' },
      { start: '12:30', end: '14:00' },
      { start: '14:15', end: '15:45' },
      { start: '16:00', end: '17:30' },
    ];

    // Helper function to convert time string to DateTime
    function timeToDateTime(timeString, day) {
      // Get current date
      const now = new Date();

      // Find the next occurrence of the specified day
      const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const currentDay = now.getDay();
      const targetDay = daysOfWeek.indexOf(day);
      const daysToAdd = (targetDay + 7 - currentDay) % 7;

      const date = new Date(now);
      date.setDate(now.getDate() + daysToAdd);

      // Parse the time string
      const [hours, minutes] = timeString.split(':').map(Number);

      // Add hours based on your timezone offset
      // If you're in UTC+5, add 5 hours to compensate
      const timezoneOffset = 5; // Change this based on your timezone
      const adjustedHours = hours + timezoneOffset;

      // Set hours and minutes
      date.setHours(adjustedHours, minutes, 0, 0);

      return date;
    }

    // STEP 4: Create section course lists to ensure ALL courses are scheduled
    // Group course sections by section ID to handle all courses for a section
    const sectionCourses = new Map();

    courseSections.forEach((cs) => {
      const key = cs.sectionId.toString();
      if (!sectionCourses.has(key)) {
        sectionCourses.set(key, []);
      }
      sectionCourses.get(key).push({
        courseSection: cs,
        course: cs.course,
        section: cs.section,
      });
    });

    console.log(`Section groups with courses: ${sectionCourses.size}`);

    // Statistics for validation
    const sectionsStats = {};
    sectionCourses.forEach((courses, sectionId) => {
      sectionsStats[sectionId] = courses.length;
    });

    // STEP 5: Prepare scheduling algorithm
    // Track allocated time slots to avoid conflicts
    const allocatedSlots = {};
    // Track faculty schedules to avoid overlaps
    const facultySchedules = {};
    // Track section schedules to avoid overlaps
    const sectionSchedules = {};

    const scheduleData = [];

    // Define how many sessions per week for each course type
    // NOTE: We're ensuring each course appears at least once in the schedule
    const getSessionsPerWeek = (courseName) => {
      if (courseName.includes('Lab')) {
        return 1; // Lab courses meet once a week
      } else if (courseName.includes('Project')) {
        return 1; // Project courses meet once a week
      } else {
        return 2; // Regular courses meet twice a week
      }
    };

    console.log('Creating class schedules...');

    // STEP 6: Generate schedules by section instead of by course
    // This ensures all courses for a section get scheduled
    for (const [sectionId, coursesForSection] of sectionCourses.entries()) {
      // Initialize section schedule
      const sectionKey = sectionId;
      if (!sectionSchedules[sectionKey]) {
        sectionSchedules[sectionKey] = [];
      }

      // Get section details for better log messages
      const sectionDetails = coursesForSection[0]?.section;

      console.log(
        `Processing ${coursesForSection.length} courses for section ${sectionDetails?.name} of ${sectionDetails?.class?.name}`
      );

      // First schedule lab courses, then regular courses
      // Sort courses to handle labs first
      const sortedCourses = [...coursesForSection].sort((a, b) => {
        const aIsLab = a.course.name.includes('Lab') ? 0 : 1;
        const bIsLab = b.course.name.includes('Lab') ? 0 : 1;
        return aIsLab - bIsLab;
      });

      // Now schedule each course for this section
      for (const courseItem of sortedCourses) {
        const { course, section } = courseItem;
        const dept = section.class.department.code;
        const sectionLetter = section.name.includes('Section')
          ? section.name.split(' ')[1]
          : 'A';

        // Find faculty members who can teach this course
        const potentialFaculty = facultyCourses.filter(
          (fc) => fc.courseId === course.id
        );

        if (potentialFaculty.length === 0) {
          console.log(
            `⚠️ No faculty assigned for course ${course.name} (ID: ${course.id}) in section ${section.name}`
          );
          continue;
        }

        // Try to distribute courses evenly among faculty
        let selectedFaculty = null;
        let minCourseLoad = Infinity;

        for (const fc of potentialFaculty) {
          const facultyId = fc.faculty.id;
          const courseLoad = facultySchedules[facultyId]
            ? facultySchedules[facultyId].length
            : 0;

          if (courseLoad < minCourseLoad) {
            selectedFaculty = fc.faculty;
            minCourseLoad = courseLoad;
          }
        }

        if (!selectedFaculty) {
          console.log(`⚠️ Couldn't select faculty for course ${course.name}`);
          continue;
        }

        // Initialize faculty schedule tracking
        if (!facultySchedules[selectedFaculty.id]) {
          facultySchedules[selectedFaculty.id] = [];
        }

        // Determine how many sessions per week this course should have
        const sessionsPerWeek = getSessionsPerWeek(course.name);

        // Track the sessions scheduled for this course-section
        let sessionsScheduled = 0;

        // Process lab courses differently
        let isLabCourse = course.name.includes('Lab');

        // If this is a lab course, preferentially schedule on Thursday/Friday
        if (isLabCourse) {
          const labDays = ['Thursday', 'Friday'];

          for (const day of labDays) {
            if (sessionsScheduled >= sessionsPerWeek) break;

            for (let slotIdx = 0; slotIdx < timeSlots.length; slotIdx++) {
              const slot = timeSlots[slotIdx];
              const slotKey = `${day}-${slotIdx}-${section.id}`;

              // Skip if slot already allocated
              if (allocatedSlots[slotKey]) continue;

              // Check if faculty is already scheduled at this time
              const facultyBusy = facultySchedules[selectedFaculty.id].some(
                (schedule) => {
                  return (
                    schedule.day === day &&
                    ((schedule.startSlot <= slotIdx &&
                      schedule.endSlot > slotIdx) ||
                      schedule.startSlot === slotIdx)
                  );
                }
              );

              if (facultyBusy) continue;

              // Check if section is already scheduled at this time
              const sectionBusy = sectionSchedules[sectionKey].some(
                (schedule) => {
                  return (
                    schedule.day === day &&
                    ((schedule.startSlot <= slotIdx &&
                      schedule.endSlot > slotIdx) ||
                      schedule.startSlot === slotIdx)
                  );
                }
              );

              if (sectionBusy) continue;

              // Schedule found! Create it
              const startTime = timeToDateTime(slot.start, day);
              const endTime = timeToDateTime(slot.end, day);

              // Mark slot as allocated
              allocatedSlots[slotKey] = true;

              // Update faculty schedule
              facultySchedules[selectedFaculty.id].push({
                day: day,
                startSlot: slotIdx,
                endSlot: slotIdx + 1,
                course: course.name,
              });

              // Update section schedule
              sectionSchedules[sectionKey].push({
                day: day,
                startSlot: slotIdx,
                endSlot: slotIdx + 1,
                course: course.name,
              });

              // Create class schedule
              scheduleData.push({
                courseId: course.id,
                facultyId: selectedFaculty.id,
                classId: section.classId,
                sectionId: section.id,
                day_of_week: day,
                start_time: startTime,
                end_time: endTime,
              });

              sessionsScheduled++;
              break; // Found a slot, move to next day if needed
            }
          }
        }

        // For remaining sessions, try all days
        if (sessionsScheduled < sessionsPerWeek) {
          // Try to distribute across different days
          for (const day of days) {
            if (sessionsScheduled >= sessionsPerWeek) break;

            // Don't schedule another session on same day for this course
            if (
              facultySchedules[selectedFaculty.id].some(
                (s) => s.day === day && s.course === course.name
              )
            ) {
              continue;
            }

            for (let slotIdx = 0; slotIdx < timeSlots.length; slotIdx++) {
              if (sessionsScheduled >= sessionsPerWeek) break;

              const slot = timeSlots[slotIdx];
              const slotKey = `${day}-${slotIdx}-${section.id}`;

              // Skip if slot already allocated
              if (allocatedSlots[slotKey]) continue;

              // Check if faculty is already scheduled at this time
              const facultyBusy = facultySchedules[selectedFaculty.id].some(
                (schedule) => {
                  return (
                    schedule.day === day &&
                    ((schedule.startSlot <= slotIdx &&
                      schedule.endSlot > slotIdx) ||
                      schedule.startSlot === slotIdx)
                  );
                }
              );

              if (facultyBusy) continue;

              // Check if section is already scheduled at this time
              const sectionBusy = sectionSchedules[sectionKey].some(
                (schedule) => {
                  return (
                    schedule.day === day &&
                    ((schedule.startSlot <= slotIdx &&
                      schedule.endSlot > slotIdx) ||
                      schedule.startSlot === slotIdx)
                  );
                }
              );

              if (sectionBusy) continue;

              // Schedule found! Create it
              const startTime = timeToDateTime(slot.start, day);
              const endTime = timeToDateTime(slot.end, day);

              // Mark slot as allocated
              allocatedSlots[slotKey] = true;

              // Update faculty schedule
              facultySchedules[selectedFaculty.id].push({
                day: day,
                startSlot: slotIdx,
                endSlot: slotIdx + 1,
                course: course.name,
              });

              // Update section schedule
              sectionSchedules[sectionKey].push({
                day: day,
                startSlot: slotIdx,
                endSlot: slotIdx + 1,
                course: course.name,
              });

              // Create class schedule
              scheduleData.push({
                courseId: course.id,
                facultyId: selectedFaculty.id,
                classId: section.classId,
                sectionId: section.id,
                day_of_week: day,
                start_time: startTime,
                end_time: endTime,
              });

              sessionsScheduled++;
            }
          }
        }

        // If we still couldn't schedule all sessions, try any available slot
        // without the restriction of different days
        if (sessionsScheduled < sessionsPerWeek) {
          for (const day of days) {
            if (sessionsScheduled >= sessionsPerWeek) break;

            for (let slotIdx = 0; slotIdx < timeSlots.length; slotIdx++) {
              if (sessionsScheduled >= sessionsPerWeek) break;

              const slot = timeSlots[slotIdx];
              const slotKey = `${day}-${slotIdx}-${section.id}`;

              // Skip if slot already allocated
              if (allocatedSlots[slotKey]) continue;

              // Check if faculty is already scheduled at this time
              const facultyBusy = facultySchedules[selectedFaculty.id].some(
                (schedule) => {
                  return (
                    schedule.day === day &&
                    ((schedule.startSlot <= slotIdx &&
                      schedule.endSlot > slotIdx) ||
                      schedule.startSlot === slotIdx)
                  );
                }
              );

              if (facultyBusy) continue;

              // Check if section is already scheduled at this time
              const sectionBusy = sectionSchedules[sectionKey].some(
                (schedule) => {
                  return (
                    schedule.day === day &&
                    ((schedule.startSlot <= slotIdx &&
                      schedule.endSlot > slotIdx) ||
                      schedule.startSlot === slotIdx)
                  );
                }
              );

              if (sectionBusy) continue;

              // Schedule found! Create it
              const startTime = timeToDateTime(slot.start, day);
              const endTime = timeToDateTime(slot.end, day);

              // Mark slot as allocated
              allocatedSlots[slotKey] = true;

              // Update faculty schedule
              facultySchedules[selectedFaculty.id].push({
                day: day,
                startSlot: slotIdx,
                endSlot: slotIdx + 1,
                course: course.name,
              });

              // Update section schedule
              sectionSchedules[sectionKey].push({
                day: day,
                startSlot: slotIdx,
                endSlot: slotIdx + 1,
                course: course.name,
              });

              // Create class schedule
              scheduleData.push({
                courseId: course.id,
                facultyId: selectedFaculty.id,
                classId: section.classId,
                sectionId: section.id,
                day_of_week: day,
                start_time: startTime,
                end_time: endTime,
              });

              sessionsScheduled++;
            }
          }
        }

        // If still couldn't schedule all sessions, log warning
        if (sessionsScheduled < sessionsPerWeek) {
          console.log(
            `⚠️ Could only schedule ${sessionsScheduled}/${sessionsPerWeek} sessions for ${course.name} in ${section.name}`
          );
        }
      }
    }

    // STEP 7: Insert schedules into the database
    if (scheduleData.length > 0) {
      const batchSize = 500;
      for (let i = 0; i < scheduleData.length; i += batchSize) {
        const batch = scheduleData.slice(i, i + batchSize);
        await prisma.classSchedule.createMany({
          data: batch,
          skipDuplicates: true,
        });
        console.log(
          `✅ Created batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
            scheduleData.length / batchSize
          )} of class schedules`
        );
      }
    }

    console.log(
      `✅ Successfully created ${scheduleData.length} class schedules`
    );

    // STEP 8: Generate statistics for validation
    const deptCounts = {};
    const dayCounts = {};
    const slotCounts = {};
    const courseCounts = {};
    const facultyCounts = {};
    const sectionCounts = {};
    const labVsRegularCounts = { lab: 0, regular: 0 };

    scheduleData.forEach((schedule) => {
      const courseInfo = courseSections.find(
        (cs) => cs.courseId === schedule.courseId
      );
      const deptCode = courseInfo?.section?.class?.department?.code;

      if (deptCode) {
        deptCounts[deptCode] = (deptCounts[deptCode] || 0) + 1;
      }

      dayCounts[schedule.day_of_week] =
        (dayCounts[schedule.day_of_week] || 0) + 1;

      // Find which time slot this is
      for (let i = 0; i < timeSlots.length; i++) {
        const slot = timeSlots[i];
        if (
          schedule.start_time.getHours() === parseInt(slot.start.split(':')[0])
        ) {
          slotCounts[`Slot ${i + 1} (${slot.start}-${slot.end})`] =
            (slotCounts[`Slot ${i + 1} (${slot.start}-${slot.end})`] || 0) + 1;
          break;
        }
      }

      // Count by course
      courseCounts[schedule.courseId] =
        (courseCounts[schedule.courseId] || 0) + 1;

      // Count by faculty
      facultyCounts[schedule.facultyId] =
        (facultyCounts[schedule.facultyId] || 0) + 1;

      // Count by section
      sectionCounts[schedule.sectionId] =
        (sectionCounts[schedule.sectionId] || 0) + 1;

      // Count lab vs regular courses
      const isLab = courseInfo?.course?.name?.includes('Lab') || false;
      if (isLab) {
        labVsRegularCounts.lab++;
      } else {
        labVsRegularCounts.regular++;
      }
    });

    console.log('\n--- Scheduling Results ---');
    console.log(`Total schedules created: ${scheduleData.length}`);
    console.log(`Total sections processed: ${sectionCourses.size}`);
    console.log(
      `Average courses per section: ${
        Object.values(sectionsStats).reduce((a, b) => a + b, 0) /
        Object.keys(sectionsStats).length
      }`
    );

    console.log('\n--- Schedule Statistics ---');
    console.log('Schedule distribution by department:');
    console.log(deptCounts);

    console.log('\nSchedule distribution by day:');
    console.log(dayCounts);

    console.log('\nSchedule distribution by time slot:');
    console.log(slotCounts);

    console.log('\nLab vs Regular courses:');
    console.log(labVsRegularCounts);

    console.log(
      '\nNumber of faculty with schedules:',
      Object.keys(facultyCounts).length
    );
    console.log(
      'Average sessions per faculty:',
      Object.values(facultyCounts).reduce((a, b) => a + b, 0) /
        Object.keys(facultyCounts).length
    );

    console.log(
      '\nNumber of sections with schedules:',
      Object.keys(sectionCounts).length
    );
    console.log(
      'Average sessions per section:',
      Object.values(sectionCounts).reduce((a, b) => a + b, 0) /
        Object.keys(sectionCounts).length
    );

    console.log('\nSection schedule details:');
    // Show the sections with most and fewest classes
    const sectionCountsArray = Object.entries(sectionCounts).map(
      ([id, count]) => ({ id: parseInt(id), count })
    );
    sectionCountsArray.sort((a, b) => b.count - a.count);

    console.log('Top 5 sections by session count:');
    for (let i = 0; i < Math.min(5, sectionCountsArray.length); i++) {
      const section = sectionCountsArray[i];
      console.log(`Section ID ${section.id}: ${section.count} sessions`);
    }

    console.log('Bottom 5 sections by session count:');
    for (
      let i = Math.max(0, sectionCountsArray.length - 5);
      i < sectionCountsArray.length;
      i++
    ) {
      const section = sectionCountsArray[i];
      console.log(`Section ID ${section.id}: ${section.count} sessions`);
    }
  } catch (error) {
    console.error('Error seeding class schedules:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedClassSchedules().catch((e) => {
  console.error(e);
  process.exit(1);
});
