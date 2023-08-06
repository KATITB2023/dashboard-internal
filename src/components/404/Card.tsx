import { Box, Button, Container, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';

const Card = () => {
  return (
    <Box
      width='auto'
      height='auto'
      // Mencoba efek border
      bg='linear-gradient(228deg, #98F9FF 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(58deg, #EABFFF 0%, rgba(135, 38, 183, 0) 100%)'
      borderRadius='35px'
      m={5}
      p={0.45}
    >
      <Box
        width={{ base: '240px', md: '359px' }}
        height={{ base: '322px', md: '484px' }}
        // Biar berjarak
      >
        <Image
          src='/images/404/card-base.png'
          width={{ base: '240px', md: '359px' }}
          height={{ base: '180px', md: '276px' }}
          alt='thumbnail'
        />
        <Flex
          transform='translate(0, -24%)'
          zIndex='1'
          borderRadius='40px'
          flexDirection='column'
          justifyContent='space-between'
          alignItems='center'
          p='24px'
          width={{ base: '240px', md: '359px' }}
          height={{ base: '210px', md: '276px' }}
          bgColor='#1D0263'
        >
          <Container
            width={{ base: '192px', md: '311px' }}
            height={{ base: '58px', md: '76px' }}
            m={0}
            p={0}
          >
            <Text
              noOfLines={2}
              textOverflow='ellipsis'
              width='100%'
              height='100%'
              fontFamily='Bodwars'
              lineHeight={{ base: '28.8px', md: '38.4px' }}
              textAlign='center'
              fontSize={{ base: '24px', md: '32px' }}
            >
              LOREM IPSUM DOLOR SIT AMET
            </Text>
          </Container>
          <Container
            width={{ base: '192px', md: '311px' }}
            height={{ base: '54px', md: '72px' }}
            m={0}
            p={0}
          >
            <Text
              noOfLines={3}
              textOverflow='ellipsis'
              width='100%'
              height='100%'
              fontFamily='SomarRounded-Regular'
              lineHeight={{ base: '18px', md: '24px' }}
              textAlign='justify'
              fontSize={{ base: '12px', md: '16px' }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              varius mauris id tristique ullamcorper. Aliquam finibus erat quis
              erat laoreet mattis. Nulla elementum elit vel diam vulputate
              egestas.
            </Text>
          </Container>
          <Button
            width={{ base: '93px', md: '124px' }}
            height={{ base: '34px', md: '48px' }}
            fontSize={{ base: '12px', md: '16px' }}
          >
            Explore
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default Card;
