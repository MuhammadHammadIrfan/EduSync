const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seedStudentsForYear(year) {
  const password = 'student@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const studentsData = [];
  const departments = await prisma.department.findMany();
  const classes = await prisma.class.findMany();
  const sections = await prisma.section.findMany();

  console.log(`Seeding students for Year ${year}`);
  console.log(`Total Departments: ${departments.length}`);
  console.log(`Total Classes: ${classes.length}`);
  console.log(`Total Sections: ${sections.length}`);

  // Add 50 students for each section of the specified year for each department
  for (const dept of departments) {
    console.log(`Processing Department: ${dept.name}`);
    const classesForYear = classes.filter(
      (cls) => cls.departmentId === dept.id && cls.name.includes(`Year ${year}`)
    );

    for (const cls of classesForYear) {
      console.log(`  Processing Class: ${cls.name}`);
      const sectionsForClass = sections.filter((sec) => sec.classId === cls.id);

      for (const sec of sectionsForClass) {
        console.log(`    Processing Section: ${sec.name}`);
        if (!sec.advisorId) {
          console.warn(
            `Skipping section ${sec.name} of class ${cls.name} in department ${dept.name} due to missing advisorId.`
          );
          continue;
        }

        // Replace spaces in section name with an empty string
        const sanitizedSectionName = sec.name.replace(/\s+/g, '');

        for (let i = 1; i <= 50; i++) {
          studentsData.push({
            name: `Student ${dept.code} ${cls.name} ${sanitizedSectionName} ${i}`,
            email: `student${i}.${sanitizedSectionName.toLowerCase()}.year${year}@${dept.code.toLowerCase()}.edusync.com`,
            password_hash: hashedPassword,
            departmentId: dept.id,
            classId: cls.id,
            sectionId: sec.id,
          });
        }
      }
    }
  }

  console.log(
    `Total Students to Insert for Year ${year}: ${studentsData.length}`
  );

  // Insert students in batches of 500
  const batchSize = 500;
  for (let i = 0; i < studentsData.length; i += batchSize) {
    const batch = studentsData.slice(i, i + batchSize);
    try {
      await prisma.student.createMany({
        data: batch,
        skipDuplicates: true,
      });
      console.log(
        `✅ Batch ${i / batchSize + 1} for Year ${year} inserted successfully.`
      );
    } catch (error) {
      console.error(
        `❌ Error inserting batch ${i / batchSize + 1} for Year ${year}:`,
        error
      );
    }
  }

  console.log(`✅ All students for Year ${year} seeded successfully.`);
}

async function main() {
  // Seed students for Year 1, Year 2, Year 3, and Year 4
  await seedStudentsForYear(1);
  await seedStudentsForYear(2);
  await seedStudentsForYear(3);
  await seedStudentsForYear(4);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });











  

// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcryptjs');
// const prisma = new PrismaClient();

// async function seedStudents() {
//   const password = 'student@123';
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const existingStudents = await prisma.student.findMany();
//   if (existingStudents.length > 0) {
//     console.log('Students already seeded. Skipping...');
//     return;
//   }

//   const studentsData = [
//     {
//       name: 'Ali Raza',
//       email: 'ali.raza@student.edusync.com',
//       password_hash: hashedPassword,
//       departmentId: 1, // CS
//       classId: 1, // e.g. CS-1
//       sectionId: 1, // e.g. A
//     },
//     {
//       name: 'Fatima Khalid',
//       email: 'fatima.khalid@student.edusync.com',
//       password_hash: hashedPassword,
//       departmentId: 2, // SE
//       classId: 2, // SE-1
//       sectionId: 2, // e.g. B
//     },
//     {
//       name: 'Usman Tariq',
//       email: 'usman.tariq@student.edusync.com',
//       password_hash: hashedPassword,
//       departmentId: 3, // AI
//       classId: 3, // AI-1
//       sectionId: 3, // e.g. C
//     },
//   ];

//   await prisma.student.createMany({
//     data: studentsData,
//     skipDuplicates: true,
//   });

//   console.log('Students seeded successfully.');
// }

// seedStudents()
//   .catch((e) => {
//     console.error(e);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
