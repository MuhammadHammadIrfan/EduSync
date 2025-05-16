const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seedFaculty() {
  const password = 'faculty@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const departments = await prisma.department.findMany();
  const facultyData = [];

  for (const dept of departments) {
    for (let i = 1; i <= 12; i++) {
      facultyData.push({
        name: `Faculty ${dept.code} ${i}`,
        email: `faculty${i}@${dept.code.toLowerCase()}.edusync.com`,
        password_hash: hashedPassword,
        departmentId: dept.id,
      });
    }
  }

  await prisma.faculty.createMany({
    data: facultyData,
    skipDuplicates: true,
  });

  console.log('✅ Faculty seeded successfully.');
}

seedFaculty()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcryptjs');

// const prisma = new PrismaClient();

// async function seedFaculty() {
//   const password = 'faculty@123';
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const departments = await prisma.department.findMany();
//   const csDept = departments.find((d) => d.code === 'CS');
//   const seDept = departments.find((d) => d.code === 'SE');
//   const aiDept = departments.find((d) => d.code === 'AI');

//   if (!csDept || !seDept || !aiDept) {
//     console.error('❌ Required departments not found');
//     return;
//   }

//   await prisma.faculty.createMany({
//     data: [
//       {
//         name: 'Dr. Junaid Arif',
//         email: 'junaid.arif@faculty.edusync.com',
//         password_hash: hashedPassword,
//         departmentId: csDept.id,
//       },
//       {
//         name: 'Dr. Sana Khalid',
//         email: 'sana.khalid@faculty.edusync.com',
//         password_hash: hashedPassword,
//         departmentId: seDept.id,
//       },
//       {
//         name: 'Prof. Ahmad Raza',
//         email: 'ahmad.raza@faculty.edusync.com',
//         password_hash: hashedPassword,
//         departmentId: aiDept.id,
//       },
//       {
//         name: 'Dr. Hira Anwar',
//         email: 'hira.anwar@faculty.edusync.com',
//         password_hash: hashedPassword,
//         departmentId: csDept.id,
//       },
//     ],
//   });

//   console.log('✅ Faculty seeded successfully');
//   await prisma.$disconnect();
// }

// seedFaculty().catch((e) => {
//   console.error(e);
//   prisma.$disconnect();
// });
