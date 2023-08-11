import { useSession } from 'next-auth/react';
import React from 'react';
import { AddPoint } from '~/components/add-point';
import MentorRoute from '~/layout/MentorRoute';
import { withSession } from '~/server/auth/withSession';

export const getServerSideProps = withSession({ force: true });

export default function AddPointPage() {
  const { data: session } = useSession();

  return (
    <MentorRoute session={session}>
      <AddPoint />
    </MentorRoute>
  );
}
