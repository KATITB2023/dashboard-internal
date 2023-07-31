import { Flex } from '@chakra-ui/react';
import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext
} from 'next';
import { getCsrfToken } from 'next-auth/react';
import LoginBackground from '~/components/background/LoginBackground';
import LoginForm from '~/components/form/LoginForm';
import Layout from '~/layout';

const Login = ({
  csrfToken
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout title='Login'>
      <Flex
        position='absolute'
        // paddingTop='6rem'
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
          paddingInline={{ base: '0', md: '8rem' }}
          width='100%'
        >
          <LoginBackground />
          <LoginForm csrfToken={csrfToken} />
        </Flex>
      </Flex>
    </Layout>
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
