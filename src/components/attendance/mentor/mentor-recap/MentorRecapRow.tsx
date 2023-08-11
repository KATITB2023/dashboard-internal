import { Td, Tr } from '@chakra-ui/react';
import { Status } from '@prisma/client';
import { RouterOutputs, api } from '~/utils/api';
import { MentorStatusBox } from './MentorStatusBox';

type mentorGetAttendanceRecordOutput =
  RouterOutputs['attendance']['mentorGetAttendance']['data'][0];

interface EventListRowProps {
  record: mentorGetAttendanceRecordOutput;
  num: number;
  editRecord: (
    record: mentorGetAttendanceRecordOutput,
    { newStatus, newDesc }: { newStatus: Status; newDesc: string },
    successFn: () => void
  ) => void;
}

export const MentorRecapRow = ({
  record,
  num,
  editRecord
}: EventListRowProps) => {
  const nim = record.student.nim;
  const nama = record.student.profile && record.student.profile.name;

  return (
    <Tr>
      <Td>{num}</Td>
      <Td>{nim || '-'}</Td>
      <Td>{nama || '-'}</Td>
      <Td>{record.date.toLocaleDateString()}</Td>
      <Td>{record.date.toLocaleTimeString()}</Td>
      <Td>{<MentorStatusBox record={record} editRecord={editRecord} />}</Td>
      <Td>{record.reason}</Td>
    </Tr>
  );
};
