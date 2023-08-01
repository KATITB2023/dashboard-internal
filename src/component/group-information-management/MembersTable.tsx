import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Flex,
  Text
} from '@chakra-ui/react';
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import Tooltip from './Tooltip';
import type { Member } from '~/component/group-information-management/dummyData';

interface CellIdentifier {
  rowIndex: number;
  columnIndex: number;
}

enum TooltipType {
  Task,
  Attendance
}

const MembersTable: React.FC<{ members: Member[] }> = ({ members }) => {
  const [tooltipType, setTooltipType] = useState<TooltipType | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<CellIdentifier | null>(
    null
  );

  const toggleTooltip = (identifier: CellIdentifier, type: TooltipType) => {
    if (
      tooltipPosition &&
      tooltipPosition.rowIndex === identifier.rowIndex &&
      tooltipPosition.columnIndex === identifier.columnIndex
    ) {
      setTooltipType(null);
      setTooltipPosition(null);
    } else {
      setTooltipType(type);
      setTooltipPosition(identifier);
    }
  };

  // Warna task and attendance
  const getTextColor = (percentage: number): string => {
    if (percentage >= 100) {
      return '#278A43DE';
    } else if (percentage >= 50) {
      return '#CD7626DE';
    } else {
      return '#DE4545DE';
    }
  };

  const getTooltipContent = (member: Member): ReactNode[] => {
    if (tooltipType === TooltipType.Task) {
      return member.task.map((task, index) => (
        <Flex key={index} alignItems='center'>
          {task.done ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 128 128'
              fill='#4909B3'
              width='24px'
              height='24px'
            >
              <path d='M 64 6 C 32 6 6 32 6 64 C 6 96 32 122 64 122 C 96 122 122 96 122 64 C 122 32 96 6 64 6 z M 64 12 C 92.7 12 116 35.3 116 64 C 116 92.7 92.7 116 64 116 C 35.3 116 12 92.7 12 64 C 12 35.3 35.3 12 64 12 z M 85.037109 48.949219 C 84.274609 48.974219 83.500391 49.300391 82.900391 49.900391 L 62 71.599609 L 51.099609 59.900391 C 49.999609 58.700391 48.100391 58.599219 46.900391 59.699219 C 45.700391 60.799219 45.599219 62.700391 46.699219 63.900391 L 59.800781 78 C 60.400781 78.6 61.1 79 62 79 C 62.8 79 63.599219 78.699609 64.199219 78.099609 L 87.199219 54 C 88.299219 52.8 88.299609 50.900781 87.099609 49.800781 C 86.549609 49.200781 85.799609 48.924219 85.037109 48.949219 z' />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 128 128'
              fill='#9B9B9B'
              width='24px'
              height='24px'
            >
              <path d='M 64 6 C 32 6 6 32 6 64 C 6 96 32 122 64 122 C 96 122 122 96 122 64 C 122 32 96 6 64 6 z M 64 12 C 92.7 12 116 35.3 116 64 C 116 92.7 92.7 116 64 116 C 35.3 116 12 92.7 12 64 C 12 35.3 35.3 12 64 12 z M 85.037109 48.949219 C 84.274609 48.974219 83.500391 49.300391 82.900391 49.900391 L 62 71.599609 L 51.099609 59.900391 C 49.999609 58.700391 48.100391 58.599219 46.900391 59.699219 C 45.700391 60.799219 45.599219 62.700391 46.699219 63.900391 L 59.800781 78 C 60.400781 78.6 61.1 79 62 79 C 62.8 79 63.599219 78.699609 64.199219 78.099609 L 87.199219 54 C 88.299219 52.8 88.299609 50.900781 87.099609 49.800781 C 86.549609 49.200781 85.799609 48.924219 85.037109 48.949219 z' />
            </svg>
          )}
          <Text
            textAlign='center'
            textDecoration={task.done ? 'line-through' : undefined}
          >
            {`Task ${index + 1}`}
          </Text>
        </Flex>
      ));
    } else if (tooltipType === TooltipType.Attendance) {
      return member.attendance.map((attendance, index) => (
        <Flex key={index} alignItems='center'>
          {attendance.attended ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 128 128'
              fill='#4909B3'
              width='24px'
              height='24px'
            >
              <path d='M 64 6 C 32 6 6 32 6 64 C 6 96 32 122 64 122 C 96 122 122 96 122 64 C 122 32 96 6 64 6 z M 64 12 C 92.7 12 116 35.3 116 64 C 116 92.7 92.7 116 64 116 C 35.3 116 12 92.7 12 64 C 12 35.3 35.3 12 64 12 z M 85.037109 48.949219 C 84.274609 48.974219 83.500391 49.300391 82.900391 49.900391 L 62 71.599609 L 51.099609 59.900391 C 49.999609 58.700391 48.100391 58.599219 46.900391 59.699219 C 45.700391 60.799219 45.599219 62.700391 46.699219 63.900391 L 59.800781 78 C 60.400781 78.6 61.1 79 62 79 C 62.8 79 63.599219 78.699609 64.199219 78.099609 L 87.199219 54 C 88.299219 52.8 88.299609 50.900781 87.099609 49.800781 C 86.549609 49.200781 85.799609 48.924219 85.037109 48.949219 z' />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 128 128'
              fill='#9B9B9B'
              width='24px'
              height='24px'
            >
              <path d='M 64 6 C 32 6 6 32 6 64 C 6 96 32 122 64 122 C 96 122 122 96 122 64 C 122 32 96 6 64 6 z M 64 12 C 92.7 12 116 35.3 116 64 C 116 92.7 92.7 116 64 116 C 35.3 116 12 92.7 12 64 C 12 35.3 35.3 12 64 12 z M 85.037109 48.949219 C 84.274609 48.974219 83.500391 49.300391 82.900391 49.900391 L 62 71.599609 L 51.099609 59.900391 C 49.999609 58.700391 48.100391 58.599219 46.900391 59.699219 C 45.700391 60.799219 45.599219 62.700391 46.699219 63.900391 L 59.800781 78 C 60.400781 78.6 61.1 79 62 79 C 62.8 79 63.599219 78.699609 64.199219 78.099609 L 87.199219 54 C 88.299219 52.8 88.299609 50.900781 87.099609 49.800781 C 86.549609 49.200781 85.799609 48.924219 85.037109 48.949219 z' />
            </svg>
          )}
          <Text
            textAlign='center'
            textDecoration={attendance.attended ? 'line-through' : undefined}
          >
            {`Attend ${index + 1}`}
          </Text>
        </Flex>
      ));
    }
    return [];
  };

  return (
    <Container
      border='5px solid black'
      borderRadius='20px'
      minWidth='full'
      height='100%'
      px={0}
      overflowX={{ base: 'scroll', lg: 'visible' }}
    >
      <Table variant='simple' bg='black' color='white'>
        <Thead>
          <Tr bg='black'>
            <Th
              fontFamily='SomarRounded-Regular'
              fontSize='16px'
              textAlign='center'
              color='white'
              textTransform='capitalize'
            >
              No
            </Th>
            <Th
              fontFamily='SomarRounded-Regular'
              fontSize='16px'
              textAlign='center'
              color='white'
              textTransform='capitalize'
            >
              NIM
            </Th>
            <Th
              fontFamily='SomarRounded-Regular'
              fontSize='16px'
              textAlign='center'
              color='white'
              textTransform='capitalize'
            >
              Nama
            </Th>
            <Th
              fontFamily='SomarRounded-Regular'
              fontSize='16px'
              textAlign='center'
              color='white'
              textTransform='capitalize'
            >
              Fakultas
            </Th>
            <Th
              fontFamily='SomarRounded-Regular'
              fontSize='16px'
              textAlign='center'
              color='white'
              textTransform='capitalize'
            >
              Kampus
            </Th>
            <Th
              fontFamily='SomarRounded-Regular'
              fontSize='16px'
              textAlign='center'
              color='white'
              textTransform='capitalize'
            >
              Tugas
            </Th>
            <Th
              fontFamily='SomarRounded-Regular'
              fontSize='16px'
              textAlign='center'
              color='white'
              textTransform='capitalize'
            >
              Absensi
            </Th>
          </Tr>
        </Thead>
        <Tbody fontSize={16}>
          {members.map((member, rowIndex) => (
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
                  position='relative'
                >
                  <Text
                    color={getTextColor(
                      (member.task.filter((task) => task.done).length /
                        member.task.length) *
                        100
                    )}
                  >
                    {`${member.task.filter((task) => task.done).length}/${
                      member.task.length
                    }`}
                  </Text>
                  <Image
                    src='/images/see.png'
                    alt='see'
                    cursor='pointer'
                    onClick={() =>
                      toggleTooltip(
                        { rowIndex, columnIndex: 5 },
                        TooltipType.Task
                      )
                    }
                  />
                  {tooltipPosition &&
                    tooltipPosition.rowIndex === rowIndex &&
                    tooltipPosition.columnIndex === 5 &&
                    tooltipType === TooltipType.Task && (
                      <Tooltip content={getTooltipContent(member)} />
                    )}
                </Flex>
              </Td>
              <Td borderColor='black' borderWidth='1px'>
                <Flex
                  width='full'
                  alignItems='center'
                  justifyContent='space-evenly'
                  position='relative'
                >
                  <Text
                    color={getTextColor(
                      Math.floor(
                        (member.attendance.filter(
                          (attendance) => attendance.attended
                        ).length /
                          member.attendance.length) *
                          100
                      )
                    )}
                  >
                    {`${Math.floor(
                      (member.attendance.filter(
                        (attendance) => attendance.attended
                      ).length /
                        member.attendance.length) *
                        100
                    )}%`}
                  </Text>
                  <Image
                    src='/images/see.png'
                    alt='see'
                    cursor='pointer'
                    onClick={() =>
                      toggleTooltip(
                        { rowIndex, columnIndex: 6 },
                        TooltipType.Attendance
                      )
                    }
                  />
                  {tooltipPosition &&
                    tooltipPosition.rowIndex === rowIndex &&
                    tooltipPosition.columnIndex === 6 &&
                    tooltipType === TooltipType.Attendance && (
                      <Tooltip content={getTooltipContent(member)} />
                    )}
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default MembersTable;
