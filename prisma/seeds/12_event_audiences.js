const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.eventAudience.create({
    data: {
      eventId: 1,
      audience_type: 'student',
      audience_id: 1,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
