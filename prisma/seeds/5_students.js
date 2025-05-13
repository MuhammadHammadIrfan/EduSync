const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dept = await prisma.department.findFirst({ where: { code: 'CS' } });
  const cls = await prisma.class.findFirst();
  const sec = await prisma.section.findFirst();

  await prisma.student.upsert({
    where: { email: 'john@student.edu' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@student.edu',
      password_hash: 'hashed_pw',
      departmentId: dept.id,
      classId: cls.id,
      sectionId: sec.id,
      created_at: new Date(),
    },
  });

  console.log('Students seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
