const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.event.create({
    data: {
      title: 'Welcome Orientation',
      description: 'Orientation for new students',
      event_date: new Date('2025-05-10'),
      created_by_admin: 1,
      created_at: new Date(),
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
