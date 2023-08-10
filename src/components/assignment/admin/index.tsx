import { Header } from '~/components/Header';
import Layout from '~/layout/index';
import { api } from '~/utils/api';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TabList,
  Tab,
  Tabs,
  Flex,
  TableCaption,
  TableContainer,
  Button
} from '@chakra-ui/react';

export default function RekapPenilaian() {
  const assignmentQuery = api.assignment.adminGetAssignment.useQuery();
  const assignmentData = assignmentQuery.data;
  const data = [
    { no: 1, tugas: 'aadsad', mulai: 'Sekarang', berakhir: 'ASDAS' },
    { no: 2, tugas: '2', mulai: 'Sekarang', berakhir: 'ASDAS' },
    { no: 3, tugas: 'apa', mulai: 'Sekarang', berakhir: 'ASDAS' }
  ];
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
              Daftar Event
            </Tab>
            <Tab
              w={{
                base: '100%',
                md: '50%'
              }}
            >
              Recap Absensi Mentee
            </Tab>
          </Flex>
        </TabList>

        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>No.</Th>
                <Th>Tugas</Th>
                <Th>Mulai</Th>
                <Th>Berakhir</Th>
                <Th>Rekap Nilai</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item) => (
                <Tr key={item.no}>
                  <Td>{item.no}</Td>
                  <Td>{item.tugas}</Td>
                  <Td>{item.mulai}</Td>
                  <Td>{item.berakhir}</Td>
                  <Td>
                    <Button variant='outline'>Unduh</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Tabs>
    </Layout>
  );
}
