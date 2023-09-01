import Layout from '~/layout';
import { api } from '~/utils/api';
import {
  Flex,
  Image,
  VStack,
  Button,
  HStack,
  Text,
  Box,
  InputGroup,
  Input,
  InputLeftElement,
  Avatar
} from '@chakra-ui/react';
import { FaSearch, FaBirthdayCake } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDebounce } from '~/pages/penilaian';

export const ListPengunjung = () => {
  const unitQuery = api.unit.getUnitProfile.useQuery();
  const unitData = unitQuery.data;

  const [search, setSearch] = useState<string>('');
  const searchVal = useDebounce(search);
  const router = useRouter();

  return (
    <Layout title='Pengunjung' type='admin' fullBg={false}>
      <Flex flexDirection='column' alignItems='center' overflow='hidden'>
        <HStack spacing={2}>
          <Image
            src='/images/visitor-large.png'
            w={{ base: '100px', lg: '200px' }}
            alt=''
            draggable='false'
            display={{ base: 'none', lg: 'block' }}
          />
          <VStack spacing={1} alignItems='flex-start'>
            <Text
              color='navy.1'
              fontFamily='SomarRounded-Bold'
              fontSize={{ base: 'xl', lg: '4xl' }}
              textAlign='left'
            >
              50000
            </Text>
            <Text
              fontFamily='SomarRounded-Bold'
              fontSize={{ base: 'xl', lg: '4xl' }}
              textAlign='left'
            >
              PENGUNJUNG
            </Text>
            <Text fontSize={{ base: 'md', lg: 'lg' }} textAlign='left'>
              Pastikan pengunjung telah memasukkan kode kunjungan
            </Text>
          </VStack>
        </HStack>
        <InputGroup my='4' color='white'>
          <InputLeftElement pointerEvents='none'>
            <FaSearch />
          </InputLeftElement>
          <Input
            bg='black'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search User'
            borderRadius='full'
          />
        </InputGroup>
        {/* handle kalau kosong */}
        <Flex
          flexDir={{ base: 'column', sm: 'row' }}
          justifyContent='space-between'
          w='100%'
          px={3}
          py={4}
          bg='linear-gradient(to right, rgba(43, 7, 146, 0.33), #271A4C)'
          borderRadius='lg'
          alignItems='center'
          gap={2}
        >
          <HStack
            spacing={4}
            maxW={{ base: '100%', sm: '80%' }}
            color='white'
            alignSelf='flex-start'
          >
            <Avatar name='ASD' />
            <Box>
              <Text fontWeight='bold'>Tulip</Text>
              <Text>NIM</Text>
            </Box>
          </HStack>
          <Button
            alignSelf='flex-end'
            onClick={() => void router.push('/pengunjung/list/1')}
          >
            <HStack spacing={2} align='center' flexWrap='wrap'>
              <FaBirthdayCake />
              <Text fontSize={{ base: 'xs', sm: 'sm' }}>GRANT COINS</Text>
            </HStack>
          </Button>
        </Flex>
      </Flex>
    </Layout>
  );
};
