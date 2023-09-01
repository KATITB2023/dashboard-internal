import router, { useRouter } from 'next/router';
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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { REWARD_CONFIG } from '~/utils/reward';
import { api } from '~/utils/api';
import { BsCheckCircleFill } from 'react-icons/bs';
import { TRPCClientError } from '@trpc/client';

export const GrantPengunjung = () => {
  const id = router.query.id;
  const rewardMutation = api.unit.sentReward.useMutation();
  const studentQuery = api.unit.getStudent.useQuery({
    id: id as string
  });
  const { data: student } = studentQuery;
  const [select, setSelect] = useState<REWARD_CONFIG>(REWARD_CONFIG.EASY);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const route = useRouter();
  const toast = useToast();

  const handleGrant = async () => {
    setLoading(true);

    try {
      await rewardMutation.mutateAsync({
        studentId: id as string,
        reward: select
      });
      onOpen();
    } catch (err: unknown) {
      if (!(err instanceof TRPCClientError)) throw err;

      toast({
        description: err.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }

    setLoading(false);
  };

  return (
    <Layout type='unit' title='Grant Coin' fullBg={false}>
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
          <Avatar name={student?.profile?.name} />
          <Box>
            <Text fontWeight='bold'>{student?.profile?.name}</Text>
            <Text>{student?.nim}</Text>
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
        <Button
          w={{ base: '200px', lg: '70%' }}
          alignSelf='center'
          onClick={() => void handleGrant()}
          isLoading={loading}
          loadingText='Granting'
        >
          Grant
        </Button>
      </Flex>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          void route.push('/pengunjung/list');
        }}
        isCentered
        size='xs'
      >
        <ModalOverlay />
        <ModalContent bg='gray.600' containerProps={{ px: 6 }}>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={2} alignItems='center' py={4}>
              <BsCheckCircleFill color='#2FC1AD' size={48} />
              <Text
                fontFamily='SomarRounded-Bold'
                color='white'
                textAlign='center'
                fontSize='2xl'
              >
                {select} COINS!
              </Text>
              <Text
                fontFamily='SomarRounded-Bold'
                color='rgba(255, 255, 255, 0.6)'
                textAlign='center'
              >
                Koin berhasil dikirim!
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
};
