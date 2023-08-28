import { useSession } from 'next-auth/react';
import { Header } from '~/components/Header';
import Layout from '~/layout/index';
import MerchCatalog from '~/components/merch-management/merch-catalog';
import MerchRequest from '~/components/merch-management/merch-request';
import React from 'react';
import {
  TabList,
  Tabs,
  Flex,
  TabPanels,
  TabPanel,
  type TabProps,
  Button,
  useTab,
  useMultiStyleConfig
} from '@chakra-ui/react';
import AdminRoute from '~/layout/AdminRoute';
import { withSession } from '~/server/auth/withSession';

export const getServerSideProps = withSession({ force: true });

export default function Merchandise() {
  const { data: session } = useSession();

  // eslint-disable-next-line react/display-name
  const Tab = React.forwardRef((props: TabProps, _) => {
    const tabProps = useTab({ ...props });
    const isSelected = !!tabProps['aria-selected'];

    const styles = useMultiStyleConfig('Tabs', tabProps);

    return (
      <Button
        __css={styles.tab}
        {...tabProps}
        bgImage={isSelected ? '/images/bg-bar.png' : 'none'}
        bgRepeat='no-repeat'
        bgColor={isSelected ? 'black' : 'none'}
        borderRadius='2xl'
        border='none'
        color={isSelected ? 'white' : 'black'}
        fontWeight='bold'
      >
        {tabProps.children}
      </Button>
    );
  });

  return (
    <AdminRoute session={session} allowEO={true}>
      <Layout type='admin' title='Tugas dan Penilaian' fullBg={false}>
        <Flex w={'full'} h={'100%'} direction={'column'}>
          <Header title='Tugas dan Penilaian' />
          <Tabs
            variant='soft-rounded'
            colorScheme='green'
            align='center'
            w='100%'
            isLazy={true}
          >
            <TabList w='initial' px='0'>
              <Flex
                border='4px solid black'
                borderRadius='3xl'
                w='100%'
                flexDir={{
                  base: 'column',
                  md: 'row'
                }}
                alignItems='center'
              >
                <Tab
                  w={{
                    base: '100%',
                    md: '50%'
                  }}
                >
                  Atur Katalog Merchandise
                </Tab>
                <Tab
                  w={{
                    base: '100%',
                    md: '50%'
                  }}
                >
                  Pending Request
                </Tab>
              </Flex>
            </TabList>
            <TabPanels mt='2em'>
              <TabPanel>
                <MerchCatalog />
              </TabPanel>
              <TabPanel>
                <MerchRequest />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Layout>
    </AdminRoute>
  );
}
