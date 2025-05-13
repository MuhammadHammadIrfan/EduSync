const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.classSchedule.createMany({
    data: [
      {
        courseId: 1,
        facultyId: 1,
        classId: 1,
        sectionId: 1,
        day_of_week: 'Monday',
        start_time: new Date('2025-05-05T09:00:00Z'),
        end_time: new Date('2025-05-05T10:30:00Z'),
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
