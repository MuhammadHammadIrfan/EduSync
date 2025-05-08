import { getSession } from 'next-auth/react';

export function requireRole(context, expectedRole) {
  return getSession(context).then((session) => {
    if (!session || session.user.role !== expectedRole) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    return { props: { user: session.user } };
  });
}
