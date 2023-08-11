import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Text,
  TableContainer,
  Button
} from '@chakra-ui/react';
import { api } from '~/utils/api';
import AssignmentListRow from './AssignmentListRow';

export default function AssignmentList() {
  const assignmentQuery = api.assignment.adminGetAssignment.useQuery();
  const assignmentData = assignmentQuery.data;
  const header = [
    { w: '10%', title: 'No.' },
    { w: '20%', title: 'Tugas' },
    { w: '20%', title: 'Jenis' },
    { w: '15%', title: 'Mulai' },
    { w: '15%', title: 'Berakhir' },
    { w: '10%', title: 'Rekap Nilai' },
    { w: '10%', title: 'Edit' }
  ];

  return assignmentQuery.isLoading ? (
    <Text>Loading</Text>
  ) : (
    <TableContainer>
      <Table variant={'black'}>
        <Thead>
          <Tr>
            {header.map((item, index) => {
              return (
                <Th key={index} w={item.w} textAlign={'center'}>
                  {item.title}
                </Th>
              );
            })}
          </Tr>
        </Thead>

        <Tbody>
          {assignmentData &&
            assignmentData.map((item, index) => {
              return (
                <AssignmentListRow
                  data={item}
                  index={index + 1}
                  key={item.id}
                />
              );
            })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
