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
  type useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { type RouterOutputs } from '~/utils/api';

type getAttendanceRecordOutput =
  RouterOutputs['attendance']['mentorGetAttendance']['data'][0];

interface EditDescModalProps {
  record: getAttendanceRecordOutput;
  editDesc: (newDesc: string) => void;
  disclosure: ReturnType<typeof useDisclosure>;
}

export const MentorEditDescModal = ({
  editDesc,
  record,
  disclosure
}: EditDescModalProps) => {
  const toast = useToast();

  const [desc, setDesc] = useState<string>(record.reason || '');
  const saveHandler = () => {
    if (!desc) {
      toast({
        title: 'Keterangan tidak boleh kosong',
        status: 'error',
        duration: 3000
      });
      return;
    }
    editDesc(desc);
    disclosure.onClose();
  };

  const descChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesc(e.target.value);
  };

  return (
    <>
      <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Masukkan Keterangan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir='column' w='100%'>
              <Input value={desc} onChange={descChangeHandler} />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='mono-outline'
              color='green'
              border='green'
              onClick={saveHandler}
            >
              Simpan
            </Button>
            <Button
              variant='mono-outline'
              onClick={disclosure.onClose}
              ml='1em'
            >
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
