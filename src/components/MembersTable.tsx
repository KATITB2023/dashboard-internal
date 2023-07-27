import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Flex
} from '@chakra-ui/react';
import React from 'react';

interface Member {
  id: number;
  nim: string;
  name: string;
  faculty: string;
  campus: string;
  task: string;
  attendance: string;
}

const MembersTable: React.FC<{ members: Member[] }> = ({ members }) => {
  return (
    <Box bg='black' borderRadius='25px' color='black' overflowX='auto'>
      <Table variant='simple' bg='black' color='white' borderRadius='md'>
        <Thead>
          <Tr bg='black'>
            <Th textAlign='center' color='white'>
              No
            </Th>
            <Th textAlign='center' color='white'>
              NIM
            </Th>
            <Th textAlign='center' color='white'>
              Nama
            </Th>
            <Th textAlign='center' color='white'>
              Fakultas
            </Th>
            <Th textAlign='center' color='white'>
              Kampus
            </Th>
            <Th textAlign='center' color='white'>
              Tugas
            </Th>
            <Th textAlign='center' color='white'>
              Absensi
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {members.map((member) => (
            <Tr bg='white' color='#2D3648DE' key={member.id}>
              <Td borderColor='black' borderWidth='1px'>
                {member.id}
              </Td>
              <Td borderColor='black' borderWidth='1px'>
                {member.nim}
              </Td>
              <Td borderColor='black' borderWidth='1px'>
                {member.name}
              </Td>
              <Td borderColor='black' borderWidth='1px'>
                {member.faculty}
              </Td>
              <Td borderColor='black' borderWidth='1px'>
                {member.campus}
              </Td>
              <Td borderColor='black' borderWidth='1px'>
                <Flex
                  width='full'
                  alignItems='center'
                  justifyContent='space-evenly'
                >
                  {member.task}
                  <Image src='/images/see.png' alt='see' />
                </Flex>
              </Td>
              <Td borderColor='black' borderWidth='1px'>
                <Flex
                  width='full'
                  alignItems='center'
                  justifyContent='space-evenly'
                >
                  {member.attendance}
                  <Image src='/images/see.png' alt='see' />
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default MembersTable;
