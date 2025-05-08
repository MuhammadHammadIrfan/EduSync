import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default NextAuth({
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
            console.log('admin');
            user = await prisma.admin.findUnique({ where: { email } });
            break;
          case 'faculty':
            console.log('faculty');
            user = await prisma.faculty.findUnique({ where: { email } });
            break;
          case 'student':
            console.log('student');
            user = await prisma.student.findUnique({ where: { email } });
            break;
          default:
            console.log('default');
            return null;
        }

        if (!user){
          console.log('User not found');
          return null;
        };

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) return null;
        console.log(isValid);
        return { id: user.id, email: user.email, role };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
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
});
