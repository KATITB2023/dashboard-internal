import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AttendancePageAdmin from '~/components/attendance/admin';
import AttendancePageMentor from '~/components/attendance/mentor';
import { Redirect } from '~/components/Redirect';
import { withSession } from '~/server/auth/withSession';

export const getServerSideProps = withSession({ force: true });

export default function Absensi() {
  const { data: session } = useSession();

  if (!session) return <Redirect />;
  if (session?.user.role === UserRole.ADMIN) return <AttendancePageAdmin />;
  if (session?.user.role === UserRole.MENTOR) return <AttendancePageMentor />;
  return <Redirect />;
}
