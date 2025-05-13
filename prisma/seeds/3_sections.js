const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const classItem = await prisma.class.findFirst({
    where: { name: 'BSCS 2021' },
  });

  let faculty = await prisma.faculty.findUnique({
    where: { email: 'smith@university.edu' },
  });

  if (!faculty) {
    faculty = await prisma.faculty.create({
      data: {
        name: 'Dr. Smith',
        email: 'smith@university.edu',
        password_hash: 'hashed_password',
        departmentId: classItem.departmentId,
        created_at: new Date(),
      },
    });
  }

  await prisma.section.create({
    data: {
      name: 'A',
      classId: classItem.id,
      room_no: '101',
      advisorId: faculty.id,
    },
  });

  console.log('Sections seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
