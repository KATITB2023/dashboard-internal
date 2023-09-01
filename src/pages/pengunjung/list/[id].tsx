import { useSession } from 'next-auth/react';
import { GrantPengunjung } from '~/components/pengunjung/GrantPengunjung';
import UnitRoute from '~/layout/UnitRoute';
import { withSession } from '~/server/auth/withSession';

export const getServerSideProps = withSession({ force: true });

export default function PengunjungListPage() {
  const { data: session } = useSession();

  return (
    <UnitRoute session={session}>
      <GrantPengunjung />
    </UnitRoute>
  );
}
