import { Box, Flex, Text, Image } from '@chakra-ui/react';
import React from 'react';
import MembersTable from '~/components/MembersTable';
import MentorBox from '~/components/MentorBox';
import Layout from '~/layout';
import DUMMY_MEMBERS from '~/dummy_data/dummyData';

const GroupManagement: React.FC = () => {
  // Dummy buat mentor
  const DUMMY_MENTORS = [
    {
      picture: '/images/placeholder_profile.png',
      name: 'Nama lorem ipsum dolor sit ame',
      nim: 'xxNIMxxx',
      faculty: 'Fakultas'
    },
    {
      picture: '/images/placeholder_profile.png',
      name: 'Nama lorem ipsum dolor sit ame',
      nim: 'xxNIMxxx',
      faculty: 'Fakultas'
    }
  ];

  return (
    <Layout title='Group Management'>
      <Box
        bg='white'
        p={4}
        borderRadius='3xl'
        boxShadow='md'
        minH='90vh'
        height='auto'
        width='full'
      >
        {/* Logo and kelompok, flex display  */}
        <Flex
          justifyContent='space-between'
          alignItems={{ base: 'center', md: 'flex-start' }}
          flexDirection={{ base: 'column', md: 'row' }}
        >
          {/* Logo, pakai placeholder dulu */}
          <Box
            mb={{ base: 4, md: 0 }}
            mr={{ base: 0, md: 4 }}
            w={{ base: '100%', md: 'auto' }}
          >
            <Image
              src='/images/placeholder_logo_manage.png'
              objectFit='contain'
              height='100%'
              alt='placeholder_logo_manage'
            />
          </Box>

          {/* Kelompok */}
          <Box
            width={{ base: '370px', md: '400px' }}
            height='96px'
            bgImage='/images/comet_container.png'
            backgroundSize='cover'
            borderRadius='25px'
          >
            <Flex
              p={3}
              mr={12}
              justifyContent='left'
              alignItems='center'
              height='100%'
            >
              <Image
                src='/images/placeholder_profile.png'
                alt='placeholder_profile'
                mr={10}
              />
              <Text fontWeight='bold' fontSize='24px' color='white'>
                Kelompok XX
              </Text>
            </Flex>
          </Box>
        </Flex>

        <br />

        {/* Mentor boxes*/}
        <Box mt={4}>
          <Text color='#2D3648DE' fontWeight='700' fontSize='20px'>
            Mentor:
          </Text>
          <Flex justifyContent='space-between' flexWrap='wrap'>
            {DUMMY_MENTORS.map((mentor, index) => (
              <MentorBox key={index} mentor={mentor} />
            ))}
          </Flex>
        </Box>

        {/* Members table */}
        <Box mt={4}>
          <Text color='#2D3648DE' fontWeight='700' fontSize='20px'>
            Anggota:
          </Text>
          <MembersTable members={DUMMY_MEMBERS} />
        </Box>
      </Box>
    </Layout>
  );
};

export default GroupManagement;
