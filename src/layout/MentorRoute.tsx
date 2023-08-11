import React from 'react';
import { type Session } from 'next-auth';
import { Redirect } from '~/components/Redirect';
import { UserRole } from '@prisma/client';

interface Props {
  children?: React.ReactNode;
  session: Session | null;
  allowEO?: boolean;
}

const MentorRoute = ({ children, session, allowEO = false }: Props) => {
  if (!session) {
    return <Redirect />;
  }

  if (allowEO) {
    if (
      session.user.role === UserRole.MENTOR ||
      session.user.role === UserRole.EO
    ) {
      return <>{children}</>;
    }
  } else {
    if (session.user.role === UserRole.MENTOR) {
      return <>{children}</>;
    }
  }
};

export default MentorRoute;
