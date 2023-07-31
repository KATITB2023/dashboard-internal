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
  Table,
  Tbody,
  Td,
  Text,
  Tr
} from '@chakra-ui/react';
import { useState } from 'react';
import { api } from '~/utils/api';

interface AddDayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDayModal = ({ isOpen, onClose }: AddDayModalProps) => {
  const addDayMutation = api.attendance.adminAddAttendanceDay.useMutation();

  const [dayNameInput, setDayNameInput] = useState<string>();
  const [dayDateInput, setDayDateInput] = useState<Date>();

  const dayNameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDayNameInput(e.target.value);
  };

  const dayDateChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDayDateInput(new Date(e.target.value));
  };

  const addDayClickHandler = () => {
    if (!dayNameInput || !dayDateInput) {
      return;
    }

    addDayMutation.mutate({
      name: dayNameInput,
      time: new Date(dayDateInput)
    });
  };

  console.log(isOpen);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tambah Hari</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDir='column' w='100%'>
            <Table w='100%'>
              <Tbody>
                <Tr>
                  <Td border='none' w='5em'>
                    <Text>Nama</Text>
                  </Td>
                  <Td>
                    <Input
                      placeholder='Nama Day'
                      value={dayNameInput}
                      onChange={dayNameChangeHandler}
                      w='min(10em,95%)'
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td w='5em'>
                    <Text>Tanggal</Text>
                  </Td>
                  <Td>
                    <Input
                      type='date'
                      value={dayDateInput?.toTimeString()}
                      onChange={dayDateChangeHandler}
                      w='min(10em,95%)'
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
