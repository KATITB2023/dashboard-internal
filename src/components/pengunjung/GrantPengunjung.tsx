import router from 'next/router';
import Layout from '~/layout';
import { Header } from '../Header';
import {
  Avatar,
  Flex,
  HStack,
  Text,
  Box,
  VStack,
  RadioGroup,
  Radio,
  Image,
  Button
} from '@chakra-ui/react';
import { useState } from 'react';
import { REWARD_CONFIG } from '~/utils/reward';

export const GrantPengunjung = () => {
  const userId = router.query.id;
  const [select, setSelect] = useState<REWARD_CONFIG>(REWARD_CONFIG.EASY);
  return (
    <Layout type='admin' title='Grant Coin' fullBg={false}>
      <Header title='Grant Coins' />
      <Flex flexDirection='column' gap={3} mt={10}>
        <Text fontSize='lg'>Mengirim koin ke</Text>
        <HStack
          spacing={4}
          color='white'
          w='100%'
          px={3}
          py={4}
          bg='linear-gradient(to right, rgba(43, 7, 146, 0.33), #271A4C)'
          borderRadius='lg'
          alignItems='center'
        >
          <Avatar name='ASD' />
          <Box>
            <Text fontWeight='bold'>Tulip</Text>
            <Text>NIM</Text>
          </Box>
        </HStack>
        <VStack
          spacing={1}
          px={4}
          py={3}
          bg='black'
          color='white'
          alignItems='flex-start'
          borderRadius='lg'
        >
          <Text fontSize='lg'>Pilih kesulitan challenge</Text>
          <RadioGroup
            defaultValue={REWARD_CONFIG.EASY.toString()}
            onChange={(e) => setSelect(parseInt(e))}
          >
            <VStack spacing={1} alignItems='flex-start'>
              <Radio value={REWARD_CONFIG.EASY.toString()}>Easy</Radio>
              <Radio value={REWARD_CONFIG.MEDIUM.toString()}>Medium</Radio>
              <Radio value={REWARD_CONFIG.HARD.toString()}>Hard</Radio>
            </VStack>
          </RadioGroup>
        </VStack>
        <HStack spacing={2} justify='center'>
          <Image
            alt=''
            draggable='false'
            src='/images/space-object/bulan.png'
            w='100px'
          />
          <Text color='yellow.1' fontSize='2xl' fontFamily='SomarRounded-Bold'>
            {select}
          </Text>
        </HStack>
        <Button w={{ base: '200px', lg: '70%' }} alignSelf='center'>
          Grant
        </Button>
      </Flex>
    </Layout>
  );
};
