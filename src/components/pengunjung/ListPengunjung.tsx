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
  Avatar,
  Center,
  Spinner,
  Select,
  IconButton
} from '@chakra-ui/react';
import { FaSearch, FaBirthdayCake } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { type ChangeEvent, Fragment, useState } from 'react';
import { useDebounce } from '~/pages/penilaian';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

export const ListPengunjung = () => {
  const [search, setSearch] = useState<string>();
  const [page, setPage] = useState(1);
  const searchVal = useDebounce(search);
  const router = useRouter();
  const limit = 10;

  const visitorQuery = api.unit.getAllVisit.useQuery({
    page,
    limit,
    search: searchVal as string
  });
  const { data: visitorData, isFetching } = visitorQuery;

  return (
    <Layout title='Pengunjung' type='unit' fullBg={false}>
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
              {visitorData?.metadata?.total}
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
        {visitorData?.metadata?.total !== 0 ? (
          isFetching ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            visitorData?.data.map((visitor) => (
              <Fragment key={visitor.id}>
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
                    <Avatar name={visitor.student.profile?.name} />
                    <Box>
                      <Text fontWeight='bold'>
                        {visitor.student.profile?.name}
                      </Text>
                      <Text>{visitor.student.nim}</Text>
                    </Box>
                  </HStack>
                  <Button
                    alignSelf='flex-end'
                    onClick={() =>
                      void router.push(`/pengunjung/list/${visitor.studentId}`)
                    }
                  >
                    <HStack spacing={2} align='center' flexWrap='wrap'>
                      <FaBirthdayCake />
                      <Text fontSize={{ base: 'xs', sm: 'sm' }}>
                        GRANT COINS
                      </Text>
                    </HStack>
                  </Button>
                </Flex>
                <Flex
                  alignItems='flex-end'
                  justifyContent='flex-end'
                  w='100%'
                  gap='.5rem'
                  py={3}
                >
                  <IconButton
                    variant='unstyled'
                    display='flex'
                    justifyContent='center'
                    border='1px'
                    _hover={{
                      backgroundColor: 'rgba(0, 0, 0, 0.1)'
                    }}
                    aria-label='back'
                    icon={<FiArrowLeft />}
                    onClick={() => {
                      setPage((prev) => prev - 1);
                    }}
                    visibility={page === 1 ? 'hidden' : 'visible'}
                  />
                  <label>
                    Halaman
                    <Select
                      border='2px'
                      borderColor='gray.300'
                      cursor='pointer'
                      value={page}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setPage(parseInt(e.target.value))
                      }
                    >
                      {visitorData.metadata.total > 0 && limit > 0 ? (
                        Array(Math.ceil(visitorData.metadata.total / limit))
                          .fill(1)
                          .map((_, index: number) => (
                            <option key={index} value={index + 1}>
                              {index + 1}
                            </option>
                          ))
                      ) : (
                        <option value={0}>-</option>
                      )}
                    </Select>
                  </label>
                  <IconButton
                    variant='unstyled'
                    display='flex'
                    justifyContent='center'
                    border='1px'
                    _hover={{
                      backgroundColor: 'rgba(0, 0, 0, 0.1)'
                    }}
                    aria-label='back'
                    icon={<FiArrowRight />}
                    onClick={() => {
                      setPage((prev) => prev + 1);
                    }}
                    visibility={
                      page === Math.ceil(visitorData.metadata.total / limit) ||
                      visitorData.metadata.total === 0
                        ? 'hidden'
                        : 'visible'
                    }
                  />
                </Flex>
              </Fragment>
            ))
          )
        ) : (
          <Center>
            <Text color='black'>Belum ada pengunjung :(</Text>
          </Center>
        )}
      </Flex>
    </Layout>
  );
};
