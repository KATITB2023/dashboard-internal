import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { Status } from '@prisma/client';
import { useState } from 'react';
import { type RouterOutputs } from '~/utils/api';
import { EditDescModal } from './EditDescModal';

type getAttendanceRecordOutput =
  RouterOutputs['attendance']['adminGetAttendanceRecord']['data'][0];

interface StatusBoxProps {
  record: getAttendanceRecordOutput;
  editRecord: (
    record: getAttendanceRecordOutput,
    { newStatus, newDesc }: { newStatus: Status; newDesc: string },
    successFn: () => void
  ) => void;
}

export const StatusBox = ({ record, editRecord }: StatusBoxProps) => {
  const [status, setStatus] = useState<Status>(record.status);
  const modalDisclosure = useDisclosure();

  const editDesc = (desc: string) => {
    editRecord(record, { newStatus: status, newDesc: desc }, () =>
      modalDisclosure.onClose()
    );
  };

  const editRecordStatus = (status: Status) => {
    if (status == Status.HADIR) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      editRecord(record, { newStatus: status, newDesc: '' }, () => {});
      setStatus(status);
      return;
    }
    modalDisclosure.onOpen();
    setStatus(status);
  };

  const statusBoxMenu = (color: string, bg: string, text: string) => (
    <Menu>
      <MenuButton
        border='1px solid gray'
        borderRadius='2em'
        color={color}
        bg={bg}
        h='2.5em'
        w='12em'
        fontSize='xs'
      >
        {text}
      </MenuButton>
      <MenuList
        border='1px solid gray'
        p='1em'
        flexDir='column'
        display='flex'
        w='24em'
        justifyContent='center'
      >
        <Button
          border='1px solid gray'
          borderRadius='2em'
          color='green.100'
          h='2em'
          w='100%'
          bg='green.500'
          onClick={() => editRecordStatus(Status.HADIR)}
          mt='1em'
          _hover={{
            bg: 'green.600',
            shadow: '0 0 24px rgba(255,200,4,0.6)',
            _disabled: {
              bg: 'gray.400',
              shadow: 'none'
            }
          }}
        >
          Hadir
        </Button>
        <Flex justifyContent='center' mt='1em'>
          <Button
            border='1px solid gray'
            borderRadius='2em'
            w='12em'
            color='red.600'
            bg='red.100'
            h='2em'
            onClick={() => editRecordStatus(Status.TIDAK_HADIR)}
          >
            Tidak Hadir
          </Button>
          <Button
            border='1px solid gray'
            borderRadius='2em'
            w='12em'
            color='yellow.600'
            bg='yellow.100'
            h='2em'
            onClick={() => editRecordStatus(Status.IZIN_DITERIMA)}
            ml='1em'
          >
            Izin Diterima
          </Button>
        </Flex>
        <Flex justifyContent='center' mt='1em'>
          <Button
            border='1px solid gray'
            borderRadius='2em'
            w='12em'
            color='blue.600'
            bg='blue.100'
            h='2em'
            onClick={() => editRecordStatus(Status.IZIN_PENDING)}
          >
            Izin Pending
          </Button>
          <Button
            border='1px solid gray'
            borderRadius='2em'
            w='12em'
            color='gray.600'
            bg='gray.100'
            h='2em'
            onClick={() => editRecordStatus(Status.IZIN_DITOLAK)}
            ml='1em'
          >
            Izin Ditolak
          </Button>
        </Flex>
      </MenuList>
      <EditDescModal
        disclosure={modalDisclosure}
        editDesc={editDesc}
        record={record}
      />
    </Menu>
  );

  const generateBox: () => JSX.Element = () => {
    switch (record.status) {
      case Status.HADIR:
        return statusBoxMenu('green.100', 'green.500', 'Hadir');
      case Status.TIDAK_HADIR:
        return statusBoxMenu('red.600', 'red.100', 'Tidak Hadir');
      case Status.IZIN_PENDING:
        return statusBoxMenu('blue.600', 'blue.100', 'Izin Pending');
      case Status.IZIN_DITERIMA:
        return statusBoxMenu('yellow.600', 'yellow.100', 'Izin Diterima');
      case Status.IZIN_DITOLAK:
        return statusBoxMenu('gray.600', 'gray.100', 'Izin Ditolak');
      default:
        return <Text fontStyle='italic'> Terjadi Kesalahan</Text>;
    }
  };

  return generateBox();
};
