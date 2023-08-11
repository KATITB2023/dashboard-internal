import { useSession } from 'next-auth/react';
import AttendancePageAdmin from '~/components/attendance/admin';
import AdminRoute from '~/layout/AdminRoute';
import { withSession } from '~/server/auth/withSession';

export const getServerSideProps = withSession({ force: true });

export default function RekapAbsensi() {
  const { data: session } = useSession();

  return (
    <AdminRoute session={session}>
      <AttendancePageAdmin />
    </AdminRoute>
  );
}
