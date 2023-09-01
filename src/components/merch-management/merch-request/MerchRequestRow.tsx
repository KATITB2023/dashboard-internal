import {
  Tr,
  Td,
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text
} from '@chakra-ui/react';
import { TRPCClientError } from '@trpc/client';
import { useState } from 'react';
import { type RouterOutputs, api } from '~/utils/api';

interface Props {
  data: RouterOutputs['merch']['getMerchRequest']['data'][0];
  index: number;
  emit: () => void;
}

export default function AssignmentListRow({ data, index, emit }: Props) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const approveQuery = api.merch.approveMerchRequest.useMutation();

  const acceptRequest = async () => {
    setLoading(true);
    try {
      const result = await approveQuery.mutateAsync({ requestId: data.id });

      toast({
        title: 'Success',
        description: result.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });

      onClose();
      emit();
    } catch (error) {
      if (!(error instanceof TRPCClientError)) throw error;

      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
    setLoading(false);
  };

  return (
    <Tr>
      <Td w='10%'>{index}</Td>
      <Td w='25%'>{data.merch.name}</Td>
      <Td w='25%'>{data.student.profile?.name}</Td>
      <Td w='20%'>{data.student.nim}</Td>
      <Td w='20%'>
        {data.isApproved ? (
          <Text py={2}>Accepted</Text>
        ) : (
          <>
            <Button onClick={onOpen}>Accept</Button>
            <Modal isOpen={isOpen} onClose={onClose} size={'xl'} isCentered>
              <ModalOverlay />

              <ModalContent>
                <ModalHeader>Accept request</ModalHeader>
                <ModalBody>
                  <Text>Are you sure you want to accept this request?</Text>
                </ModalBody>

                <ModalFooter columnGap={4}>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button
                    type='button'
                    variant={'outline'}
                    onClick={() => void acceptRequest()}
                    isLoading={loading}
                    loadingText='Accepting...'
                  >
                    Yes
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )}
      </Td>
    </Tr>
  );
}
