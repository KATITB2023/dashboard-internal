import { useSession } from 'next-auth/react';
import { ListPengunjung } from '~/components/pengunjung/ListPengunjung';
import AdminRoute from '~/layout/AdminRoute';
import { withSession } from '~/server/auth/withSession';

export const getServerSideProps = withSession({ force: true });

export default function PengunjungListPage() {
  const { data: session } = useSession();

  return (
    <AdminRoute session={session}>
      <ListPengunjung />
    </AdminRoute>
  );
}
