import { Flex } from '@chakra-ui/react';
import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext
} from 'next';
import { getCsrfToken } from 'next-auth/react';
import Head from 'next/head';
import LoginBackground from '~/components/background/LoginBackground';
import LoginForm from '~/components/form/LoginForm';

const Login = ({
  csrfToken
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Login - KAT ITB 2023</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Flex
        position='absolute'
        top='0'
        left='0'
        width='100%'
        backgroundColor='gray.600'
        zIndex='-100'
        minHeight='100vh'
      >
        <Flex
          justifyContent={{ base: 'center', md: 'end' }}
          alignItems='center'
          paddingInline={{ base: '0', md: '10rem' }}
          width='100%'
        >
          <LoginBackground />
          <LoginForm csrfToken={csrfToken} />
        </Flex>
      </Flex>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken }
  };
};

export default Login;
