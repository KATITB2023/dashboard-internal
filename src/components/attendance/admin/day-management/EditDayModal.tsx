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
  Tr,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { AttendanceDay } from '@prisma/client';
import { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { DateInput } from '~/components/DateInput';
import { api } from '~/utils/api';
import { DeleteDayConfirmationModal } from './DeleteDayConfirmationModay';

interface AddDayModalProps {
  dayData: AttendanceDay;
  editDay: (dayName: string, dayDate: Date) => void;
  deleteDay: (dayId: string) => void;
}

export const EditDayModal = ({
  dayData,
  editDay,
  deleteDay
}: AddDayModalProps) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [dayNameInput, setDayNameInput] = useState<string>(dayData.name);
  const [dayDateInput, setDayDateInput] = useState<Date | undefined>(
    dayData.time
  );

  const dayNameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDayNameInput(e.target.value);
  };

  const addDayClickHandler = () => {
    if (!dayNameInput) {
      toast({
        title: 'Nama Day tidak boleh kosong',
        status: 'error',
        duration: 3000
      });
      return;
    }

    if (!dayDateInput) {
      toast({
        title: 'Tanggal tidak boleh kosong',
        status: 'error',
        duration: 3000
      });
      return;
    }

    editDay(dayNameInput, dayDateInput);
  };

  return (
    <>
      {' '}
      <Button onClick={onOpen} bg='none'>
        <MdEdit fontSize='2em' />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Day</ModalHeader>
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
                        color='white'
                      />
                    </Td>
                  </Tr>
                  <Tr>
                    <Td w='5em'>
                      <Text>Tanggal</Text>
                    </Td>
                    <Td>
                      <DateInput
                        dateState={dayDateInput}
                        setDateState={setDayDateInput}
                        w='min(10em,95%)'
                      />
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <DeleteDayConfirmationModal
              dayId={dayData.id}
              deleteDay={deleteDay}
            />
            <Button variant='mono' onClick={addDayClickHandler}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
