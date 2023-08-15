import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';

export const Header = ({ title }: { title: string }) => (
  <Flex flexDirection='row' gap='4'>
    <Image
      src='/images/space-object/bulan-sabit.png'
      alt=''
      w={{ base: '3rem', lg: '100px' }}
      h={{ base: '3rem', lg: '100px' }}
      draggable='false'
      loading='lazy'
    />
    <Box alignSelf='center'>
      <Heading fontWeight='normal' fontSize={{ base: 'xl', lg: '4xl' }}>
        Dashboard
      </Heading>
      <Text
        color='purple.5'
        fontSize='xl'
        fontFamily='SomarRounded-Bold'
        fontWeight='bold'
      >
        {title}
      </Text>
    </Box>
  </Flex>
);
