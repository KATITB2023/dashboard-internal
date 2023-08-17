import { Box, Flex, Image, Select, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Layout from '~/layout';
import { api } from '~/utils/api';
import { MentorRecap } from './mentor-recap/MentorRecap';
import { Header } from '~/components/Header';

export default function AttendancePageMentor() {
  const eventListQuery = api.attendance.mentorGetEventList.useQuery();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const eventList = eventListQuery.data || [];
  const [eventId, setEventId] = useState<string | undefined>('');

  const groupQuery = api.group.mentorGetAttendanceData.useQuery({
    eventId: eventId || ''
  });
  const eventChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventId(e.target.value);
  };

  const refetch = async () => {
    await groupQuery.refetch();
  };

  useEffect(() => {
    if (eventList) setEventId(eventList[0]?.event[0]?.id);
  }, [eventList]);

  return (
    <Layout title='Attendance Page' type='mentor' fullBg>
      <Flex
        justifyContent={{
          base: 'center',
          lg: 'space-between'
        }}
        flexDir={{
          base: 'column',
          lg: 'row'
        }}
        w='100%'
      >
        <Header title={'Rekap Absensi'} />
        <Flex
          bg='black'
          p='1em'
          borderRadius='10px'
          pos='relative'
          w='min(20em,90%)'
          alignItems='center'
          overflow='hidden'
          h='4.5em'
        >
          <Text color='white' fontSize='2xl' fontWeight='bold' zIndex='2'>
            {`Kelompok ${1}`}
          </Text>
          <Image
            src='/images/komet-absen.png'
            position='absolute'
            right='-5%'
            w='25%'
            top='-1em'
            alt=''
          />
        </Flex>
      </Flex>

      <Flex w='100%' mt='2em'>
        <Select
          color='white'
          borderRadius='md'
          bg='black'
          w='10em'
          onChange={eventChangeHandler}
        >
          {eventList.map((event, i) => (
            <option value={event.id} key={i} style={{ color: 'black' }}>
              {event.name}
            </option>
          ))}
        </Select>
      </Flex>
      {eventId ? (
        <Box minH='30em'>
          <MentorRecap
            group={groupQuery.data}
            fetching={groupQuery.isLoading}
            emit={async () => await refetch()}
            eventId={eventId}
          />
        </Box>
      ) : (
        <Box h='30em' />
      )}
    </Layout>
  );
}
