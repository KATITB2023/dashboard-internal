import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Header } from '~/components/Header';
import Layout from '~/layout/index';
import AdminAssignmentList from '~/components/assignment/admin/assignment-list';
import AdminAddAssignment from '~/components/assignment/admin/add-assignment';
// import { Redirect } from '~/components/Redirect';

import {
  TabList,
  Tab,
  Tabs,
  Flex,
  TabPanels,
  TabPanel
} from '@chakra-ui/react';

export default function RekapPenilaian() {
  const { data: session } = useSession();
  const router = useRouter();

  // if (!session) return <Redirect />;

  if (session?.user.role === UserRole.ADMIN) {
    return (
      <Layout type='admin' title='Rekap Penilaian' fullBg={false}>
        <Header title='Rekap Penilaian' />
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
    );
  }
}
