const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const csDept = await prisma.department.findFirst({ where: { code: 'CS' } });
  await prisma.class.createMany({
    data: [{ name: 'BSCS 2021', departmentId: csDept.id }],
  });
  console.log('Classes seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
