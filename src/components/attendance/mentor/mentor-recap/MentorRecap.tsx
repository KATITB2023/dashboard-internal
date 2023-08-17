import {
  Box,
  Center,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react';
import React from 'react';
import { type RouterOutputs, api } from '~/utils/api';
import { type Status } from '@prisma/client';
import { TRPCClientError } from '@trpc/client';
import { MentorStatusBox } from './MentorStatusBox';

type GroupData = RouterOutputs['group']['mentorGetAttendanceData'];

interface GroupProps {
  group: GroupData | undefined;
  emit: () => Promise<void>;
  eventId: string;
  fetching: boolean;
}

export interface RecordProps {
  profile: {
    name: string;
    userId: string;
  };
  attendance: {
    id: string;
    status: Status;
    reason: string | null;
  }[];
}

export const MentorRecap = ({ group, emit, eventId, fetching }: GroupProps) => {
  const toast = useToast();
  const editRecordMutation = api.attendance.editAttendanceRecord.useMutation();
  const addRecordMutation = api.attendance.addAttendanceRecord.useMutation();

  const editRecord = async (
    record: RecordProps,
    { newStatus, newDesc }: { newStatus: Status; newDesc: string }
  ) => {
    if (newStatus === record.attendance[0]?.status) {
      return;
    }

    try {
      let res = null;
      if (record.attendance.length > 0) {
        res = await editRecordMutation.mutateAsync({
          attendanceId: record.attendance[0]?.id || '',
          kehadiran: newStatus,
          reason: newDesc
        });
      } else {
        res = await addRecordMutation.mutateAsync({
          studentId: record.profile.userId,
          eventId,
          kehadiran: newStatus,
          reason: newDesc
        });
      }

      toast({
        description: res.message,
        status: 'success',
        position: 'top'
      });

      await emit();
    } catch (err: unknown) {
      if (!(err instanceof TRPCClientError)) throw err;
      toast({
        description: err.message,
        status: 'error',
        duration: 3000,
        position: 'top'
      });
    }
  };

  return (
    <Flex flexDir='column'>
      <Box
        borderRadius='12px'
        overflow='hidden'
        mt='1em'
        borderRight='1px solid'
        borderLeft='1px solid'
        borderColor='gray.400'
      >
        <TableContainer>
          <Table w='100%' variant='black'>
            <Thead>
              <Td w='5%'>No.</Td>
              <Td w='15%'>NIM</Td>
              <Td w='25%'>Nama</Td>
              <Td w='25%'>Status</Td>
              <Td w='30%'>Keterangan</Td>
            </Thead>
            {fetching ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <Tbody>
                {group?.map((dataGroup, index) => {
                  return (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>{dataGroup.user.nim}</Td>
                      <Td>{dataGroup.user.profile?.name}</Td>
                      <Td>
                        <MentorStatusBox
                          record={dataGroup.user as RecordProps}
                          editRecord={editRecord}
                        />
                      </Td>
                      <Td>{dataGroup.user.attendance[0]?.reason || ''}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            )}
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
};
