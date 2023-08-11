import { Box, Flex, Image, Select, Text, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import Layout from '~/layout';
import { api } from '~/utils/api';
import { MentorRecap } from './mentor-recap/MentorRecap';
import { Header } from '~/components/Header';

export default function AttendancePageMentor() {
  const toast = useToast();

  const dayListQuery = api.attendance.mentorGetEventList.useQuery(); // ganti querynya jadi buat mentor
  const dayList = dayListQuery.data || [];

  const groupDataQuery = api.group.mentorGetGroupData.useQuery(); // belum ada query group data yang ada nomor kelompoknya
  const groupNumber = 1;

  const [dayId, setDayId] = useState<string>();
  const dayChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDayId(e.target.value);
  };

  return (
    <Layout title='Attendance Page' type='mentor'>
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
          />
        </Flex>
      </Flex>

      <Flex w='100%' mt='2em'>
        <Select
          placeholder='Select Day'
          color='white'
          borderRadius='md'
          bg='black'
          w='10em'
          onChange={dayChangeHandler}
          defaultValue={dayList.length > 0 ? dayList[0]?.id : undefined} // P benerin
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
  );
}
