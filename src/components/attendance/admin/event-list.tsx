import {
  Box,
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { useState } from 'react';
import { RouterInputs, RouterOutputs, api } from '~/utils/api';

const DUMMY_EVENTS: {
  id: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
}[] = [
  {
    id: '1',
    description: 'Event 1',
    date: '2021-08-01',
    startTime: '08:00',
    endTime: '10:00'
  },
  {
    id: '2',
    description: 'Event 2',
    date: '2021-08-02',
    startTime: '08:00',
    endTime: '10:00'
  }
];

interface EventListProps {
  dayId: string;
}

export const EventList = ({ dayId }: EventListProps) => {
  const eventListQuery = api.attendance.adminGetAttendanceBaseOnDayId.useQuery({
    dayId: dayId
  });

  const eventList = eventListQuery.data;

  const [JumpInput, setJumpInput] = useState<string>('1');
  const jumpChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJumpInput(e.target.value);
  };

  const nextPage = () => {};
  const prevPage = () => {};
  const jumpToPage = () => {};

  return (
    <Flex flexDir='column'>
      <Button variant='mono-outline' w='8em'>
        Cetak CSV
      </Button>
      <Flex alignItems='center' mt='1em'>
        <Button variant='mono-outline' w='8em' disabled>
          20
        </Button>{' '}
        <Text ml='1em' fontWeight='bold' color='black'>
          Records per page
        </Text>
      </Flex>

      {DUMMY_EVENTS.length < 1 ? (
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
              <Td w='20%'>Waktu Mulai</Td>
              <Td w='20%'>Waktu Selesai</Td>
            </Thead>
            <Tbody borderRadius='0 0 12px 12px'>
              {DUMMY_EVENTS.map((event, idx) => (
                <Tr key={event.id}>
                  <Td>{idx + 1}</Td>
                  <Td>{event.description}</Td>
                  <Td>{event.date}</Td>
                  <Td>{event.startTime}</Td>
                  <Td>{event.endTime}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <Flex justifyContent='space-between' mt='1em'>
        <Button variant='mono-outline' w='8em'>
          Tambah Event
        </Button>
        <Flex>
          <Button variant='mono-outline' w='8em' mr='1em' onClick={prevPage}>
            {'<'}
          </Button>
          <Menu>
            <MenuButton
              border='1px solid gray'
              borderRadius='12px'
              color='gray.600'
              minW='7em'
            >
              {`${JumpInput}  >`}
            </MenuButton>
            <MenuList border='1px solid gray' p='1em'>
              <Flex>
                <Input value={JumpInput} onChange={jumpChangeHandler} />
                <Button variant='mono-outline' w='8em' ml='1em'>
                  Jump
                </Button>
              </Flex>
            </MenuList>
          </Menu>
          <Button variant='mono-outline' w='8em' ml='1em' onClick={nextPage}>
            {'>'}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
