import {
  Box,
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Select,
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
import { type AttendanceDay, type AttendanceEvent } from '@prisma/client';
import { MdEdit } from 'react-icons/md';
import { EventListRow } from './EventListRow';
import { TRPCClientError } from '@trpc/client';

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

  const addEvent = (
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
      .then(async (result) => {
        toast({
          title: 'Success',
          description: result.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        await eventListQuery.refetch();
      })
      .catch((error) => {
        if (!(error instanceof TRPCClientError)) throw error;
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
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
      .then(async (result) => {
        toast({
          title: 'Success',
          description: result.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        await eventListQuery.refetch();
      })
      .catch(async (error) => {
        if (!(error instanceof TRPCClientError)) throw error;
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        await eventListQuery.refetch();
      });
  };

  const deleteEvent = (eventId: string) => {
    deleteEventMutation
      .mutateAsync({
        eventId: eventId
      })
      .then((result) => {
        toast({
          title: 'Success',
          description: result.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      })
      .catch((error) => {
        if (!(error instanceof TRPCClientError)) throw error;
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      });
  };
  return (
    <Flex flexDir='column'>
      <Button variant='mono-outline' w={{ base: '30%', lg: '8em' }} h='2em'>
        Cetak CSV
      </Button>
      <Flex alignItems='center' mt='1em'>
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
              <Tr>
                <Th w='10%'>No.</Th>
                <Th w='30%'>Keterangan</Th>
                <Th w='20%'>Tanggal</Th>
                <Th w='15%'>Waktu Mulai</Th>
                <Th w='15%'>Waktu Selesai</Th>
                <Th w='10%'>Edit</Th>
              </Tr>
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
        alignItems={'center'}
        mt='1em'
        flexDir={{ base: 'column', lg: 'row-reverse' }}
      >
        <Flex justifyContent={{ base: 'space-between', lg: 'none' }}>
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
