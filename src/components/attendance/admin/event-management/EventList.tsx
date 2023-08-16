/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { type RouterOutputs, api } from '~/utils/api';
import { AddEventModal } from './AddEventModal';
import { type AttendanceDay, type AttendanceEvent } from '@prisma/client';
import { EventListRow } from './EventListRow';
import { TRPCClientError } from '@trpc/client';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

interface EventListProps {
  day: AttendanceDay;
}

export const EventList = ({ day }: EventListProps) => {
  const toast = useToast();
  const eventListQuery = api.attendance.adminGetAttendanceEventList.useQuery({
    dayId: day.id
  });
  const csvQuery = api.csv.adminGetCSVAttendance.useQuery({
    dayId: day.id
  });

  const eventList = eventListQuery.data || [];

  const addEventMutation = api.attendance.adminAddAttendanceEvent.useMutation();
  const editEventMutation =
    api.attendance.adminEditAttendanceEvent.useMutation();
  const deleteEventMutation =
    api.attendance.adminDeleteAttendanceEvent.useMutation();

  const [rowPerPage, setRowPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const maxPage = Math.ceil(eventList.length / rowPerPage);

  const downloadCSV = async () => {
    setLoading(true);
    const curData: RouterOutputs['csv']['adminGetCSVAttendance'] | undefined = (
      await csvQuery.refetch()
    ).data;

    // GWS LINTER
    if (curData && !curData[0]) {
      toast({
        description: 'No data found',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      setLoading(false);
      return;
    }

    if (curData) {
      const toParse = curData[0];

      const csv: any = {};
      toParse?.event.forEach((item) => {
        const { title, record } = item;
        record.forEach((item) => {
          const nim = item.student.nim;
          const name = item.student.profile?.name;
          const faculty = item.student.profile?.faculty;
          const campus = item.student.profile?.campus;
          const status = item.status;
          const group = item.student.groupRelation[0]?.group.group || -1;

          if (!csv[group]) csv[group] = {};
          if (!csv[group][title]) csv[group][title] = [];

          csv[group][title].push({
            nim,
            name,
            faculty,
            campus,
            status
          });
        });
      });

      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = `Rekap Absensi ${day.name}`;
      const wb = XLSX.utils.book_new();

      Object.keys(csv).forEach((key) => {
        const header = [
          ['NIM', 'Nama', 'Fakultas', 'Kampus', ...Object.keys(csv[key])]
        ];
        const ws = XLSX.utils.aoa_to_sheet(header);
        ws['!cols'] = [
          { wch: 20 },
          { wch: 50 },
          { wch: 30 },
          { wch: 30 },
          ...Object.keys(csv[key]).map(() => ({ wch: 20 }))
        ];

        const res: any[] = [];
        Object.keys(csv[key]).forEach((key2) => {
          const temp: { [key: string]: any } = {};
          Object.keys(csv[key][key2]).forEach((key3) => {
            const { nim, name, faculty, campus, status } = csv[key][key2][key3];
            if (!temp[nim])
              temp[nim] = {
                nim,
                name,
                faculty,
                campus
              };
            temp[nim][key2] = status;
          });
          res.push(...Object.values(temp));
        });

        const csvData = _.groupBy(res, 'nim');
        Object.keys(csvData).forEach((key) => {
          const temp = csvData[key] as any[];
          const merged = _.merge(temp[0], temp[1]);
          csvData[key] = merged;
        });

        const final = Object.values(csvData).map((item) => item);

        XLSX.utils.sheet_add_json(ws, final as any[], {
          skipHeader: true,
          origin: 'A2'
        });
        XLSX.utils.book_append_sheet(wb, ws, `Kelompok ${key}`);
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(blob, fileName + fileExtension);
    }

    setLoading(false);
  };

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
      <Button
        variant='mono-outline'
        w={{ base: '30%', lg: '8em' }}
        h='2em'
        onClick={() => void downloadCSV()}
        isLoading={loading}
      >
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
          <TableContainer>
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
          </TableContainer>
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
