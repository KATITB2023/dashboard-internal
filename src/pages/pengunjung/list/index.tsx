import { useSession } from 'next-auth/react';
import { ListPengunjung } from '~/components/pengunjung/ListPengunjung';
import UnitRoute from '~/layout/UnitRoute';
import { withSession } from '~/server/auth/withSession';

export const getServerSideProps = withSession({ force: true });

export default function PengunjungListPage() {
  const { data: session } = useSession();

  return (
    <UnitRoute session={session}>
      <ListPengunjung />
    </UnitRoute>
  );
}
