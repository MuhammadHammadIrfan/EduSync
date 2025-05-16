const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const departmentsData = [
    { name: 'Computer Science', code: 'CS' },
    { name: 'Software Engineering', code: 'SE' },
    { name: 'Artificial Intelligence', code: 'AI' },
    { name: 'Data Science', code: 'DS' },
    { name: 'Information Systems', code: 'IS' },
    { name: 'Electrical Engineering', code: 'EE' },
  ];

  await prisma.department.createMany({
    data: departmentsData,
  });
  console.log('Departments seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
