const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.leaveRequest.create({
    data: {
      facultyId: 1,
      leave_date: new Date('2025-05-15'),
      reason: 'Medical leave',
      status: 'Pending',
      created_at: new Date(),
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
