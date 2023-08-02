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
import { AttendanceEvent } from '@prisma/client';
import { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { DateInput } from '~/components/DateInput';
import { TimeInput } from '~/components/TimeInput';
import { api } from '~/utils/api';

interface AddDayModalProps {
  event: AttendanceEvent;
  editEvent: (
    EventName: string,
    EventStartTime: [number, number],
    EventEndTime: [number, number]
  ) => void;
  deleteEvent: () => void;
}

export const EditEventModal = ({
  editEvent,
  deleteEvent,
  event
}: AddDayModalProps) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteEventDisclosure = useDisclosure();
  const addDayMutation = api.attendance.adminAddAttendanceDay.useMutation();

  const [eventNameInput, setEventNameInput] = useState<string>(event.title);
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
        title: 'Nama Day tidak boleh kosong',
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

    editEvent(eventNameInput, eventStartTimeInput, eventEndTimeInput);
    onClose();
  };

  return (
    <>
      <Button bg='none' onClick={onOpen}>
        <MdEdit fontSize='2rem' />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
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
              Simpan
            </Button>
            <Button
              variant='mono-outline'
              color='salmon'
              onClick={deleteEventDisclosure.onOpen}
              ml='1em'
            >
              Hapus Event
            </Button>
            <Modal
              isOpen={deleteEventDisclosure.isOpen}
              onClose={deleteEventDisclosure.onClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Hapus Event</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text>Apakah anda yakin ingin menghapus event ini?</Text>
                </ModalBody>
                <ModalFooter>
                  <Button variant='mono-outline' onClick={deleteEvent}>
                    Hapus
                  </Button>
                  <Button
                    variant='mono-outline'
                    onClick={deleteEventDisclosure.onClose}
                    ml='1em'
                  >
                    Batal
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
