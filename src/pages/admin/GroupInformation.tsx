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
import MembersTable from '~/components/MembersTable';
import MentorBox from '~/components/MentorBox';
import Layout from '~/layout';

const GroupInformation: React.FC = () => {
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

  // Dummy buat member
  const DUMMY_MEMBERS = [
    {
      id: 1,
      nim: 'xxx23xxx',
      name: 'Lorem Ipsum Dolor Sit Amet',
      faculty: 'xxxx',
      campus: 'Ganesha',
      task: '1/3',
      attendance: '100%'
    },
    {
      id: 2,
      nim: 'xxx23xxx',
      name: 'Lorem Ipsum Dolor Sit Amet',
      faculty: 'xxxx',
      campus: 'Jatinangor',
      task: '3/3',
      attendance: '80%'
    },
    {
      id: 3,
      nim: 'xxx23xxx',
      name: 'Lorem Ipsum Dolor Sit Amet',
      faculty: 'xxxx',
      campus: 'Cirebon',
      task: '0/3',
      attendance: '10%'
    }
  ];

  return (
    <Layout title='Group Information'>
      <Flex alignItems='center' flexDirection='row'>
        {/* Navbar, pakai placeholder dulu */}
        <Image
          src='./images/placeholder_admin.png'
          objectFit='contain'
          maxH='95vh'
          alt='placeholder_admin'
        />
        <Box
          bg='white'
          p={4}
          borderRadius='3xl'
          boxShadow='md'
          minH='90vh'
          height='auto'
          width='full'
        >
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
              width='400px'
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
                    <Image
                      src='/images/dropdown_icon.png'
                      alt='dropdown_icon'
                    />
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
                <Text
                  color='black'
                  fontFamily='SomarRounded'
                  fontWeight='700'
                  fontSize='20px'
                >
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
                <Text
                  color='black'
                  fontFamily='SomarRounded'
                  fontWeight='700'
                  fontSize='20px'
                >
                  Anggota:
                </Text>
                <MembersTable members={DUMMY_MEMBERS} />
              </Box>
            </>
          )}
        </Box>
      </Flex>
    </Layout>
  );
};

export default GroupInformation;
