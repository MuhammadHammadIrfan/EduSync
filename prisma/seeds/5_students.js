const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seedStudents() {
  const password = 'student@123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const existingStudents = await prisma.student.findMany();
  if (existingStudents.length > 0) {
    console.log('Students already seeded. Skipping...');
    return;
  }

  
  const studentsData = [
    {
      name: 'Ali Raza',
      email: 'ali.raza@student.edusync.com',
      password_hash: hashedPassword,
      departmentId: 1, // CS
      classId: 1, // e.g. CS-1
      sectionId: 1, // e.g. A
    },
    {
      name: 'Fatima Khalid',
      email: 'fatima.khalid@student.edusync.com',
      password_hash: hashedPassword,
      departmentId: 2, // SE
      classId: 2, // SE-1
      sectionId: 2, // e.g. B
    },
    {
      name: 'Usman Tariq',
      email: 'usman.tariq@student.edusync.com',
      password_hash: hashedPassword,
      departmentId: 3, // AI
      classId: 3, // AI-1
      sectionId: 3, // e.g. C
    },
  ];

  await prisma.student.createMany({
    data: studentsData,
    skipDuplicates: true,
  });

  console.log('Students seeded successfully.');
}

seedStudents()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
