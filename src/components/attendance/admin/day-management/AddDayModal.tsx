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
import { useState } from 'react';
import { DateInput } from '~/components/DateInput';
import { api } from '~/utils/api';

interface AddDayModalProps {
  addDay: (dayName: string, dayDate: Date, thenFn: () => void) => void;
}

export const AddDayModal = ({ addDay }: AddDayModalProps) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const addDayMutation = api.attendance.adminAddAttendanceDay.useMutation();

  const [dayNameInput, setDayNameInput] = useState<string>();
  const [dayDateInput, setDayDateInput] = useState<Date>();

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

    addDay(dayNameInput, dayDateInput, () => onClose());
  };
  return (
    <>
      <Button variant='mono-black' onClick={onOpen}>
        Tambah Day
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Day</ModalHeader>
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
            <Button variant='mono-outline' onClick={addDayClickHandler}>
              Tambah
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
