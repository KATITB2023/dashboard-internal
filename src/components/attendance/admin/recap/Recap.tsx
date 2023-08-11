import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Menu,
  MenuButton,
  MenuList,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Text,
  Thead,
  Tr,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { type RouterInputs, type RouterOutputs, api } from '~/utils/api';
import { RecapRow } from './RecapRow';
import { Status } from '@prisma/client';
import { TRPCClientError } from '@trpc/client';

type recordListQueryInputs =
  RouterInputs['attendance']['adminGetAttendanceRecord'];
type recordListQueryOutput =
  RouterOutputs['attendance']['adminGetAttendanceRecord']['data'][0];

interface RecapProps {
  dayId: string;
}

export const Recap = ({ dayId }: RecapProps) => {
  const toast = useToast();

  const editRecordMutation = api.attendance.editAttendanceRecord.useMutation();

  const [page, setPage] = useState<number>(1);
  const [rowPerPage, setRowPerPage] = useState<number>(5);
  const [filterBy, setFilterBy] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [rowPerPageInput, setRowPerPageInput] = useState<number>(rowPerPage);

  const recordListQuery = api.attendance.adminGetAttendanceRecord.useQuery({
    dayId: dayId,
    currentPage: page,
    limitPerPage: rowPerPage,
    filterBy: filterBy,
    searchQuery: searchQuery
  });

  const recordList = (recordListQuery.data && recordListQuery.data.data) || [];
  const recordListMetaData = (recordListQuery.data &&
    recordListQuery.data.metadata) || {
    total: 0
  };

  const maxPage = Math.ceil(recordListMetaData.total / rowPerPage);

  const {
    isOpen: isEditingRowPerPageOpen,
    onClose: onEditingRowPerPageClose,
    onOpen: onEditingRowPerPageOpen
  } = useDisclosure();

  const [jumpInput, setJumpInput] = useState<string>('1');
  const jumpChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJumpInput(e.target.value);
  };

  const filterByChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== 'status' && filterBy === 'status')
      setSearchQuery('');
    else if (e.target.value === 'status') setSearchQuery(Status.HADIR);
    setFilterBy(e.target.value);
  };

  const searchQueryChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (filterBy === '' || filterBy === 'Filter By') return;
    setSearchQuery(e.target.value);
  };

  const statusSearchQueryChangeHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSearchQuery(e.target.value);
  };

  const nextPage = () => {
    let jump = page + 1;
    if (jump > maxPage) {
      jump = 1;
    }
    setPage(jump);
  };
  const prevPage = () => {
    let jump = page - 1;
    if (jump < 1) {
      jump = maxPage;
    }
    setPage(jump);
  };

  const jumpToPage = () => {
    const jumpInputInt = parseInt(jumpInput);
    if (jumpInputInt > maxPage) {
      setPage(maxPage);
      setJumpInput(maxPage.toString());
    } else if (jumpInputInt < 1) {
      setPage(1);
      setJumpInput('1');
    } else {
      setPage(jumpInputInt);
    }
  };

  const editRecord = async (
    record: recordListQueryOutput,
    { newStatus, newDesc }: { newStatus: Status; newDesc: string },
    successFn: () => void
  ) => {
    if (newStatus === record.status) {
      return;
    }

    try {
      const result = await editRecordMutation.mutateAsync({
        attendanceId: record.id,
        kehadiran: newStatus,
        reason: newDesc
      });

      toast({
        title: 'Success',
        description: result.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      successFn();
      await recordListQuery.refetch();
    } catch (error) {
      if (!(error instanceof TRPCClientError)) throw error;

      toast({
        title: 'Error',
        description: error.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  return (
    <Flex flexDir='column'>
      <Flex justifyContent='space-between' alignItems='center'>
        <Flex alignItems='center'>
          <Select
            borderRadius='12'
            cursor='pointer'
            color='gray.500'
            borderWidth='2px'
            borderColor='gray.500'
            w='8em'
            _active={{
              bg: 'rgba(47, 46, 46, 0.6)',
              shadow: 'none'
            }}
            onChange={(e) => setRowPerPage(parseInt(e.target.value))}
            defaultValue={5}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </Select>
          <Text ml='1em' fontWeight='bold' color='black'>
            Records per page
          </Text>
        </Flex>
        <Flex>
          <Select
            value={filterBy}
            onChange={filterByChangeHandler}
            placeholder='Filter By'
            w='14em'
          >
            <option value='nim'>NIM</option>
            <option value='name'>Name</option>
            <option value='group'>Group</option>
            <option value='status'>Status</option>
          </Select>
          {filterBy === 'status' ? (
            <Select
              value={searchQuery}
              onChange={statusSearchQueryChangeHandler}
              border='1px solid white'
              borderRadius='5px'
              ml='1em'
              w='20em'
            >
              <option value={Status.HADIR}>Hadir</option>
              <option value={Status.TIDAK_HADIR}>Tidak Hadir</option>
              <option value={Status.IZIN_DITERIMA}>Izin Diterima</option>
              <option value={Status.IZIN_DITOLAK}>Izin Ditolak</option>
              <option value={Status.IZIN_PENDING}>Izin Pending</option>
            </Select>
          ) : filterBy === 'all' || filterBy === '' ? null : (
            <InputGroup ml='1em' w='20em'>
              <Input
                placeholder='Search'
                value={searchQuery}
                onChange={searchQueryChangeHandler}
              />
            </InputGroup>
          )}
        </Flex>
      </Flex>
      {recordListQuery.isLoading ? (
        <Text w='100%' fontStyle='italic'>
          Loading...
        </Text>
      ) : recordListQuery.isError ? (
        <Text w='100%' color='salmon'>
          Error
        </Text>
      ) : recordList.length < 1 ? (
        <Text w='100%' fontStyle='italic'>
          Tidak ada data
        </Text>
      ) : (
        <Box
          borderRadius='12px'
          overflow='hidden'
          mt='1em'
          borderRight='1px solid'
          borderLeft='1px solid'
          borderColor='gray.400'
        >
          <Table w='100%' variant='black'>
            <Thead>
              <Tr>
                <Th w='5%'>No.</Th>
                <Th w='3%'>Kel.</Th>
                <Th w='12%'>Mentor</Th>
                <Th w='10%'>NIM</Th>
                <Th w='15%'>Nama</Th>
                <Th w='10%'>Tanggal</Th>
                <Th w='10%'>Jam</Th>
                <Th w='15%'>Status</Th>
                <Th w='20%'>Keterangan</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recordList.map((record, index) => (
                <RecapRow
                  key={index}
                  record={record}
                  num={rowPerPage * (page - 1) + index + 1}
                  editRecord={() => void editRecord}
                />
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <Flex
        justifyContent='space-between'
        mt='1em'
        flexDir={{ base: 'column', lg: 'row-reverse' }}
      >
        <Flex
          justifyContent={{ base: 'space-between', lg: 'right' }}
          alignItems={'center'}
        >
          <Button
            variant='mono-outline'
            w={{ base: '30%', lg: '4em' }}
            mr='1em'
            onClick={prevPage}
          >
            {'<'}
          </Button>
          <Menu>
            <MenuButton
              border='1px solid gray'
              borderRadius='12px'
              color='gray.600'
              w={{ base: '30%', lg: '4em' }}
              h='2.5em'
            >
              {`${page}`}
            </MenuButton>
            <MenuList border='1px solid gray' p='1em'>
              <Flex>
                <Input value={jumpInput} onChange={jumpChangeHandler} />
                <Button
                  variant='mono-outline'
                  w={{ base: '30%', lg: '4em' }}
                  h='2.5em'
                  ml='1em'
                  onClick={jumpToPage}
                >
                  Jump
                </Button>
              </Flex>
            </MenuList>
          </Menu>
          <Button
            variant='mono-outline'
            w={{ base: '30%', lg: '4em' }}
            ml='1em'
            onClick={nextPage}
          >
            {'>'}
          </Button>
        </Flex>
        {!recordListQuery.isLoading && (
          <Text>
            Showing rows {(page - 1) * 5 + 1} to{' '}
            {page * 5 > recordListMetaData.total
              ? recordListMetaData.total
              : page * 5}{' '}
            of {recordListMetaData.total} entries
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
