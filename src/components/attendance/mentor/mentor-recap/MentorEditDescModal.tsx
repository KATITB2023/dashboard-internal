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
import type { RecordProps } from './MentorRecap';

interface EditDescModalProps {
  record: RecordProps;
  editDesc: (newDesc: string) => Promise<void>;
  disclosure: ReturnType<typeof useDisclosure>;
}

export const MentorEditDescModal = ({
  editDesc,
  record,
  disclosure
}: EditDescModalProps) => {
  const toast = useToast();

  const [desc, setDesc] = useState<string>(
    record.attendance[0] ? (record.attendance[0]?.reason as string) : ''
  );
  const saveHandler = async () => {
    if (!desc) {
      toast({
        title: 'Keterangan tidak boleh kosong',
        status: 'error',
        duration: 3000
      });
      return;
    }

    await editDesc(desc);
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
              onClick={() => void saveHandler()}
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
