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
import { RouterOutputs, api } from '~/utils/api';
import { MdEdit } from 'react-icons/md';
import { EditDayModal } from './EditDayModal';
import { AddDayModal } from './AddDayModal';
import { AttendanceDay } from '@prisma/client';

interface DayManagementModalProps {
  dayList: AttendanceDay[];
  editDay: (dayId: string, name: string, date: Date) => void;
  addDay: (name: string, date: Date) => void;
  deleteDay: (dayId: string) => void;
}

export const DayManagementModal = ({
  dayList,
  editDay,
  addDay,
  deleteDay
}: DayManagementModalProps) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button variant='mono-gray' ml='1em' onClick={onOpen}>
        Manage Day
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
        <ModalOverlay />
        <ModalContent w='min(45em,95%)'>
          <ModalCloseButton />
          <ModalHeader>Day Management</ModalHeader>
          <ModalBody maxH='60vh' overflowY='scroll'>
            {dayList.length < 1 ? (
              <Text fontStyle='italic'>Belum ada day</Text>
            ) : (
              dayList.map((day, i) => {
                return (
                  <Flex
                    border='1px solid black'
                    boxShadow='1px 1px 3px 3px black'
                    w='100%'
                    borderRadius='10px'
                    justifyContent='space-between'
                    alignItems='center'
                    mt='1em'
                    px='1em'
                    py='0.5em'
                  >
                    <Text w='70%'>{day.name}</Text>
                    <Text w='20%'>{day.time.toISOString().split('T')[0]}</Text>
                    <EditDayModal
                      dayData={day}
                      editDay={(name: string, date: Date) =>
                        editDay(day.id, name, date)
                      }
                      deleteDay={deleteDay}
                    />
                  </Flex>
                );
              })
            )}
          </ModalBody>
          <ModalFooter>
            <AddDayModal addDay={addDay} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
