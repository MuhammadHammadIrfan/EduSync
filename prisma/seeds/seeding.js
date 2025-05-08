const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Seed Departments
  const departmentsData = [
    { name: 'Computer Science', code: 'CS' },
    { name: 'Software Engineering', code: 'SE' },
    { name: 'Artificial Intelligence', code: 'AI' },
    { name: 'Data Science', code: 'DS' },
    { name: 'Information Systems', code: 'IS' },
    { name: 'Electrical Engineering', code: 'EE' },
  ];

  const departments = await prisma.department.createMany({
    data: departmentsData,
    skipDuplicates: true,
  });

  // Retrieve department IDs
  const deptRecords = await prisma.department.findMany();

  // 2. Seed Classes
  const classesData = [];
  for (const dept of deptRecords) {
    for (let year = 1; year <= 4; year++) {
      classesData.push({
        name: `${dept.code} Year ${year}`,
        departmentId: dept.id,
      });
    }
  }

  await prisma.class.createMany({
    data: classesData,
    skipDuplicates: true,
  });

  // Retrieve class IDs
  const classRecords = await prisma.class.findMany();

  // 3. Seed Sections
  const sectionsData = [];
  for (const cls of classRecords) {
    // Determine number of sections based on department
    const dept = deptRecords.find((d) => d.id === cls.departmentId);
    let numSections = 3; // Default
    if (['CS', 'SE', 'EE'].includes(dept.code)) {
      numSections = 4;
    } else if (['AI', 'DS', 'IS'].includes(dept.code)) {
      numSections = 2;
    }

    for (let i = 1; i <= numSections; i++) {
      sectionsData.push({
        name: `Section ${String.fromCharCode(64 + i)}`, // A, B, C, ...
        classId: cls.id,
        room_no: `Room ${100 + i}`,
        advisorId: 1, // Placeholder, ensure this faculty exists
      });
    }
  }

  await prisma.section.createMany({
    data: sectionsData,
    skipDuplicates: true,
  });

  // Retrieve section IDs
  const sectionRecords = await prisma.section.findMany();

  // 4. Seed Courses
  const coursesData = [
    // CS Department
    {
      name: 'Introduction to Programming',
      course_code: 'CS101',
      credit_hours: 3,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Introduction to Programming Lab',
      course_code: 'CS102',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Object Oriented Programming',
      course_code: 'CS103',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Object Oriented Programming Lab',
      course_code: 'CS104',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Data Structures',
      course_code: 'CS201',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Data Structures Lab',
      course_code: 'CS202',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Algorithms',
      course_code: 'CS203',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Algorithms Lab',
      course_code: 'CS204',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Computer Networks',
      course_code: 'CS301',
      credit_hours: 3,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Computer Networks Lab',
      course_code: 'CS302',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Database Systems',
      course_code: 'CS303',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Database Systems Lab',
      course_code: 'CS304',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Operating Systems',
      course_code: 'CS401',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Operating Systems Lab',
      course_code: 'CS402',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Software Engineering',
      course_code: 'CS403',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Software Engineering Lab',
      course_code: 'CS404',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Artificial Intelligence',
      course_code: 'CS501',
      credit_hours: 3,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Artificial Intelligence Lab',
      course_code: 'CS502',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Machine Learning',
      course_code: 'CS503',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },
    {
      name: 'Machine Learning Lab',
      course_code: 'CS504',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'CS').id,
    },

    // SE Department
    {
      name: 'Introduction to Software Engineering',
      course_code: 'SE101',
      credit_hours: 3,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'Introduction to Software Engineering Lab',
      course_code: 'SE102',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'Software Architecture',
      course_code: 'SE201',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'Software Architecture Lab',
      course_code: 'SE202',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'Software Testing',
      course_code: 'SE203',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'Software Testing Lab',
      course_code: 'SE204',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'Agile Methodology',
      course_code: 'SE301',
      credit_hours: 3,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'Agile Methodology Lab',
      course_code: 'SE302',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'User Interface Design',
      course_code: 'SE303',
      credit_hours: 3,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'User Interface Design Lab',
      course_code: 'SE304',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'Project Management',
      course_code: 'SE401',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'Project Management Lab',
      course_code: 'SE402',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'Cloud Computing',
      course_code: 'SE403',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },
    {
      name: 'Cloud Computing Lab',
      course_code: 'SE404',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'SE').id,
    },

    // AI Department
    {
      name: 'Introduction to Artificial Intelligence',
      course_code: 'AI101',
      credit_hours: 3,
      departmentId: deptRecords.find((d) => d.code === 'AI').id,
    },
    {
      name: 'Introduction to Artificial Intelligence Lab',
      course_code: 'AI102',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'AI').id,
    },
    {
      name: 'Machine Learning Algorithms',
      course_code: 'AI201',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'AI').id,
    },
    {
      name: 'Machine Learning Algorithms Lab',
      course_code: 'AI202',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'AI').id,
    },
    {
      name: 'Deep Learning',
      course_code: 'AI301',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'AI').id,
    },
    {
      name: 'Deep Learning Lab',
      course_code: 'AI302',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'AI').id,
    },
    {
      name: 'Computer Vision',
      course_code: 'AI401',
      credit_hours: 3,
      departmentId: deptRecords.find((d) => d.code === 'AI').id,
    },
    {
      name: 'Computer Vision Lab',
      course_code: 'AI402',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'AI').id,
    },
    {
      name: 'Natural Language Processing',
      course_code: 'AI501',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'AI').id,
    },
    {
      name: 'Natural Language Processing Lab',
      course_code: 'AI502',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'AI').id,
    },

    // DS Department
    {
      name: 'Introduction to Data Science',
      course_code: 'DS101',
      credit_hours: 3,
      departmentId: deptRecords.find((d) => d.code === 'DS').id,
    },
    {
      name: 'Introduction to Data Science Lab',
      course_code: 'DS102',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'DS').id,
    },
    {
      name: 'Data Mining',
      course_code: 'DS201',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'DS').id,
    },
    {
      name: 'Data Mining Lab',
      course_code: 'DS202',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'DS').id,
    },
    {
      name: 'Big Data Analytics',
      course_code: 'DS301',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'DS').id,
    },
    {
      name: 'Big Data Analytics Lab',
      course_code: 'DS302',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'DS').id,
    },
    {
      name: 'Predictive Analytics',
      course_code: 'DS401',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'DS').id,
    },
    {
      name: 'Predictive Analytics Lab',
      course_code: 'DS402',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'DS').id,
    },

    // IS (Information Security) Department
    {
      name: 'Introduction to Information Security',
      course_code: 'IS101',
      credit_hours: 3,
      departmentId: deptRecords.find((d) => d.code === 'IS').id,
    },
    {
      name: 'Introduction to Information Security Lab',
      course_code: 'IS102',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'IS').id,
    },
    {
      name: 'Cryptography',
      course_code: 'IS201',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'IS').id,
    },
    {
      name: 'Cryptography Lab',
      course_code: 'IS202',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'IS').id,
    },
    {
      name: 'Network Security',
      course_code: 'IS301',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'IS').id,
    },
    {
      name: 'Network Security Lab',
      course_code: 'IS302',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'IS').id,
    },
    {
      name: 'Ethical Hacking',
      course_code: 'IS401',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'IS').id,
    },
    {
      name: 'Ethical Hacking Lab',
      course_code: 'IS402',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'IS').id,
    },

    // EE Department
    {
      name: 'Introduction to Electrical Engineering',
      course_code: 'EE101',
      credit_hours: 3,
      departmentId: deptRecords.find((d) => d.code === 'EE').id,
    },
    {
      name: 'Introduction to Electrical Engineering Lab',
      course_code: 'EE102',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'EE').id,
    },
    {
      name: 'Digital Logic Design',
      course_code: 'EE201',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'EE').id,
    },
    {
      name: 'Digital Logic Design Lab',
      course_code: 'EE202',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'EE').id,
    },
    {
      name: 'Signals and Systems',
      course_code: 'EE301',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'EE').id,
    },
    {
      name: 'Signals and Systems Lab',
      course_code: 'EE302',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'EE').id,
    },
    {
      name: 'Control Systems',
      course_code: 'EE401',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'EE').id,
    },
    {
      name: 'Control Systems Lab',
      course_code: 'EE402',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'EE').id,
    },
    {
      name: 'Electromagnetic Fields',
      course_code: 'EE501',
      credit_hours: 4,
      departmentId: deptRecords.find((d) => d.code === 'EE').id,
    },
    {
      name: 'Electromagnetic Fields Lab',
      course_code: 'EE502',
      credit_hours: 1,
      departmentId: deptRecords.find((d) => d.code === 'EE').id,
    },
  ];

  await prisma.course.createMany({
    data: coursesData,
    skipDuplicates: true,
  });

  // Retrieve course IDs
  const courseRecords = await prisma.course.findMany();

  // 5. Seed CourseClass
  const courseClassData = [];
  for (const course of courseRecords) {
    // Assign course to classes based on department
    const relatedClasses = classRecords.filter(
      (c) => c.departmentId === course.departmentId
    );
    for (const cls of relatedClasses) {
      courseClassData.push({
        courseId: course.id,
        classId: cls.id,
      });
    }
  }

  await prisma.courseClass.createMany({
    data: courseClassData,
    skipDuplicates: true,
  });

  // Retrieve courseClass IDs
  const courseClassRecords = await prisma.courseClass.findMany();

  // 6. Seed CourseSection
  const courseSectionData = [];
  for (const cc of courseClassRecords) {
    const relatedSections = sectionRecords.filter(
      (s) => s.classId === cc.classId
    );
    for (const sec of relatedSections) {
      courseSectionData.push({
        courseClassId: cc.id,
        sectionId: sec.id,
        courseId: cc.courseId,
      });
    }
  }

  await prisma.courseSection.createMany({
    data: courseSectionData,
    skipDuplicates: true,
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
