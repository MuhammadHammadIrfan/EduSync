  const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedEventAudience() {
  const events = await prisma.event.findMany();
  const students = await prisma.student.findMany();
  const faculty = await prisma.faculty.findMany();

  const audienceData = [];

  for (const event of events) {
    for (const student of students) {
      audienceData.push({
        eventId: event.id,
        audience_type: 'student',
        audience_id: student.id,
      });
    }

    for (const fac of faculty) {
      audienceData.push({
        eventId: event.id,
        audience_type: 'faculty',
        audience_id: fac.id,
      });
    }
  }

  await prisma.eventAudience.createMany({
    data: audienceData,
    skipDuplicates: true,
  });

  console.log('✅ Event audience seeded successfully.');
}

seedEventAudience()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });