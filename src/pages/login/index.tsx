import { Flex } from '@chakra-ui/react';
import LoginBackground from '~/components/background/LoginBackground';
import LoginForm from '~/components/form/LoginForm';
import Layout from '~/layout';

const Login = () => {
  return (
    <Layout title='Login'>
      <Flex
        position='absolute'
        justifyContent={{ base: 'center', md: 'end' }}
        alignItems='center'
        paddingInline={{ base: '0', md: '8rem' }}
        width='100%'
        minHeight='100vh'
        backgroundColor='gray.600'
        top='0'
        left='0'
        zIndex='-100'
      >
        <LoginBackground />
        <LoginForm />
      </Flex>
    </Layout>
  );
};

export default Login;
