import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Header } from '~/components/Header';
import Layout from '~/layout/index';
import AdminAssignmentList from '~/components/assignment/admin/assignment-list';
import AdminAddAssignment from '~/components/assignment/admin/add-assignment';
import React from 'react';
import { Redirect } from '~/components/Redirect';
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

export default function RekapPenilaian() {
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
    <AdminRoute session={session}>
      <Layout type='admin' title='Tugas dan Penilaian' fullBg={false}>
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
                Daftar Tugas
              </Tab>
              <Tab
                w={{
                  base: '100%',
                  md: '50%'
                }}
              >
                Tambah Tugas
              </Tab>
            </Flex>
          </TabList>
          <TabPanels mt='2em'>
            <TabPanel>
              <AdminAssignmentList />
            </TabPanel>
            <TabPanel>
              <AdminAddAssignment />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Layout>
    </AdminRoute>
  );
}
