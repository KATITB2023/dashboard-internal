import {
  Box,
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { RouterInputs, RouterOutputs, api } from '~/utils/api';
import { AddEventModal } from './AddEventModal';
import { AttendanceDay, AttendanceEvent } from '@prisma/client';
import { MdEdit } from 'react-icons/md';
import { EventListRow } from './EventListRow';

interface EventListProps {
  day: AttendanceDay;
  dayList: AttendanceDay[];
}

export const EventList = ({ day, dayList }: EventListProps) => {
  const toast = useToast();
  const eventListQuery = api.attendance.adminGetAttendanceEventList.useQuery({
    dayId: day.id
  });

  const eventList = eventListQuery.data || [];

  const addEventMutation = api.attendance.adminAddAttendanceEvent.useMutation();
  const editEventMutation =
    api.attendance.adminEditAttendanceEvent.useMutation();
  const deleteEventMutation =
    api.attendance.adminDeleteAttendanceEvent.useMutation();

  const [rowPerPage, setRowPerPage] = useState(5);
  const {
    isOpen: isEditingRowPerPageOpen,
    onClose: onEditingRowPerPageClose,
    onOpen: onEditingRowPerPageOpen
  } = useDisclosure();

  const [rowPerPageInput, setRowPerPageInput] = useState<number>(rowPerPage);

  const maxPage = Math.ceil(eventList.length / rowPerPage);

  const addEvent = async (
    name: string,
    startTime: [number, number],
    endTime: [number, number]
  ) => {
    const startDate = new Date(day.time);
    startDate.setHours(startTime[0]);
    startDate.setMinutes(startTime[1]);

    const endDate = new Date(day.time);
    endDate.setHours(endTime[0]);
    endDate.setMinutes(endTime[1]);

    addEventMutation
      .mutateAsync({
        dayId: day.id,
        title: name,
        startTime: startDate,
        endTime: endDate
      })
      .then(() => {
        toast({
          title: 'Berhasil menambah event',
          status: 'success',
          duration: 3000
        });
        eventListQuery.refetch();
      })
      .catch(() => {
        toast({
          title: 'Gagal menambah event',
          status: 'error',
          duration: 3000
        });
      });
  };

  const [page, setPage] = useState<number>(1);
  const [jumpInput, setJumpInput] = useState<string>('1');
  const jumpChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJumpInput(e.target.value);
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

  const editEvent = (newEvent: AttendanceEvent) => {
    editEventMutation
      .mutateAsync({
        eventId: newEvent.id,
        title: newEvent.title,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime
      })
      .then(() => {
        toast({
          title: 'Berhasil mengubah event',
          status: 'success',
          duration: 3000
        });
        eventListQuery.refetch();
      })
      .catch(() => {
        toast({
          title: 'Gagal mengubah event',
          status: 'error',
          duration: 3000
        });
        eventListQuery.refetch();
      });
  };

  const deleteEvent = (eventId: string) => {
    deleteEventMutation
      .mutateAsync({
        eventId: eventId
      })
      .then(() =>
        toast({
          title: 'Berhasil menghapus event',
          status: 'success',
          duration: 3000
        })
      )
      .catch(() =>
        toast({
          title: 'Gagal menghapus event',
          status: 'error',
          duration: 3000
        })
      );
  };
  return (
    <Flex flexDir='column'>
      <Button variant='mono-outline' w={{ base: '30%', lg: '8em' }} h='2em'>
        Cetak CSV
      </Button>
      <Flex alignItems='center' mt='1em'>
        <Menu>
          <MenuButton
            border='1px solid gray'
            borderRadius='12px'
            color='gray.600'
            w={{ base: '30%', lg: '6em' }}
            h='2em'
          >
            {rowPerPage}
          </MenuButton>
          <MenuList px='1em' border='1px solid gray'>
            <Flex alignItems='center'>
              <Input
                value={rowPerPageInput}
                onChange={(e) =>
                  parseInt(e.target.value) &&
                  setRowPerPageInput(parseInt(e.target.value))
                }
              />
              <Button
                variant='mono-outline'
                w={{ base: '30%', lg: '4em' }}
                ml='1em'
                onClick={() => setRowPerPage(rowPerPageInput)}
              >
                Set
              </Button>
            </Flex>
          </MenuList>
        </Menu>
        <Text ml='1em' fontWeight='bold' color='black'>
          Records per page
        </Text>
      </Flex>

      {eventList.length < 1 ? (
        <Text fontStyle='italic' fontSize='xl' color='gray.400'>
          {' '}
          No Events
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
              <Td w='10%'>No.</Td>
              <Td w='30%'>Keterangan</Td>
              <Td w='20%'>Tanggal</Td>
              <Td w='15%'>Waktu Mulai</Td>
              <Td w='15%'>Waktu Selesai</Td>
              <Td w='10%'>Edit</Td>
            </Thead>
            <Tbody borderRadius='0 0 12px 12px'>
              {eventList
                .slice(rowPerPage * (page - 1), rowPerPage * page)
                .map((event, idx) => (
                  <EventListRow
                    event={event}
                    key={idx}
                    num={rowPerPage * (page - 1) + idx + 1}
                    editEvent={editEvent}
                    deleteEvent={deleteEvent}
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
        <Flex justifyContent={{ base: 'space-between', lg: 'none' }}>
          <Button
            variant='mono-outline'
            w={{ base: '30%', lg: '4em' }}
            h='2em'
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
              h='2em'
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
            w={{ base: '30%', lg: '4em' }}
            h='2em'
            ml='1em'
            onClick={nextPage}
          >
            {'>'}
          </Button>
        </Flex>
        <AddEventModal day={day} addEvent={addEvent} />
      </Flex>
    </Flex>
  );
};
