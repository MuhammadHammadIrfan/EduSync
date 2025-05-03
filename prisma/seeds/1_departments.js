const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.department.createMany({
    data: [
      { name: 'Computer Science', code: 'CS' },
      { name: 'Electrical Engineering', code: 'EE' },
    ],
  });
  console.log('Departments seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
