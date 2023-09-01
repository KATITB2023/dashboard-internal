import { useSession } from 'next-auth/react';
import { LandingPengunjung } from '~/components/pengunjung/LandingPengunjung';
import AdminRoute from '~/layout/AdminRoute';
import { withSession } from '~/server/auth/withSession';

export const getServerSideProps = withSession({ force: true });

export default function Pengunjung() {
  const { data: session } = useSession();

  return (
    <AdminRoute session={session}>
      <LandingPengunjung />
    </AdminRoute>
  );
}
