import {
  Button,
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Flex,
  Text,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { api } from '~/utils/api';
import { TRPCClientError } from '@trpc/client';

interface Props {
  id: string;
  title: string;
  emit: (data: boolean) => void;
}

export default function DeleteAssignmentModal({ id, title, emit }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const assignmentMutation = api.assignment.adminDeleteAssignment.useMutation();
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const deleteAssignment = async () => {
    setLoading(true);
    try {
      const result = await assignmentMutation.mutateAsync({ assignmentId: id });
      toast({
        title: 'Success',
        description: result.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      emit(true);
      onClose();
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
    <Flex>
      <Button onClick={onOpen}>Delete</Button>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'} isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Delete {title}</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this assignment?</Text>
          </ModalBody>

          <ModalFooter columnGap={4}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type='button'
              variant={'outline'}
              onClick={() => void deleteAssignment()}
              isLoading={loading}
              loadingText='Deleting...'
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
