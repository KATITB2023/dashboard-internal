import { type NextPage } from 'next';
import Layout from '~/layout';
import { Button, Link } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';

const Home: NextPage = () => {
  return (
    <Link href='/admin/article-cms'>
      <Button>Sign in</Button>
    </Link>
  );
};

export default Home;
