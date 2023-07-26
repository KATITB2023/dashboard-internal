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
import { EventList } from '~/components/attendance/admin/event-list';
import { Recap } from '~/components/attendance/admin/recap';
import Layout from '~/layout';

const DUMMY_DAYS: {
  id: string;
  name: string;
}[] = [
  {
    id: '1',
    name: 'Day 1'
  },
  {
    id: '2',
    name: 'Day 2'
  },
  {
    id: '3',
    name: 'Day 3'
  },
  {
    id: '4',
    name: 'Day 4'
  },
  {
    id: '5',
    name: 'Day 5'
  }
];

export default function AttendancePageAdmin() {
  const dayId = useState<string>();

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
            >
              {DUMMY_DAYS.map((day) => (
                <option value={day.id} color='black'>
                  {day.id}
                </option>
              ))}
            </Select>
            <Button variant='mono-gray' ml='1em'>
              Add Day
            </Button>
          </Flex>
          <TabPanels mt='2em'>
            <TabPanel>
              <EventList />
            </TabPanel>
            <TabPanel>
              <Recap />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Layout>
  );
}
