import { Flex } from '@chakra-ui/react';
import LoginBackground from '~/components/background/LoginBackground';
import ForgotPasswordForm from '~/components/form/ForgetPasswordForm';
import Layout from '~/layout';

const ForgetPassword = () => {
  return (
    <Layout title='Forget Password'>
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
          <ForgotPasswordForm />
        </Flex>
      </Flex>
    </Layout>
  );
};

export default ForgetPassword;
