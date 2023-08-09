import { Flex, Image, Link, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import ErrorBackground from '~/components/background/ErrorBackground';

export default function Custom404() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <Flex
      width='100%'
      minH='100dvh'
      height='auto'
      justifyContent='space-around'
      alignItems='center'
      flexDirection='column'
      gap='250px'
    >
      <Flex justifyContent='center' alignItems='center' flexDirection='column'>
        <Image
          src='/img/404/404-glow.png'
          alt='404'
          width={{ base: '303px', md: '565px' }}
          height={{ base: '211px', md: '393px' }}
        ></Image>
        <Flex
          justifyContent='space-evenly'
          alignItems='center'
          textAlign='center'
          textColor='#FFFFFF'
          flexDirection='column'
          height={{ base: '196px', md: '178px' }}
          width={{ base: '287px', md: '566px' }}
        >
          <Text fontFamily='Bodwars' fontSize={{ base: '36px', md: '48px' }}>
            UPS!
          </Text>
          <Text
            fontFamily='SomarRounded-Bold'
            fontSize={{ base: '20px', md: '36px' }}
          >
            Sepertinya kamu tersesat!
          </Text>
          <Text
            fontFamily='SomarRounded-Regular'
            fontSize={{ base: '14px', md: '20px' }}
          >
            Jangan khawatir! Kamu dapat kembali ke{' '}
            <Link
              onClick={goBack}
              _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
              style={{ color: '#FE06BE' }}
            >
              halaman sebelumnya
            </Link>
            .
          </Text>
        </Flex>
      </Flex>
      <ErrorBackground />
    </Flex>
  );
}
