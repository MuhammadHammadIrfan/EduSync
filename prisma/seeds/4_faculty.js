const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dept = await prisma.department.findFirst({ where: { code: 'CS' } });

  await prisma.faculty.upsert({
    where: { email: 'alice@uni.edu' },
    update: {}, // no updates for now
    create: {
      name: 'Dr. Alice',
      email: 'alice@uni.edu',
      password_hash: 'hashed_pw',
      departmentId: dept.id,
      created_at: new Date(),
    },
  });

  console.log('More faculty seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
