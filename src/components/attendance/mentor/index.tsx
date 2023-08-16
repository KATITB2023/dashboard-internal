import { Box, Flex, Image, Select, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Layout from '~/layout';
import { api } from '~/utils/api';
import { MentorRecap } from './mentor-recap/MentorRecap';
import { Header } from '~/components/Header';
import MentorRoute from '~/layout/MentorRoute';
import { useSession } from 'next-auth/react';

export default function AttendancePageMentor() {
  const { data: session } = useSession();

  const dayListQuery = api.attendance.mentorGetEventList.useQuery(); // ganti querynya jadi buat mentor
  const dayList = dayListQuery.data || [];

  const groupNumber = 1;

  const [dayId, setDayId] = useState<string>();
  const dayChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDayId(e.target.value);
  };

  useEffect(() => {
    if (dayList.length > 0 && !dayId) {
      setDayId(dayList[0]?.id);
    }
  }, [dayId, dayList]);

  return (
    <MentorRoute session={session}>
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
              {`Kelompok ${groupNumber}`}
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
            onChange={dayChangeHandler}
            defaultValue={dayId} // P benerin
          >
            {dayList.map((day, i) => (
              <option value={day.id} key={i} style={{ color: 'black' }}>
                {day.name}
              </option>
            ))}
          </Select>
        </Flex>
        {dayId ? (
          <Box minH='30em'>
            <MentorRecap dayId={dayId} />
          </Box>
        ) : (
          <Box h='30em' />
        )}
      </Layout>
    </MentorRoute>
  );
}
