import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';

export async function requireRole(context, expectedRole) {
  try {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );

    // Debug logging - remove in production
    console.log('Session data:', session);

    if (!session) {
      console.log('No session found, redirecting to login');
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    // Check the user role from session
    if (session.user?.role !== expectedRole) {
      console.log(
        `Role mismatch: expected ${expectedRole}, got ${session.user?.role}`
      );
      return {
        redirect: {
          destination: '/unauthorized',
          permanent: false,
        },
      };
    }

    // Success: user is authenticated with correct role
    // Make sure all user properties are defined or null to prevent serialization errors
    return {
      props: {
        user: {
          id: session.user.id || null,
          email: session.user.email || null,
          name: session.user.name || null, // This was likely undefined
          role: session.user.role || null,
        },
      },
    };
  } catch (error) {
    console.error('Error in requireRole:', error);
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}
