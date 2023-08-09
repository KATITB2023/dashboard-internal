import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { RouterInputs, RouterOutputs, api } from '~/utils/api';
import { MentorRecapRow } from './MentorRecapRow';
import { Status } from '@prisma/client';

type mentorGetAttendanceRecordOutput =
  RouterOutputs['attendance']['mentorGetAttendance']['data'][0];

interface MentorRecapProps {
  dayId: string;
}

export const MentorRecap = ({ dayId }: MentorRecapProps) => {
  const toast = useToast();

  const editRecordMutation = api.attendance.editAttendanceRecord.useMutation();

  const [page, setPage] = useState<number>(1);
  const [rowPerPage, setRowPerPage] = useState<number>(5);
  const [filterBy, setFilterBy] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const recordListQuery = api.attendance.mentorGetAttendance.useQuery({
    /* dayId: dayId, */
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

  const maxPage = Math.ceil(recordListMetaData.total || 1000 / rowPerPage);

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
    setFilterBy(e.target.value);
  };

  const searchQueryChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const editRecord = (
    record: mentorGetAttendanceRecordOutput,
    { newStatus, newDesc }: { newStatus: Status; newDesc: string },
    successFn: () => void
  ) => {
    if (newStatus === record.status) {
      return;
    }
    editRecordMutation
      .mutateAsync({
        attendanceId: record.id,
        kehadiran: newStatus,
        reason: newDesc
      })
      .then((res) => {
        toast({
          title: res.message,
          status: 'success',
          duration: 3000
        });
        recordListQuery.refetch();
      })
      .catch((err) => {
        toast({
          title: err.message,
          status: 'error',
          duration: 3000
        });
      });
  };

  return (
    <Flex flexDir='column'>
      <Flex justifyContent='space-between'>
        <Flex alignItems='center' mt='1em'>
          <>
            <Button
              variant='mono-outline'
              w='8em'
              onClick={onEditingRowPerPageOpen}
            >
              {rowPerPage}
            </Button>
            <Modal
              isOpen={isEditingRowPerPageOpen}
              onClose={() => {
                onEditingRowPerPageClose();
              }}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Change Row Per Page</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Input
                    value={rowPerPage}
                    onChange={(e) =>
                      setRowPerPage(parseInt(e.target.value) | 0)
                    }
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
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
              placeholder='Select Status'
              border='1px solid white'
              borderRadius='5px'
              ml='1em'
              w='20em'
            >
              <option value={Status.HADIR}>'Hadir</option>
              <option value={Status.TIDAK_HADIR}>Tidak Hadir</option>
              <option value={Status.IZIN_DITERIMA}>Izin Diterima</option>
              <option value={Status.IZIN_DITOLAK}>Izin Ditolak</option>
              <option value={Status.IZIN_PENDING}>Izin Pending</option>
            </Select>
          ) : (
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
        <Text w='100%' fontStyle='italic' textAlign='center'>
          Loading...
        </Text>
      ) : recordListQuery.isError ? (
        <Text w='100%' color='salmon'>
          Error
        </Text>
      ) : recordList.length < 1 ? (
        <Text w='100%'>Tidak ada data</Text>
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
              <Td w='5%'>No.</Td>
              <Td w='10%'>NIM</Td>
              <Td w='15%'>Nama</Td>
              <Td w='10%'>Tanggal</Td>
              <Td w='10%'>Jam</Td>
              <Td w='15%'>Status</Td>
              <Td w='20%'>Keterangan</Td>
            </Thead>
            <Tbody>
              {recordList.map((record, index) => (
                <MentorRecapRow
                  key={index}
                  record={record}
                  num={rowPerPage * (page - 1) + index + 1}
                  editRecord={editRecord}
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
        <Flex justifyContent={{ base: 'space-between', lg: 'right' }}>
          <Button
            variant='mono-outline'
            w={{ base: '30%', lg: '6em' }}
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
              w={{ base: '30%', lg: '6em' }}
              h='2.5em'
            >
              {`${page}`}
            </MenuButton>
            <MenuList border='1px solid gray' p='1em'>
              <Flex>
                <Input value={jumpInput} onChange={jumpChangeHandler} />
                <Button
                  variant='mono-outline'
                  w='8em'
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
            w={{ base: '30%', lg: '6em' }}
            ml='1em'
            onClick={nextPage}
          >
            {'>'}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
