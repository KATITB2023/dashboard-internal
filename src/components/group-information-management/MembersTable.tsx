import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text
} from '@chakra-ui/react';
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import Tooltip from './Tooltip';
import type { Member } from '~/components/group-information-management/dummyData';
import { BsCheckCircle } from 'react-icons/bs';
import { FaEye } from 'react-icons/fa';

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
            <BsCheckCircle size={24} color='#4909B3' />
          ) : (
            <BsCheckCircle size={24} color='#9B9B9B' />
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
            <BsCheckCircle size={24} color='#4909B3' />
          ) : (
            <BsCheckCircle size={24} color='#9B9B9B' />
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
                  <FaEye
                    size={24}
                    color='#4b19a7'
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
                  <FaEye
                    size={24}
                    color='#4b19a7'
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
