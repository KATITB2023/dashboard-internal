import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { api } from '~/utils/api';

interface DeleteDayConfirmationModalProps {
  dayId: string;
  deleteDay: (dayId: string) => void;
}

export const DeleteDayConfirmationModal = ({
  dayId,
  deleteDay
}: DeleteDayConfirmationModalProps) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [confirmationString, setConfirmationString] = useState<string>('');

  const deleteDayClickHandler = () => {
    if (confirmationString !== 'HAPUS DAY') {
      toast({
        title: 'Konfirmasi salah',
        status: 'error',
        duration: 2000
      });
      return;
    }

    deleteDay(dayId);
  };

  return (
    <>
      <Button variant='mono' onClick={onOpen} color='salmon'>
        Hapus Day
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hapus Day</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir='column'>
              <Text>
                Apakah anda yakin ingin menghapus Day ini?
                <br />
                Ketik &quot;HAPUS DAY&quot; jika anda yakin
              </Text>
              <Input
                value={confirmationString}
                onChange={(e) => setConfirmationString(e.target.value)}
                mt='1em'
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='mono'
              onClick={deleteDayClickHandler}
              color='salmon'
            >
              Hapus Day
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
