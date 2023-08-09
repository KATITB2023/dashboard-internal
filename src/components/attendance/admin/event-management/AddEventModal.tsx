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
  Select,
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
import { DateInput } from '~/components/DateInput';
import { TimeInput } from '~/components/TimeInput';
import { api } from '~/utils/api';

interface AddDayModalProps {
  addEvent: (
    EventName: string,
    EventStartTime: [number, number],
    EventEndTime: [number, number]
  ) => void;
  day: AttendanceDay;
}

export const AddEventModal = ({ addEvent, day }: AddDayModalProps) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [eventNameInput, setEventNameInput] = useState<string>();
  const [eventStartTimeInput, setEventStartTimeInput] = useState<
    [number, number]
  >([0, 0]);
  const [eventEndTimeInput, setEventEndTimeInput] = useState<[number, number]>([
    0, 0
  ]);

  const eventNameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventNameInput(e.target.value);
  };
  const addEventClickHandler = () => {
    if (!eventNameInput) {
      toast({
        title: 'Nama Event tidak boleh kosong',
        status: 'error',
        duration: 3000
      });
      return;
    }

    if (!eventStartTimeInput) {
      toast({
        title: 'Waktu mulai tidak boleh kosong',
        status: 'error',
        duration: 3000
      });
      return;
    }

    if (!eventEndTimeInput) {
      toast({
        title: 'Waktu selesai tidak boleh kosong',
        status: 'error',
        duration: 3000
      });
      return;
    }

    if (
      eventStartTimeInput[0] * 60 + eventStartTimeInput[1] >
      eventEndTimeInput[0] * 60 + eventEndTimeInput[1]
    ) {
      toast({
        title: 'Waktu mulai tidak boleh melebihi waktu selesai',
        status: 'error',
        duration: 3000
      });
      return;
    }

    addEvent(eventNameInput, eventStartTimeInput, eventEndTimeInput);
    onClose();
  };

  return (
    <>
      <Button
        variant='mono-outline'
        onClick={onOpen}
        mt={{ base: 'none', lg: '1em' }}
        w={{ base: '100%', lg: '8em' }}
        h='2em'
      >
        Tambah Event
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Event</ModalHeader>
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
                        placeholder='Nama Event'
                        value={eventNameInput}
                        onChange={eventNameChangeHandler}
                        w='min(10em,95%)'
                        color='white'
                      />
                    </Td>
                  </Tr>
                  <Tr>
                    <Td w='5em'>
                      <Text>Day</Text>
                    </Td>
                    <Td>
                      <Text>{day.name}</Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td w='5em'>
                      <Text>Waktu Mulai</Text>
                    </Td>
                    <Td>
                      <TimeInput
                        timeState={eventStartTimeInput}
                        setTimeState={setEventStartTimeInput}
                        w='min(10em,95%)'
                      />
                    </Td>
                  </Tr>
                  <Tr>
                    <Td w='5em'>
                      <Text>Waktu Selesai</Text>
                    </Td>
                    <Td>
                      <TimeInput
                        timeState={eventEndTimeInput}
                        setTimeState={setEventEndTimeInput}
                        w='min(10em,95%)'
                      />
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant='mono-outline' onClick={addEventClickHandler}>
              Tambah
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
