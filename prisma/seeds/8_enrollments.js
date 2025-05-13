const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.studentCourseEnrollment.createMany({
    data: [
      {
        studentId: 1,
        courseId: 1,
        enrolled_at: new Date(),
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
