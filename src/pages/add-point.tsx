import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Redirect } from '~/components/Redirect';
import Layout from '~/layout';
import { api } from '~/utils/api';

export default function AddPoint() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return <Redirect />;
  if (session?.user.role === UserRole.MENTOR) return <AttendancePageMentor />;
  return <Redirect />;
}
