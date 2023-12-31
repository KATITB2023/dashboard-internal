import { Tr, Td, Button } from '@chakra-ui/react';
import { type RouterOutputs } from '~/utils/api';
import EditAssignmentModal from './EditAssignmentModal';

interface Props {
  data: RouterOutputs['assignment']['adminGetAssignment']['data'][0];
  index: number;
  loading: boolean;
  assignmentId: string;
  downloadCSV: (id: string, title: string) => void;
  emit: () => void;
}

export default function AssignmentListRow({
  data,
  index,
  loading,
  assignmentId,
  downloadCSV,
  emit
}: Props) {
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
        <Button
          variant='outline'
          onClick={() => void downloadCSV(data.id, data.title)}
          isLoading={assignmentId === data.id && loading}
          isDisabled={assignmentId !== data.id && loading}
        >
          Unduh
        </Button>
      </Td>
      <EditAssignmentModal props={data} emit={() => emit()} />
    </Tr>
  );
}
