import { useSession } from 'next-auth/react';
import AdminRoute from '~/layout/AdminRoute';
import Layout from '~/layout/index';
import { withSession } from '~/server/auth/withSession';

export const getServerSideProps = withSession({ force: true });

export default function ArticleCMS() {
  const { data: session } = useSession();

  return (
    <AdminRoute session={session}>
      <Layout type='admin' title='Article CMS' fullBg={true}></Layout>
    </AdminRoute>
  );
}
