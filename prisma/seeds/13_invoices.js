const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.invoice.create({
    data: {
      studentId: 1,
      amount: 15000,
      due_date: new Date('2025-06-01'),
      paid: false,
      generated_at: new Date(),
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
