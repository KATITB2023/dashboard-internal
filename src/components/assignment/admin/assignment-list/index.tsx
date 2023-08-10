import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button
} from '@chakra-ui/react';
import { api } from '~/utils/api';

export default function AssignmentList() {
  const assignmentQuery = api.assignment.adminGetAssignment.useQuery();
  const assignmentData = assignmentQuery.data;
  const data = [
    { no: 1, tugas: 'aadsad', mulai: 'Sekarang', berakhir: 'ASDAS' },
    { no: 2, tugas: '2', mulai: 'Sekarang', berakhir: 'ASDAS' },
    { no: 3, tugas: 'apa', mulai: 'Sekarang', berakhir: 'ASDAS' }
  ];

  return (
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
  );
}
