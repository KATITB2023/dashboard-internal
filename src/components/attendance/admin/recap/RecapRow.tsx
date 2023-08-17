import { Td, Tr } from '@chakra-ui/react';
import { type Status } from '@prisma/client';
import { type RouterOutputs } from '~/utils/api';
import { StatusBox } from './StatusBox';

type getAttendanceRecordOutput =
  RouterOutputs['attendance']['adminGetAttendanceRecord']['data'][0];

interface EventListRowProps {
  record: getAttendanceRecordOutput;
  num: number;
  editRecord: (
    record: getAttendanceRecordOutput,
    { newStatus, newDesc }: { newStatus: Status; newDesc: string },
    successFn: () => void
  ) => void;
}

export const RecapRow = ({ record, num, editRecord }: EventListRowProps) => {
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
      <Td>{<StatusBox record={record} editRecord={editRecord} />}</Td>
      <Td>{record.reason}</Td>
    </Tr>
  );
};
