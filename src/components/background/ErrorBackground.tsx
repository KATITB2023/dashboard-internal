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
    >
      <Image
        src='/images/404/bg.png'
        alt=''
        width='100%'
        height='150%'
        maxHeight='150%'
      />
      <Image
        src='/images/404/komet-4.png'
        height={{ base: '201.63px', md: '341.06px' }}
        width={{ base: '201.63px', md: '341.06px' }}
        alt=''
        top={{ base: '385.77px', md: '169.77px' }}
        left={{ base: '-114px', md: '-130px' }}
        transform={{ base: 'rotate(13.85deg)', md: 'rotate(-167.12deg)' }}
      />
      <Image
        src='/images/404/sparkle-telanjang-3.png'
        height='135.99px'
        width='81.11px'
        alt=''
        top='391.26px'
        right='251px'
        transform='rotate(-29.76deg)'
        visibility={{ base: 'hidden', md: 'visible' }}
      />
      <Image
        src='/images/404/sparkle-telanjang-2.png'
        height='124.8px'
        width='74.44px'
        alt=''
        top={{ base: '344px', sm: '569px' }}
        left='62%'
        transform='rotate(25.01deg)'
      />
      <Image
        src='/images/404/mini1-1.png'
        height='170.4px'
        width='100.74px'
        alt=''
        top='954.63px'
        left='191.1px'
        transform='rotate(-34.66 deg)'
        visibility={{ base: 'hidden', sm: 'visible' }}
      />
      <Image
        src='/images/404/komet-1.png'
        height={{ base: '119.59px', md: '383.7px' }}
        width={{ base: '160.04px', md: '430.38px' }}
        alt=''
        top={{ base: '683px', md: '1020.56px' }}
        right='-13%'
      />
      <Image
        src='/images/404/mini2-1.png'
        height={{ base: '111.35px', md: '135.03px' }}
        width={{ base: '124.16px', md: '121.1px' }}
        alt=''
        top={{ base: '1085.26px', md: '1162.72px' }}
        left={{ base: '350px', md: '-38.38px' }}
      />
      <Image
        src='/images/404/mini2-2.png'
        height='135.03px'
        width='121.1px'
        alt=''
        top='1320.2px'
        right='-10px'
        visibility={{ base: 'hidden', md: 'visible' }}
      />
      <Image
        src='/images/404/mini2-2.png'
        height='124.16px'
        width='111.35px'
        alt=''
        top='548px'
        left='23px'
        visibility={{ base: 'visible', md: 'hidden' }}
      />
      <Image
        src='/images/404/komet-2.png'
        height={{ base: '535.08px', md: '581.93px' }}
        width={{ base: '466.1px', md: '506.91px' }}
        alt=''
        top={{ base: '1304.64px', md: '1680px' }}
        left={{ base: '-264px', md: '-238.79px' }}
        transform='rotate(-12.87 deg)'
      />
      <Image
        src='/images/404/bintang-mini-4.png'
        height='1078.06px'
        width='985.58px'
        alt=''
        top='1390.07px'
        right='-400px'
        visibility={{ base: 'hidden', md: 'visible' }}
      />
      <Image
        src='/images/404/mini1-2.png'
        height='170.4px'
        width='100.74px'
        alt=''
        top='1900px'
        left='60.55px'
        visibility={{ base: 'hidden', md: 'visible' }}
        transform='rotate(122.57 deg)'
      />
    </Box>
  );
};

export default ErrorBackground;
