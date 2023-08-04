import { Button, Td, Tr, useDisclosure } from '@chakra-ui/react';
import { AttendanceRecord, Status } from '@prisma/client';
import { MdEdit } from 'react-icons/md';
import { EditEventModal } from './EditRecordModal';
import { RouterOutputs, api } from '~/utils/api';

type getAttendanceRecordOutput =
  RouterOutputs['attendance']['adminGetAttendanceRecord']['data'][0];

interface EventListRowProps {
  record: getAttendanceRecordOutput;
  num: number;
  editRecordDesc: (recordId: string, newDesc: string) => void;
  editRecordStatus: (recordId: string, newStatus: string) => void;
}

export const RecapRow = ({
  record,
  num,
  editRecordDesc,
  editRecordStatus
}: EventListRowProps) => {
  const StatusBox = (status: Status) => {
    switch (status) {
      case Status.HADIR:
        return <Button variant='mono-outline'>Hadir</Button>;
      case Status.TIDAK_HADIR:
        return <Button variant='mono-outline'>Tidak Hadir</Button>;
      case Status.IZIN_PENDING:
        return <Button>Izin Pending</Button>;
      case Status.IZIN_DITERIMA:
        return <Button>Izin Diterima</Button>;
      case Status.IZIN_DITOLAK:
        return <Button>Izin Ditolak</Button>;
      default:
        return <Button>Unknown</Button>;
    }
  };

  const groupNumber =
    record.student.groupRelation.length > 0 &&
    record.student.groupRelation[0]?.group.group;
  const mentorName =
    record.student.mentor.length > 0 &&
    record.student.mentor[0]?.mentor.profile &&
    record.student.mentor[0]?.mentor.profile.name;
  const nim = record.student.nim;
  const nama = record.student.profile && record.student.profile.name;

  return (
    <Tr>
      <Td>{num}</Td>
      <Td>{groupNumber || '-'}</Td>
      <Td>{mentorName || '-'}</Td>
      <Td>{nim || '-'}</Td>
      <Td>{nama || '-'}</Td>
      <Td>{record.date.toLocaleDateString()}</Td>
      <Td>{record.date.toLocaleTimeString()}</Td>
      <Td>{StatusBox(record.status)}</Td>
      <Td>{record.reason}</Td>
    </Tr>
  );
};
