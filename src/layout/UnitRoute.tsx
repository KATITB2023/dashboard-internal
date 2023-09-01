import React from 'react';
import { useRouter } from 'next/router';
import { type Session } from 'next-auth';
import { UserRole } from '@prisma/client';

interface Props {
  children?: React.ReactNode;
  session: Session | null;
}

const UnitRoute = ({ children, session }: Props) => {
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
    } else if (session.user.role === UserRole.UNIT) {
      setAuthorized(true);
    } else {
      void router.push('/welcome');
    }
  };

  return authorized && <>{children}</>;
};

export default UnitRoute;
