import {
  Box,
  Image as ChakraImage,
  type ImageProps,
  forwardRef
} from '@chakra-ui/react';

const ErrorBackground = () => {
  const Image = forwardRef<ImageProps, 'img'>((props: ImageProps, ref) => (
    <ChakraImage
      ref={ref}
      draggable='false'
      loading='lazy'
      position='absolute'
      zIndex='-10'
      {...props}
    />
  ));

  return (
    <Box
      position='absolute'
      inset='0'
      margin='auto'
      overflow='hidden'
      zIndex='-10'
      backgroundImage='/images/404/bg.png'
      backgroundSize='cover'
      backgroundPosition='center'
      backgroundRepeat='no-repeat'
    >
      <Image
        src='/images/404/komet-4.png'
        alt=''
        top={{ base: '23%', md: '7%' }}
        left={{ base: '-35%', xl: '-10%' }}
        transform={{ base: 'rotate(13.85deg)', md: 'rotate(-167.12deg)' }}
      />
      <Image
        src='/images/404/sparkle-telanjang-3.png'
        alt=''
        top='18%'
        right='17%'
        transform='rotate(-29.76deg)'
        visibility={{ base: 'hidden', md: 'visible' }}
      />
      <Image
        src='/images/404/sparkle-telanjang-2.png'
        alt=''
        top={{ base: '45%', md: '26%' }}
        left='62%'
        transform='rotate(25.01deg)'
      />
      <Image
        src='/images/404/mini1-1.png'
        alt=''
        top='44%'
        left='13%'
        transform='rotate(-34.66 deg)'
        visibility={{ base: 'hidden', md: 'visible' }}
      />
      <Image
        src='/images/404/komet-1.png'
        alt=''
        top={{ base: '41%', md: '48%' }}
        right={{ base: '-60%', lg: '-13%' }}
      />
      <Image
        src='/images/404/mini2-1.png'
        alt=''
        top={{ base: '66%', md: '55%' }}
        left={{ base: '90%', md: '-3%' }}
      />
      <Image
        src='/images/404/mini2-2.png'
        alt=''
        top='62%'
        right='0.1%'
        visibility={{ base: 'hidden', md: 'visible' }}
      />
      <Image
        src='/images/404/mini2-2.png'
        alt=''
        top='62%'
        left='2%'
        visibility={{ base: 'visible', md: 'hidden' }}
      />
      <Image
        src='/images/404/komet-2.png'
        alt=''
        top='79%'
        left='-16%'
        transform='rotate(-12.87deg)'
      />
      <Image
        src='/images/404/bintang-mini-4.png'
        alt=''
        top='65%'
        right='-27%'
        visibility={{ base: 'hidden', md: 'visible' }}
        transform='rotate(162.53deg)'
      />
      <Image
        src='/images/404/mini1-2.png'
        alt=''
        top='89%'
        left='4%'
        visibility={{ base: 'hidden', md: 'visible' }}
        transform='rotate(122.57deg)'
      />
    </Box>
  );
};

export default ErrorBackground;
