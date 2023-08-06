import { Box, Flex, Image, Select, Text, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import Layout from '~/layout';
import { api } from '~/utils/api';
import { MentorRecap } from './mentor-recap/MentorRecap';

export default function AttendancePageMentor() {
  const toast = useToast();

  const dayListQuery = api.attendance.adminGetAttendanceDayList.useQuery(); // ganti querynya jadi buat mentor
  const dayList = dayListQuery.data || [];

  const groupDataQuery = api.group.mentorGetGroupData.useQuery(); // belum ada query group data yang ada nomor kelompoknya
  const groupNumber = 1;

  const [dayId, setDayId] = useState<string>();
  const dayChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDayId(e.target.value);
  };

  return (
    <Layout title='Attendance Page' type='mentor' fullBg>
      <Box bg='white'>
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
          <Text
            color='#340C8F'
            fontSize='2xl'
            w='20em'
            textAlign='left'
            my='1em'
            fontWeight='bolder'
          >
            Rekap Absensi
          </Text>
          <Flex
            bg='black'
            p='1em'
            borderRadius='10px'
            pos='relative'
            w='min(20em,90%)'
            alignItems='center'
            overflow='hidden'
          >
            <Text color='white' fontSize='3xl' fontWeight='bold' zIndex='2'>
              {`Kelompok ${groupNumber}`}
            </Text>
            <Image
              src='/images/komet-absen.png'
              position='absolute'
              right='-5%'
              w='25%'
              top='-1em'
            />
          </Flex>
        </Flex>

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
        </Flex>
        {dayId ? (
          <Box minH='30em'>
            <MentorRecap dayId={dayId} />
          </Box>
        ) : (
          <Box h='30em' />
        )}
      </Box>
    </Layout>
  );
}
