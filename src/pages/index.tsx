import { type NextPage } from 'next';
import Layout from '~/layout';
import { Button } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

const Home: NextPage = () => {
  return <Layout title='Home'>
    Ini Home
    <Button onClick={() => void signIn()}>Sign in</Button>
  </Layout>;
  
};

export default Home;
