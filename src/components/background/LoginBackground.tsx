import {
  Box,
  Image as ChakraImage,
  keyframes,
  type ImageProps,
  forwardRef
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

const rotating = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg) 
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg) 
  }
`;

const LoginBackground = () => {
  const Image = forwardRef<ImageProps, 'img'>((props: ImageProps, ref) => (
    <ChakraImage
      ref={ref}
      draggable='false'
      loading='lazy'
      position='absolute'
      zIndex='-10'
      alt=''
      filter='brightness(0.8)'
      {...props}
    />
  ));

  const asteroidRef = useRef<HTMLImageElement>(null);
  const asteroidMiniRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    function animateAsteroid() {
      if (asteroidRef.current && asteroidMiniRef.current) {
        asteroidRef.current.style.setProperty(
          'height',
          `${Math.random() * 7 + 3}%`
        );
        asteroidMiniRef.current.style.setProperty(
          'height',
          `${Math.random() * 3.5 + 1.5}%`
        );
        asteroidRef.current.animate(
          [
            {
              transform: `translate(${Math.random() * -130}vw, 0) rotate(0deg)`
            },
            {
              transform: `translate(${
                Math.random() * -130
              }vw, 150vh) rotate(180deg)`
            }
          ],
          {
            duration: 8000,
            easing: 'linear'
          }
        );
        asteroidMiniRef.current.animate(
          [
            {
              transform: `translate(${Math.random() * -130}vw, 0) rotate(0deg)`
            },
            {
              transform: `translate(${
                Math.random() * -130
              }vw, 150vh) rotate(180deg)`
            }
          ],
          {
            duration: 8000,
            delay: 4000,
            easing: 'linear'
          }
        );
      }
    }

    const animateInterval = setInterval(animateAsteroid, 15000);

    animateAsteroid();

    return () => clearInterval(animateInterval);
  }, []);

  return (
    <Box
      position='absolute'
      inset='0'
      margin='auto'
      overflow='hidden'
      zIndex='-10'
    >
      <Image
        src='/images/login/moon-bg.png'
        height={{ base: 'auto', md: '90%' }}
        width={{ base: '90%', md: 'auto' }}
        alt=''
        top={{ base: '95%', md: '50%' }}
        left={{ base: '50%', md: '5%' }}
        brightness='0.6'
        animation={`${rotating} infinite 90s linear`}
      />
      <Image
        src='/images/login/stars-bg.png'
        height={{ base: 'auto', md: '150%' }}
        width={{ base: '150%', md: 'auto' }}
        maxWidth='150%'
        alt=''
        top={{ base: '95%', md: '50%' }}
        left={{ base: '50%', md: '5%' }}
        animation={`${rotating} infinite 120s linear`}
      />
      <Image
        src='/images/login/asteroids-bg.png'
        height={{ base: 'auto', md: '150%' }}
        width={{ base: '150%', md: 'auto' }}
        maxWidth='150%'
        alt=''
        top={{ base: '95%', md: '50%' }}
        left={{ base: '50%', md: '5%' }}
        animation={`${rotating} infinite 140s linear`}
      />
      <Image
        src='/images/login/spark.png'
        alt=''
        top='0'
        right='-2rem'
        height='15%'
      />
      <Image
        src='/images/login/spark_mini.png'
        alt=''
        top='20%'
        right='-1rem'
        height='15%'
      />
      <Image
        src='/images/login/spark_mini.png'
        alt=''
        top={{ base: '0', md: '70%' }}
        right={{ base: '70%', md: '-3rem' }}
        height='15%'
      />
      <Image
        ref={asteroidRef}
        src='/images/login/asteroid-sm.png'
        alt=''
        top='-30%'
        right='-15vw'
        zIndex='-100'
      />
      <Image
        ref={asteroidMiniRef}
        src='/images/login/asteroid-mini-sm.png'
        alt=''
        top='-30%'
        right='-15vw'
        zIndex='-100'
      />
    </Box>
  );
};

export default LoginBackground;
