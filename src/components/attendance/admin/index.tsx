import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  PropsOf,
  Select,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  Text,
  useMultiStyleConfig,
  useTab,
  useToast
} from '@chakra-ui/react';
import { AttendanceDay } from '@prisma/client';
import React, { useState } from 'react';
import { DayManagementModal } from '~/components/attendance/admin/day-management/DayManagementModal';
import { EventList } from '~/components/attendance/admin/event-management/EventList';
import { Recap } from '~/components/attendance/admin/recap/Recap';
import Layout from '~/layout';
import { api } from '~/utils/api';

export default function AttendancePageAdmin() {
  const toast = useToast();

  const dayListQuery = api.attendance.getAttendanceDayList.useQuery();
  const dayList: AttendanceDay[] = dayListQuery.data || [];

  const addDayMutation = api.attendance.adminAddAttendanceDay.useMutation();
  const editDayMutation = api.attendance.adminEditAttendanceDay.useMutation();
  const removeDayMutation =
    api.attendance.adminDeleteAttendanceDay.useMutation();

  const [dayId, setDayId] = useState<string>();
  const dayChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDayId(e.target.value);
  };

  const addDay = async (dayName: string, dayDate: Date) => {
    if (dayName in (dayList?.map((day) => day.name) || [])) {
      toast({
        title: 'Nama Day sudah ada',
        status: 'error',
        duration: 3000
      });
      return;
    }

    const res = await addDayMutation.mutateAsync({
      name: dayName,
      time: dayDate
    });

    dayListQuery.refetch();
  };

  const editDay = async (id: string, name: string, date: Date) => {
    if (dayList && name in dayList.map((day) => day.name)) {
      toast({
        title: 'Nama Day sudah ada',
        status: 'error',
        duration: 3000
      });
      return;
    }

    const res = await editDayMutation.mutateAsync({
      name: name,
      time: date,
      dayId: id
    });

    if (res.message) {
      toast({
        title: 'Gagal mengedit Day',
        status: 'error',
        duration: 3000
      });
      return;
    }
  };

  const deleteDay = async (id: string) => {
    const res = await removeDayMutation.mutateAsync({
      dayId: id
    });

    if (res.message) {
      toast({
        title: 'Gagal menghapus Day',
        status: 'error',
        duration: 3000
      });
      return;
    }

    toast({
      title: 'Berhasil menghapus Day',
      status: 'success',
      duration: 2000
    });

    dayListQuery.refetch();
  };

  // function for custom tab
  const Tab = React.forwardRef((props: TabProps, ref) => {
    const tabProps = useTab({ ...props });
    const isSelected = !!tabProps['aria-selected'];

    const styles = useMultiStyleConfig('Tabs', tabProps);

    return (
      <Button
        __css={styles.tab}
        {...tabProps}
        bgImage={isSelected ? '/images/bg-bar.png' : 'none'}
        bgRepeat='no-repeat'
        bgColor={isSelected ? 'black' : 'none'}
        borderRadius='2xl'
        border='none'
        color={isSelected ? 'white' : 'black'}
        fontWeight='bold'
      >
        {tabProps.children}
      </Button>
    );
  });
  console.log(dayList);
  console.log(dayId);
  return (
    <Layout title='Attendance Page' type='admin' fullBg>
      <Box bg='white'>
        <Text
          color='#340C8F'
          fontSize='2xl'
          w='100%'
          textAlign='left'
          my='1em'
          fontWeight='bolder'
        >
          Rekap Absensi
        </Text>
        <Tabs
          variant='soft-rounded'
          colorScheme='green'
          align='center'
          w='100%'
          isLazy={true}
        >
          <TabList w='initial' px='0'>
            <Flex
              border='4px solid black'
              borderRadius='3xl'
              w='100%'
              flexDir={{
                base: 'column',
                md: 'row'
              }}
              alignItems='center'
            >
              <Tab
                w={{
                  base: '100%',
                  md: '50%'
                }}
              >
                Daftar Event
              </Tab>
              <Tab
                w={{
                  base: '100%',
                  md: '50%'
                }}
              >
                Recap Absensi Mentee
              </Tab>
            </Flex>
          </TabList>
          <Flex w='100%' ml='1em' mt='1em'>
            <Select
              placeholder='Select Day'
              color='white'
              borderRadius='md'
              bg='black'
              w='10em'
              onChange={dayChangeHandler}
            >
              {dayList.map((day, i) => (
                <option value={day.id} key={i} style={{ color: 'black' }}>
                  {day.name}
                </option>
              ))}
            </Select>

            <DayManagementModal
              dayList={dayList}
              editDay={editDay}
              addDay={addDay}
              deleteDay={deleteDay}
            />
          </Flex>
          {dayId ? (
            <Box minH='30em'>
              <TabPanels mt='2em'>
                <TabPanel>
                  <EventList
                    day={dayList.find((d) => d.id == dayId) || dayList[0]!}
                    dayList={dayList}
                  />
                </TabPanel>
                <TabPanel>
                  <Recap dayId={dayId} />
                </TabPanel>
              </TabPanels>
            </Box>
          ) : (
            <Box h='30em' />
          )}
        </Tabs>
      </Box>
    </Layout>
  );
}
