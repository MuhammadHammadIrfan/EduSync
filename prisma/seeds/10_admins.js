const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.admin.create({
    data: {
      name: 'Admin One',
      email: 'admin@university.com',
      password_hash: 'hashedpassword',
      created_at: new Date(),
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
