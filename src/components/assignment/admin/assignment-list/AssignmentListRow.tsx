import { Tr, Td, Button } from '@chakra-ui/react';
import { type RouterOutputs, api } from '~/utils/api';
import EditAssignmentModal from './EditAssignmentModal';

interface Props {
  data: RouterOutputs['assignment']['adminGetAssignment'][0];
  index: number;
}

export default function AssignmentListRow({ data, index }: Props) {
  const assignmentQuery = api.assignment.adminGetAssignment.useQuery();

  return (
    <Tr>
      <Td w='10%'>{index}</Td>
      <Td w='20%'>{data.title}</Td>
      <Td w='20%'>
        {data.type.includes('_') ? data.type.split('_').join(' ') : data.type}
      </Td>
      <Td w='15%'>
        {new Date(data.startTime).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
      </Td>
      <Td w='15%'>
        {new Date(data.endTime).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
      </Td>
      <Td w='10%'>
        <Button variant='outline'>Unduh</Button>
      </Td>
      <EditAssignmentModal
        props={data}
        emit={() => void assignmentQuery.refetch()}
      />
    </Tr>
  );
}
