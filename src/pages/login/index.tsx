import { Box, Flex, Image } from '@chakra-ui/react';
import Layout from '~/layout';
import LoginForm from '../../components/form/LoginForm';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from 'next';
import { getCsrfToken } from 'next-auth/react';

const Login = ({
  csrfToken
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Layout title='Login'>
        <Flex
          position='absolute'
          minHeight='100vh'
          w='100%'
          top='0'
          left='0'
          alignItems='center'
          justifyContent='center'
        >
          <LoginForm csrfToken={csrfToken} />
          <Box
            h='120%'
            w='120%'
            justifyContent='center'
            alignItems='center'
            backgroundImage='/images/login/blur4a.png'
            backgroundPosition='center'
            backgroundRepeat='no-repeat'
            backgroundSize='cover'
            filter='blur(80px)'
            position='fixed'
            zIndex='-10'
          />
          <Image
            src='/images/login/blan-telanjang.png'
            alt=''
            position='absolute'
            h='25%'
            left='0'
            top='15%'
            zIndex='-9'
            draggable='false'
            loading='lazy'
          />
          <Image
            src='/images/login/Planet-dudidam.png'
            alt=''
            position='absolute'
            h='25%'
            right='0'
            top='5%'
            zIndex='-9'
            draggable='false'
            loading='lazy'
          />
          <Image
            src='/images/login/spark2.png'
            alt=''
            position='absolute'
            h='25%'
            right='0'
            bottom='0'
            zIndex='-9'
            draggable='false'
            loading='lazy'
          />
          <Image
            src='/images/login/sparkle.png'
            alt=''
            position='absolute'
            h='25%'
            left='0'
            bottom='0'
            zIndex='-9'
            draggable='false'
            loading='lazy'
          />
          <Image
            src='/images/login/spiral-12b.png'
            alt=''
            position='absolute'
            h='25%'
            right='35%'
            bottom='30%'
            zIndex='-9'
            draggable='false'
            loading='lazy'
          />
        </Flex>
      </Layout>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      csrfToken
    }
  };
}

export default Login;
