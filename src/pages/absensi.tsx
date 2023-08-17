import { useSession } from 'next-auth/react';
import AttendancePageMentor from '~/components/attendance/mentor';
import MentorRoute from '~/layout/MentorRoute';
import { withSession } from '~/server/auth/withSession';

export const getServerSideProps = withSession({ force: true });

export default function Absensi() {
  const { data: session } = useSession();

  return (
    <MentorRoute session={session}>
      <AttendancePageMentor />
    </MentorRoute>
  );
}
