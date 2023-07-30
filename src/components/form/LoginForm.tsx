import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  VStack
} from '@chakra-ui/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useState } from 'react';
import { colors } from '~/styles/component/colors';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Flex
      color='white'
      direction='column'
      justifyContent='center'
      alignItems='center'
      height='fit-content'
      padding={{ base: '3rem 2rem', md: '6rem 4rem' }}
      gap='2.5rem'
      position='relative'
      overflow='hidden'
      zIndex='1'
      boxShadow={{ base: 'none', md: '0px 0px 10px 0px #117584' }}
      borderRadius='1rem'
      backgroundImage={{ base: 'none', md: 'url("/images/login/form_bg.png")' }}
      backgroundSize='cover'
      backgroundRepeat='no-repeat'
      backgroundPosition='center'
    >
      <Heading
        size={{ base: 'xl', md: '3xl' }}
        color='yellow.5'
        textShadow={`0px 0px 10px ${colors.yellow[5]}`}
      >
        LOGIN
      </Heading>
      <form>
        <VStack spacing={4}>
          <FormControl>
            <Input
              type='number'
              placeholder='NIM'
              size={{ base: 'sm', md: 'md' }}
              width={{ base: '15rem', md: '20rem' }}
            />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <FormControl>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                size={{ base: 'sm', md: 'md' }}
              />
              <InputRightElement
                display='flex'
                height='100%'
                alignItems='center'
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible
                    cursor='pointer'
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <AiOutlineEye
                    cursor='pointer'
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
        </VStack>
      </form>
      <Flex
        direction='column'
        justifyContent='center'
        alignItems='center'
        gap='.5rem'
      >
        <Button width='8rem' size={{ base: 'sm', md: 'md' }}>
          Login
        </Button>
        <Link href='/' fontSize={{ base: 'xs', md: 'sm' }}>
          Lupa Password?
        </Link>
      </Flex>
      <Image
        display={{ base: 'none', md: 'block' }}
        src='/images/login/planet_ijo.png'
        alt=''
        position='absolute'
        left='0'
        bottom='0'
        height='40%'
      />
      <Image
        display={{ base: 'none', md: 'block' }}
        src='/images/login/planet_biru.png'
        alt=''
        position='absolute'
        right='0'
        bottom='0'
        height='30%'
      />
    </Flex>
  );
};

export default LoginForm;
