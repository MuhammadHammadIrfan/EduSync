const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const seedAttendance = require('./9_attendance');

async function main() {
  try {
    // Run the attendance seeding function
    await seedAttendance();
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
