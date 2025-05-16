import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Export auth options so they can be imported elsewhere
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        const { email, password, role } = credentials;

        let user;
        switch (role) {
          case 'admin':
            user = await prisma.admin.findUnique({ where: { email } });
            break;
          case 'faculty':
            user = await prisma.faculty.findUnique({ where: { email } });
            break;
          case 'student':
            user = await prisma.student.findUnique({ where: { email } });
            break;
          default:
            return null;
        }

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) return null;

        // Return user with name included
        return {
          id: user.id,
          email: user.email,
          role,
          name: user.name || null, // Include the name, or null if it doesn't exist
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Make sure all required fields are present
      session.user = session.user || {};
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name || null; // Ensure name is at least null, not undefined
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        // If user comes with a name property, add it to the token
        if (user.name) {
          token.name = user.name;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  // Make sure NEXTAUTH_SECRET is defined in your environment
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
