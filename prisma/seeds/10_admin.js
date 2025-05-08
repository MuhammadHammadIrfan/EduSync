const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {

  const password = 'admin@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      name: 'Administration',
      email: 'administration@admin.edusync.com',
      password_hash: hashedPassword,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
