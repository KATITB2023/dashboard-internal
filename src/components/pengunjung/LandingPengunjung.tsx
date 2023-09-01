import Layout from '~/layout';
import { Header } from '../Header';
import { api } from '~/utils/api';
import {
  Flex,
  Image,
  VStack,
  Button,
  HStack,
  Text,
  Heading
} from '@chakra-ui/react';
import { colors } from '~/styles/component/colors';
import { FaGreaterThan } from 'react-icons/fa';
import Link from 'next/link';

export const LandingPengunjung = () => {
  const unitQuery = api.unit.getUnitProfile.useQuery();
  const unitData = unitQuery.data;
  return (
    <Layout title='Pengunjung' type='admin' fullBg={false}>
      <Header title='ITB SHOWCASE' />
      <Flex
        flexDirection={{ base: 'column', lg: 'row' }}
        gap={4}
        bg='black'
        px={{ base: 0, lg: 4 }}
        borderRadius='lg'
        mt={5}
        color='yellow.5'
        h={{ base: '100%', lg: 'calc(100vh - 100px - 9rem)' }}
      >
        <Flex
          flexDirection='column'
          justifyContent='space-around'
          borderRadius='lg'
          px={5}
          py={7}
          background='radial-gradient(circle at 95% 0%, rgb(114, 216, 186, 0.42), transparent), radial-gradient(circle, rgba(255, 252, 131, 0.29), transparent)'
          w={{ base: '100%', lg: '30%' }}
          gap={4}
        >
          <VStack spacing={4}>
            {unitData?.image && (
              <Image
                src={unitData.image}
                alt={unitData.name}
                w={{ base: '150px', lg: '250px' }}
                borderRadius='lg'
                draggable='false'
              />
            )}
            <Text
              fontFamily='SomarRounded-Bold'
              fontSize={{ base: 'lg', lg: '2xl' }}
              color='yellow.5'
              textShadow={`0px 0px 10px ${colors.navy[5]}`}
              textAlign='center'
            >
              {unitData?.name}
            </Text>
          </VStack>
          <VStack spacing={3}>
            <Text
              fontFamily='SomarRounded-Bold'
              fontSize={{ base: 'lg', lg: '2xl' }}
              color='yellow.5'
              textShadow={`0px 0px 10px ${colors.navy[5]}`}
              textAlign='center'
            >
              Total Pengunjung
            </Text>
            <Flex
              flexDirection='row'
              justifyContent='space-between'
              px={3}
              bg='navy.1'
              borderRadius='lg'
              boxShadow={`0px 0px 10px ${colors.yellow[5]}`}
              w='100%'
              alignItems='center'
            >
              <HStack spacing={2} w='80%' textOverflow='ellipsis'>
                <Image
                  src='/images/visitor-large.png'
                  w='50px'
                  alt=''
                  draggable='false'
                />
                <Text
                  color='green.5'
                  fontFamily='SomarRounded-Bold'
                  fontSize='lg'
                  textOverflow='ellipsis'
                  overflow='hidden'
                  whiteSpace='nowrap'
                >
                  9999999999999999999999999999999999999999
                </Text>
              </HStack>
              <Link href='/pengunjung/list'>
                <Button
                  borderRadius='50%'
                  alignSelf='center'
                  size='sm'
                  bg='yellow.3'
                >
                  <FaGreaterThan size={10} />
                </Button>
              </Link>
            </Flex>
          </VStack>
        </Flex>
        <Flex
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          color='white'
          w='100%'
          gap={5}
          px={4}
        >
          <VStack spacing={1} textAlign='center'>
            <Heading fontSize={{ base: 'lg', lg: '2xl' }} color='yellow.5'>
              KODE KUNJUNGAN
            </Heading>
            <Text>Kode akan berubah setiap 5 menit sekali</Text>
          </VStack>
          <VStack
            spacing={4}
            bg='gray.700'
            borderRadius='full'
            px={20}
            pt={8}
            pb={16}
            w='50%'
            position='relative'
            border={`2px solid ${colors.yellow[5]}`}
            boxShadow={`0px 0px 10px ${colors.yellow[5]}`}
          >
            <Text
              fontSize={{ base: 'lg', lg: 'xl' }}
              color='gray.400'
              textAlign='center'
            >
              Code generated at 11.59
            </Text>
            <Heading
              fontSize={{ base: '3xl', lg: '6xl' }}
              letterSpacing='wider'
              textAlign='center'
            >
              123456
            </Heading>
            <Image
              position='absolute'
              draggable='false'
              w='250px'
              bottom='-200'
              alt=''
              src='/images/space-object/bulan-glow.png'
              display={{ base: 'none', lg: 'block' }}
            />
          </VStack>
        </Flex>
      </Flex>
    </Layout>
  );
};
