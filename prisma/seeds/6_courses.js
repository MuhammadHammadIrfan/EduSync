const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.course.createMany({
    data: [
      {
        name: 'Introduction to Programming',
        course_code: 'CS101',
        departmentId: 1,
        credit_hours: 3,
      },
      {
        name: 'Data Structures',
        course_code: 'CS102',
        departmentId: 1,
        credit_hours: 4,
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
