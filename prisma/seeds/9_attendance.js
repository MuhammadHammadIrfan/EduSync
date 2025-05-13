const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.attendance.createMany({
    data: [
      {
        studentId: 1,
        courseId: 1,
        date: new Date('2025-05-01'),
        status: 'Present',
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
