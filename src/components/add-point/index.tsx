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
import { RouterOutputs, api } from '~/utils/api';
import { Status } from '@prisma/client';
import { AddPointRow } from './AddPointRow';

type leaderboardQueryOutput =
  RouterOutputs['leaderboard']['mentorGetLeaderboardData']['data'][0];

export const MentorRecap = () => {
  const toast = useToast();

  const editRecordMutation = api.attendance.editAttendanceRecord.useMutation();

  const [page, setPage] = useState<number>(1);
  const [rowPerPage, setRowPerPage] = useState<number>(5);
  const [filterBy, setFilterBy] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const leaderboardQuery = api.leaderboard.mentorGetLeaderboardData.useQuery({
    /* dayId: dayId, */
    currentPage: page,
    limitPerPage: rowPerPage,
    filterBy: filterBy,
    searchQuery: searchQuery
  });

  const leaderboardList =
    (leaderboardQuery.data && leaderboardQuery.data.data) || [];
  const leaderboardListMetaData = (leaderboardQuery.data &&
    leaderboardQuery.data.metadata) || {
    total: 0
  };

  const maxPage = Math.ceil(leaderboardListMetaData.total / rowPerPage);

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
    record: leaderboardQueryOutput,
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
      .then(() => {
        toast({
          title: 'Status berhasil diubah',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        successFn();
        leaderboardQuery.refetch();
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
          </Select>
          <InputGroup ml='1em' w='20em'>
            <Input
              placeholder='Search'
              value={searchQuery}
              onChange={searchQueryChangeHandler}
            />
          </InputGroup>
        </Flex>
      </Flex>
      {leaderboardQuery.isLoading ? (
        <Text w='100%' fontStyle='italic' textAlign='center'>
          Loading...
        </Text>
      ) : leaderboardQuery.isError ? (
        <Text w='100%' color='salmon'>
          Error
        </Text>
      ) : leaderboardList.length < 1 ? (
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
              <Td w='10%'>No.</Td>
              <Td w='20%'>NIM</Td>
              <Td w='20%'>Nama</Td>
              <Td w='50%'>Poin</Td>
            </Thead>
            <Tbody>
              {leaderboardList.map((data, index) => (
                <AddPointRow
                  data={data}
                  num={rowPerPage * (page - 1) + index + 1}
                  key={index}
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
