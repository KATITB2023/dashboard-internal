import {
  Box,
  Button,
  Flex,
  Select,
  TabList,
  TabPanel,
  TabPanels,
  type TabProps,
  Tabs,
  useMultiStyleConfig,
  useTab,
  useToast
} from '@chakra-ui/react';
import { type AttendanceDay } from '@prisma/client';
import { TRPCClientError } from '@trpc/client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Header } from '~/components/Header';
import { DayManagementModal } from '~/components/attendance/admin/day-management/DayManagementModal';
import { EventList } from '~/components/attendance/admin/event-management/EventList';
import { Recap } from '~/components/attendance/admin/recap/Recap';
import Layout from '~/layout';
import AdminRoute from '~/layout/AdminRoute';
import { api } from '~/utils/api';

export default function AttendancePageAdmin() {
  const { data: session } = useSession();
  const toast = useToast();

  const dayListQuery = api.attendance.getAttendanceDayList.useQuery();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dayList: AttendanceDay[] = dayListQuery.data || [];

  const addDayMutation = api.attendance.adminAddAttendanceDay.useMutation();
  const editDayMutation = api.attendance.adminEditAttendanceDay.useMutation();
  const removeDayMutation =
    api.attendance.adminDeleteAttendanceDay.useMutation();

  const [dayId, setDayId] = useState<string>();
  const dayChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDayId(e.target.value);
  };

  useEffect(() => {
    if (dayList.length > 0 && !dayId) {
      setDayId(dayList[0]?.id);
    }
  }, [dayId, dayList]);

  const addDay = (dayName: string, dayDate: Date, thenFn: () => void) => {
    if (dayName in (dayList?.map((day) => day.name) || [])) {
      toast({
        title: 'Nama Day sudah ada',
        status: 'error',
        duration: 3000
      });
      return;
    }

    addDayMutation
      .mutateAsync({
        name: dayName,
        time: dayDate
      })
      .then(async (res) => {
        toast({
          title: res.message,
          status: 'success',
          duration: 3000
        });
        await dayListQuery.refetch();
        thenFn();
      })
      .catch((err) => {
        if (!(err instanceof TRPCClientError)) throw err;
        toast({
          title: err.message,
          status: 'error',
          duration: 3000
        });
      });
  };

  const editDay = (id: string, name: string, date: Date) => {
    if (dayList && name in dayList.map((day) => day.name)) {
      toast({
        title: 'Nama Day sudah ada',
        status: 'error',
        duration: 3000
      });
      return;
    }

    editDayMutation
      .mutateAsync({
        name: name,
        time: date,
        dayId: id
      })
      .then(async (res) => {
        toast({
          title: res.message,
          status: 'success',
          duration: 3000
        });
        await dayListQuery.refetch();
      })
      .catch((err) => {
        if (!(err instanceof TRPCClientError)) throw err;
        toast({
          title: err.message,
          status: 'error',
          duration: 3000
        });
      });
  };

  const deleteDay = (id: string) => {
    removeDayMutation
      .mutateAsync({
        dayId: id
      })
      .then(async (res) => {
        toast({
          title: res.message,
          status: 'success',
          duration: 3000
        });
        await dayListQuery.refetch();
      })
      .catch((err) => {
        if (!(err instanceof TRPCClientError)) throw err;
        toast({
          title: err.message,
          status: 'error',
          duration: 3000
        });
      });
  };

  // function for custom tab
  // eslint-disable-next-line react/display-name
  const Tab = React.forwardRef((props: TabProps, _) => {
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
  return (
    <AdminRoute session={session}>
      <Layout title='Attendance Page' type='admin' fullBg={false}>
        <Box>
          <Header title={'Rekap Absensi'} />
          <Tabs
            variant='soft-rounded'
            colorScheme='green'
            align='center'
            w='100%'
            isLazy={true}
          >
            <TabList w='initial' px='0' mt='1em'>
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
            <Flex w='100%' ml='1em' mt='2em'>
              <Select
                color='white'
                borderRadius='md'
                bg='black'
                w='10em'
                onChange={dayChangeHandler}
                defaultValue={dayId}
              >
                {dayList.length > 0 ? (
                  dayList.map((day, i) => (
                    <option value={day.id} key={i} style={{ color: 'black' }}>
                      {day.name}
                    </option>
                  ))
                ) : (
                  <option disabled style={{ color: 'black' }}>
                    No Day Available
                  </option>
                )}
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
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      day={dayList.find((d) => d.id == dayId) || dayList[0]!}
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
    </AdminRoute>
  );
}
