import { Flex, Image, Text } from '@chakra-ui/react';
import Card from '~/component/404/Card';

export default function Custom404() {
  return (
    <Flex
      width='100%'
      height='100%'
      bgImage='url(/img/404/error-background.png)'
      bgRepeat='no-repeat'
      bgSize='100% 100%'
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
            Jangan khawatir, Spacefarers! Kalian bisa kembali ke{' '}
            <a
              href='https://oskmitb.com'
              style={{ color: '#FE06BE', textDecoration: 'underline' }}
            >
              home
            </a>{' '}
            atau kunjungi fitur menarik lainnya di bawah ini.
          </Text>
        </Flex>
      </Flex>
      <Flex
        justifyContent='space-evenly'
        alignItems='center'
        textAlign='center'
        textColor='#FFFFFF'
        flexDirection='column'
      >
        <Text
          width={{ base: '284px', md: '676px' }}
          fontFamily='Bodwars'
          fontSize={{ base: '24px', md: '32px' }}
        >
          CEK FITUR MENARIK LAINNYA DI SINI
        </Text>
        <br />
        <Flex
          justifyContent='space-evenly'
          alignItems='center'
          flexDirection={{ base: 'column', lg: 'row' }}
        >
          <Card />
          <Card />
          <Card />
        </Flex>
      </Flex>
    </Flex>
  );
}
