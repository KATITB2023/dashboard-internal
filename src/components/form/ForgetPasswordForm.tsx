import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { colors } from '~/styles/component/colors';

const ForgotPasswordForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset
  } = useForm<{ email: string }>({
    mode: 'onSubmit',
    defaultValues: {
      email: ''
    }
  });

  const toast = useToast();

  const handleSuccess = () => {
    toast({
      title: 'Success',
      description: 'Berhasil mengirim email!',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top'
    });
  };

  const handleError = (error: string) => {
    toast({
      title: 'Error',
      description: error,
      status: 'error',
      duration: 2000,
      isClosable: true,
      position: 'top'
    });
  };

  const onSubmit: SubmitHandler<{ email: string }> = (data, event) => {
    event?.preventDefault();
    if (data.email !== 'anu@anu.anu') {
      handleError('Email tidak terdaftar');
      reset({}, { keepErrors: true, keepValues: true });
      return;
    }

    handleSuccess();
    reset();
  };

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
      <Box textAlign='center' lineHeight='2em'>
        <Heading
          size={{ base: 'xl', md: '3xl' }}
          color='yellow.5'
          textShadow={`0px 0px 10px ${colors.yellow[5]}`}
        >
          <VStack spacing={3}>
            <Text>Lupa</Text>
            <Text>Password</Text>
          </VStack>
        </Heading>
        <Text>Tenang saja, Voyagers!</Text>
      </Box>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <VStack spacing={10}>
          <FormControl isInvalid={!!errors.email}>
            <Input
              type='email'
              placeholder='Email'
              {...register('email', {
                required: 'Email tidak boleh kosong',
                validate: (value) => value.includes('@') || 'Email tidak valid'
              })}
              width={{ base: '15rem', md: '20rem' }}
              size={{ base: 'sm', md: 'md' }}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <Button
            type='submit'
            width='8rem'
            isDisabled={!isDirty || !isValid}
            isLoading={isSubmitting}
            loadingText='Loading'
          >
            Kirim
          </Button>
        </VStack>
      </form>
    </Flex>
  );
};

export default ForgotPasswordForm;
