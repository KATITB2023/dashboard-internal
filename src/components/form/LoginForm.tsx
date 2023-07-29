import {
  Flex,
  Image,
  Heading,
  FormControl,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react';
import { UserRole } from '@prisma/client';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import type { InferGetServerSidePropsType } from 'next';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { type getServerSideProps } from '~/pages/login';

interface FormValues {
  nim: string;
  password: string;
}

const LoginForm = ({
  csrfToken
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid, isSubmitting },
    reset
  } = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: {
      nim: '',
      password: ''
    }
  });

  const handleLoggedIn = () => {
    toast({
      title: 'Success',
      description: 'Berhasil login!',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top'
    });
    handleRedirect();
  };

  const handleRedirect = () => {
    const role = session?.user.role;
    role === UserRole.MENTOR ? void router.push('/') : void router.push('/');
  };

  const handleError = (message: string) => {
    toast({
      title: 'Error',
      description: `${message}`,
      status: 'error',
      duration: 2000,
      isClosable: true,
      position: 'top'
    });
  };

  const login: SubmitHandler<FormValues> = async (data: FormValues, event) => {
    event?.preventDefault();
    const res = await signIn('credentials', {
      nim: data.nim,
      password: data.password,
      redirect: false,
      csrfToken
    });

    if (res?.ok) handleLoggedIn();
    if (res?.error) handleError(res.error);

    reset({}, { keepErrors: true, keepValues: !!errors });
  };

  // if (session) handleRedirect();

  return (
    <Flex
      color='white'
      direction='column'
      alignItems='center'
      padding={{ base: '2.5rem', md: '3rem 4rem' }}
      borderRadius={{ base: '2.5rem', md: '4rem' }}
      backdropFilter='blur(13px)'
      boxShadow='3px 3px 14px 0px rgba(0, 0, 0, 0.69)'
      backgroundColor='rgba(237, 240, 247, 0.20)'
      width={{ base: 'auto', md: '28rem' }}
      gap={{ base: '1.5rem', md: '2.5rem' }}
    >
      <Image
        src='/images/login/Vector.png'
        alt=''
        w={{ base: '12rem', md: '16rem' }}
        draggable='false'
        loading='lazy'
      />
      <Heading fontSize={{ base: '2xl', md: '5xl' }} textAlign='center'>
        LOGIN
      </Heading>
      <form
        onSubmit={(e) => void handleSubmit(login)(e)}
        style={{
          width: '100%'
        }}
      >
        <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
        <VStack spacing={{ base: 5, md: 10 }} width='100%'>
          <FormControl isInvalid={!!errors.nim}>
            <Input
              placeholder='NIM'
              {...register('nim', { required: 'NIM tidak boleh kosong' })}
              type='text'
              size={{ base: 'sm', md: 'md' }}
            />
            <FormErrorMessage>{errors.nim?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <InputGroup size={{ base: 'sm', md: 'md' }}>
              <Input
                placeholder='Password'
                {...register('password', {
                  required: 'Password tidak boleh kosong'
                })}
                type={showPassword ? 'text' : 'password'}
              />
              <InputRightElement height='100%' paddingRight='1rem'>
                {!showPassword ? (
                  <AiOutlineEye onClick={() => setShowPassword(true)} />
                ) : (
                  <AiOutlineEyeInvisible
                    onClick={() => setShowPassword(false)}
                  />
                )}
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
          <Button
            type='submit'
            isDisabled={!isDirty || !isValid}
            isLoading={isSubmitting}
            loadingText='Loading'
            maxW='12rem'
            w='100%'
            fontFamily='Bodwars'
            cursor='pointer'
            size={{ base: 'sm', md: 'md' }}
          >
            Login
          </Button>
        </VStack>
      </form>
      <Text
        fontSize='.625rem'
        fontFamily='Bodwars'
        cursor='pointer'
        color='gray.300'
        textShadow='0.7px 0.7px 1.35px 0px rgba(0, 0, 0, 0.69)'
      >
        FORGOT PASSWORD?
      </Text>
    </Flex>
  );
};

export default LoginForm;
