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
  useTab
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { AddDayModal } from '~/components/attendance/admin/add-day-modal';
import { EventList } from '~/components/attendance/admin/event-list';
import { Recap } from '~/components/attendance/admin/recap';
import Layout from '~/layout';
import { api } from '~/utils/api';

export default function AttendancePageAdmin() {
  const dayListQuery = api.attendance.adminGetAttendanceDayList.useQuery();
  const dayList = dayListQuery.data;

  const addDayMutation = api.attendance.adminAddAttendanceDay.useMutation();
  const removeDayMutation =
    api.attendance.adminDeleteAttendanceDay.useMutation();

  const [dayId, setDayId] = useState<string>();
  const dayChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDayId(e.target.value);
  };

  const [isAddingDay, setIsAddingDay] = useState<boolean>(false);
  const addDayClickHandler = () => {
    setIsAddingDay(!isAddingDay);
  };

  if (!dayList) {
    return <div>Loading...</div>;
  }

  // function for custom tab
  const Tab = React.forwardRef((props: TabProps) => {
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
    <Layout title='Attendance Page'>
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
            <Box border='4px solid black' borderRadius='3xl' w='100%'>
              <Tab w='50%'>Daftar Event</Tab>
              <Tab w='50%'>Recap Absensi Mentee</Tab>
            </Box>
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
              {dayList.map((day) => (
                <option value={day.name}>
                  <Text bg='black'>{day.name}</Text>
                </option>
              ))}
            </Select>
            <Button variant='mono-gray' ml='1em' onClick={addDayClickHandler}>
              Add Day
            </Button>
            <AddDayModal isOpen={isAddingDay} onClose={addDayClickHandler} />
          </Flex>
          {dayId ? (
            <Box minH='30em'>
              <TabPanels mt='2em'>
                <TabPanel>
                  <EventList dayId={dayId} />
                </TabPanel>
                <TabPanel>
                  <Recap />
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
