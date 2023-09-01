import { useSession } from 'next-auth/react';
import { LandingPengunjung } from '~/components/pengunjung/LandingPengunjung';
import UnitRoute from '~/layout/UnitRoute';
import { withSession } from '~/server/auth/withSession';

export const getServerSideProps = withSession({ force: true });

export default function Pengunjung() {
  const { data: session } = useSession();

  return (
    <UnitRoute session={session}>
      <LandingPengunjung />
    </UnitRoute>
  );
}
