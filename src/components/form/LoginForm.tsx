import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  VStack,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { type InferGetServerSidePropsType } from 'next';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { UserRole } from '@prisma/client';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { type getServerSideProps } from '~/pages';
import { colors } from '~/styles/component/colors';

interface FormValues {
  password: string;
  nim: string;
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
    setError,
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
    role === UserRole.MENTOR
      ? void router.push('/group-management')
      : void router.push('/rekap-penilaian');
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

    if (res?.error) {
      handleError(res.error);
      setError('root', { message: res.error });
      reset({}, { keepErrors: true, keepValues: true });
      return;
    }

    handleLoggedIn();
    reset();
  };

  // if (session) handleRedirect();

  return (
    <Flex
      color='white'
      direction='column'
      justifyContent='center'
      alignItems='center'
      gap='3rem'
      position='relative'
      zIndex='1'
    >
      <Heading
        size={{ base: 'xl', md: '3xl' }}
        color='yellow.5'
        textShadow={`0px 0px 10px ${colors.yellow[5]}`}
      >
        LOGIN
      </Heading>
      <form onSubmit={(e) => void handleSubmit(login)(e)}>
        <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.nim}>
            <Input
              type='number'
              placeholder='NIM'
              {...register('nim', { required: 'NIM tidak boleh kosong' })}
              size={{ base: 'sm', md: 'md' }}
              width={{ base: '17.5rem', md: '25rem' }}
            />
            <FormErrorMessage>{errors.nim?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                {...register('password', {
                  required: 'Password tidak boleh kosong'
                })}
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
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
        </VStack>
        <Flex
          direction='column'
          justifyContent='center'
          alignItems='center'
          marginTop='3rem'
          gap='.5rem'
        >
          <Button
            type='submit'
            width='8rem'
            isLoading={isSubmitting}
            loadingText='Loading'
            isDisabled={!isDirty || !isValid}
            size={{ base: 'sm', md: 'md' }}
            zIndex='2'
          >
            Login
          </Button>
          <Link
            href='/forgot-password'
            fontSize={{ base: 'xs', md: 'sm' }}
            zIndex='2'
          >
            Lupa Password?
          </Link>
        </Flex>
      </form>
    </Flex>
  );
};

export default LoginForm;
