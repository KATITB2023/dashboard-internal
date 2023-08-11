import React from 'react';
import { useRouter } from 'next/router';
import { type Session } from 'next-auth';
import { Redirect } from '~/components/Redirect';
import { UserRole } from '@prisma/client';

interface Props {
  children?: React.ReactNode;
  session: Session | null;
  allowEO?: boolean;
}

const AdminRoute = ({ children, session, allowEO = false }: Props) => {
  if (!session) {
    return <Redirect />;
  }

  if (allowEO) {
    if (
      session.user.role === UserRole.ADMIN ||
      session.user.role === UserRole.EO
    ) {
      return <>{children}</>;
    }
  } else {
    if (session.user.role === UserRole.ADMIN) {
      return <>{children}</>;
    }
  }
};

export default AdminRoute;
