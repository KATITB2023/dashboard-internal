import {
  Box,
  Flex,
  Text,
  Image,
  Menu,
  MenuItem,
  MenuButton,
  MenuList
} from '@chakra-ui/react';
import React, { useState } from 'react';
import MembersTable from '~/component/group-information-management/MembersTable';
import MentorBox from '~/component/group-information-management/MentorBox';
import DUMMY_MEMBERS from '~/component/group-information-management/dummyData';
import Layout from '~/layout/index';

export default function GroupInformation() {
  // Untuk dropdown
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string | null) => {
    setSelectedOption(option);
  };

  const isDropdownHidden = selectedOption === null;

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
    <Layout type='admin' title='Group Information' fullBg={false}>
      <Box>
        {/* Logo and dropdown, flex display  */}
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
              src='/images/placeholder_logo_info.png'
              objectFit='contain'
              height='100%'
              alt='placeholder_logo_info'
            />
          </Box>

          {/* Dropdown */}
          <Box
            width='408px'
            height='96px'
            bgImage='/images/comet_container.png'
            backgroundSize='cover'
            borderRadius='25px'
          >
            <Menu>
              <Flex
                p={3}
                mr={12}
                justifyContent='space-between'
                alignItems='center'
                height='100%'
                cursor='pointer'
                color='white'
                onClick={() => handleOptionSelect(null)}
              >
                <Image
                  src='/images/placeholder_profile.png'
                  alt='placeholder_profile'
                />
                <Text fontWeight='bold' fontSize='24px'>
                  {selectedOption}
                </Text>
                <MenuButton
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Image src='/images/dropdown_icon.png' alt='dropdown_icon' />
                </MenuButton>
              </Flex>
              <MenuList bg='black' borderColor='black'>
                <MenuItem
                  minHeight='20px'
                  bg='black'
                  color='white'
                  onClick={() => handleOptionSelect(null)}
                ></MenuItem>
                <MenuItem
                  minHeight='20px'
                  bg='black'
                  color='white'
                  onClick={() => handleOptionSelect('Kelompok XX')}
                >
                  Kelompok XX
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>

        <br />

        {!isDropdownHidden && (
          <>
            {/* Mentor boxes*/}
            <Box mt={4}>
              <Text color='black' fontWeight='700' fontSize='20px'>
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
              <Text color='black' fontWeight='700' fontSize='20px'>
                Anggota:
              </Text>
              <MembersTable members={DUMMY_MEMBERS} />
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
}
