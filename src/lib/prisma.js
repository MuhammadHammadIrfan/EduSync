// Create this file to use a singleton pattern for PrismaClient

import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

// Create a simple client without custom options
// The connection pool settings are usually defined in your database URL or schema
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

// In development, save the instance to avoid multiple connections
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Add cleanup function for graceful shutdowns
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
