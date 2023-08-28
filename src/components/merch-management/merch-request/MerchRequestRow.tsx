import { Tr, Td, Button } from '@chakra-ui/react';
import { type RouterOutputs } from '~/utils/api';

interface Props {
  data: RouterOutputs['merch']['getMerchRequest']['data'][0];
  index: number;
}

export default function AssignmentListRow({ data, index }: Props) {
  return (
    <Tr>
      <Td w='10%'>{index}</Td>
      <Td w='25%'>{data.merch.name}</Td>
      <Td w='25%'>{data.student.profile?.name}</Td>
      <Td w='20%'>{data.student.nim}</Td>
      <Td w='20%'>
        <Button>Accept</Button>
      </Td>
    </Tr>
  );
}
