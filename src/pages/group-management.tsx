import { Box, Flex, Text, Image } from '@chakra-ui/react';
import React from 'react';
import { Header } from '~/components/Header';
import MembersTable from '~/components/group-information-management/MembersTable';
import MentorBox from '~/components/group-information-management/MentorBox';
import DUMMY_MEMBERS from '~/components/group-information-management/dummyData';
import Layout from '~/layout/index';

export default function GroupManagement() {
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
    <Layout type='mentor' title='Group Management' fullBg={false}>
      <Box>
        {/* Logo and kelompok, flex display  */}
        <Flex
          justifyContent='space-between'
          alignItems='center'
          flexDirection={{ base: 'column', md: 'row' }}
        >
          {/* Logo */}
          <Header title='Group Management' />

          {/* Kelompok */}
          <Box
            width='auto'
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
}
