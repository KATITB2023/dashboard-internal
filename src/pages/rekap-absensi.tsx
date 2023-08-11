import { useSession } from 'next-auth/react';
import AttendancePageAdmin from '~/components/attendance/admin';
import AdminRoute from '~/layout/AdminRoute';

export default function RekapAbsensi() {
  const { data: session } = useSession();

  return (
    <AdminRoute session={session}>
      <AttendancePageAdmin />
    </AdminRoute>
  );
}
