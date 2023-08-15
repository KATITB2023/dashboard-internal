import React from 'react';
import { type Session } from 'next-auth';
import { useRouter } from 'next/router';
import { UserRole } from '@prisma/client';

interface Props {
  children?: React.ReactNode;
  session: Session | null;
  allowEO?: boolean;
}

const MentorRoute = ({ children, session, allowEO = false }: Props) => {
  const router = useRouter();

  const [authorized, setAuthorized] = React.useState<boolean>(false);

  React.useEffect(() => {
    authCheck();

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  const authCheck = () => {
    if (!session) {
      void router.push('/');
    } else if (session && session.user.role !== UserRole.MENTOR) {
      if (session.user.role === UserRole.ADMIN) {
        void router.push('/rekap-penilaian');
      } else if (session.user.role === UserRole.EO && allowEO) {
        setAuthorized(true);
      } else if (session.user.role === UserRole.EO && !allowEO) {
        void router.push('/welcome');
      }
    } else if (session && session.user.role === UserRole.MENTOR) {
      setAuthorized(true);
    }
  };

  return authorized && <>{children}</>;
};

export default MentorRoute;
