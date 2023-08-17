import {
  Box,
  Flex,
  Text,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Avatar,
  Container,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Header } from '~/components/Header';
import { RiArrowDownSLine } from 'react-icons/ri';
import Layout from '~/layout/index';
import { api } from '~/utils/api';
import { FaEye } from 'react-icons/fa';
import Tooltip from '~/components/group-information-management/Tooltip';
import { BsCheckCircle } from 'react-icons/bs';
import AdminRoute from '~/layout/AdminRoute';
import { useSession } from 'next-auth/react';
import { withSession } from '~/server/auth/withSession';

interface CellIdentifier {
  rowIndex: number;
  columnIndex: number;
}

interface AttendanceProps {
  [key: string]: string;
}

export const getServerSideProps = withSession({ force: true });

export default function GroupInformation() {
  const { data: session } = useSession();
  // Mengambil data id kelompok

  const [assignmentMenteeId, setAssignmentMenteeId] = useState<string>('');
  const [attendanceMenteeId, setAttendanceMenteeId] = useState<string>('');
  // Untuk dropdown
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const [groupNumber, setGroupNumber] = useState<number>(1);

  // Mengambil data tiap kelompok
  const groupListQuery = api.group.adminGetGroupList.useQuery();
  const groupList = groupListQuery.data;
  const groupDataQuery = api.group.adminGetGroupData.useQuery({
    groupId: selectedOption || ''
  });
  const groupData = groupDataQuery.data;

  const assignmentQuery =
    api.assignment.mentorGetAssignmentTitleList.useQuery();
  const assignmentList = assignmentQuery.data || [];
  const menteeAssignmentQuery = api.group.getMenteeAssignment.useQuery({
    menteeId: assignmentMenteeId
  });
  const menteeAssignment = menteeAssignmentQuery.data || [];

  const eventQuery = api.attendance.getOnlyEventList.useQuery();
  const eventList = eventQuery.data || [];
  const menteeAttendanceQuery = api.group.getMenteeAttendance.useQuery({
    menteeId: attendanceMenteeId
  });
  const menteeAttendance = menteeAttendanceQuery.data || [];

  // Tooltip
  const [tooltipPosition, setTooltipPosition] = useState<CellIdentifier | null>(
    null
  );

  const submissionTooltip = () => {
    const allAssignmentTitles: string[] = assignmentList?.map(
      (assignment) => assignment.title
    );
    const studentAssignmentTitles: string[] = menteeAssignment?.map(
      (submission) => submission.assignment.title
    );
    return allAssignmentTitles.map((title, index) => {
      const isCompleted = studentAssignmentTitles?.includes(title);

      return (
        <Flex key={index} alignItems='center'>
          {isCompleted ? (
            <BsCheckCircle size={24} color='#4909B3' />
          ) : (
            <BsCheckCircle size={24} color='#9B9B9B' />
          )}
          <Text
            textAlign='center'
            textDecoration={isCompleted ? 'line-through' : undefined}
            marginLeft='2px'
          >
            {allAssignmentTitles[index]}
          </Text>
        </Flex>
      );
    });
  };

  const attendanceTooltip = () => {
    const allEvent: string[] = eventList?.map((event) => event.title);
    const studentAttendance: AttendanceProps = {};
    menteeAttendance?.forEach((attendance) => {
      studentAttendance[attendance.event.title] = attendance.status;
    });

    return allEvent.map((title, index) => {
      const isAttended = studentAttendance[title] === 'HADIR';
      return (
        <Flex key={index} alignItems='center'>
          {isAttended ? (
            <BsCheckCircle size={24} color='#4909B3' />
          ) : (
            <BsCheckCircle size={24} color='#9B9B9B' />
          )}
          <Text
            textAlign='center'
            textDecoration={isAttended ? 'line-through' : undefined}
            marginLeft='2px'
          >
            {allEvent[index]}
          </Text>
        </Flex>
      );
    });
  };

  const handleOptionSelect = (option: string, groupNumber: number) => {
    setSelectedOption(option);
    setGroupNumber(groupNumber);
  };
  const toggleTooltip = (identifier: CellIdentifier) => {
    if (
      tooltipPosition &&
      tooltipPosition.rowIndex === identifier.rowIndex &&
      tooltipPosition.columnIndex === identifier.columnIndex
    ) {
      setTooltipPosition(null);
    } else {
      setTooltipPosition(identifier);
    }
  };
  useEffect(() => {
    if (groupList && groupList.length > 0) {
      const firstGroupId = groupList[0]?.id;
      setSelectedOption(firstGroupId);
    }
  }, [groupList]);

  return (
    <AdminRoute session={session}>
      <Layout type='admin' title='Group Information' fullBg={false}>
        <Box height='100%' p={1}>
          {/* Logo and dropdown, flex display  */}
          <Flex
            justifyContent='space-between'
            alignItems='center'
            flexDirection={{ base: 'column', xl: 'row' }}
          >
            {/* Logo */}
            <Header title='Group Information' />

            {/* Dropdown */}
            <Box
              width='auto'
              bgImage='/images/comet_container.png'
              backgroundSize='cover'
              borderRadius='25px'
            >
              <Menu>
                <MenuButton
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Flex
                    p={3}
                    justifyContent='space-between'
                    alignItems='center'
                    height='100%'
                    cursor='pointer'
                    color='white'
                  >
                    <Avatar name={groupNumber.toString()} />
                    <Text
                      fontWeight='bold'
                      fontSize={{ base: '16px', lg: '24px' }}
                      marginX={{ base: '10px', lg: '30px' }}
                    >
                      Kelompok {groupNumber}
                    </Text>
                    <RiArrowDownSLine size={24} />
                  </Flex>
                </MenuButton>
                <MenuList bg='black' borderColor='black' width='full'>
                  {groupList?.map((groupList) => (
                    <MenuItem
                      key={groupList.group}
                      minHeight='20px'
                      bg='black'
                      color='white'
                      onClick={() =>
                        handleOptionSelect(groupList.id, groupList.group)
                      }
                      _hover={{
                        bg: '#4909B3'
                      }}
                    >
                      Kelompok {groupList.group}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
          </Flex>

          <br />
          {/* Mentor boxes*/}
          <Box mt={4}>
            <Text color='black' fontWeight='700' fontSize='20px'>
              Mentor:
            </Text>
            <Flex justifyContent='space-between' flexWrap='wrap' rowGap={4}>
              {groupData
                ?.filter((groupData) => groupData.user.role === 'MENTOR')
                .map((groupData, id) => (
                  <Flex
                    key={id}
                    width='480px'
                    minW='200px'
                    bg='#0B0A0A'
                    p={4}
                    borderRadius='25px'
                    boxShadow='0 3px 15px -3px #FFFC83'
                    color='white'
                    alignItems='center'
                  >
                    <Avatar name={groupData.user.profile?.name} mr={4} />
                    <Flex flexDirection='column' justifyContent='center'>
                      <Text fontSize='16px' fontWeight='700'>
                        {groupData.user.profile?.name}
                      </Text>
                      <Text fontSize='14px' fontWeight='400'>
                        {groupData.user.nim}
                      </Text>
                      <Text fontSize='14px' fontWeight='400'>
                        {groupData.user.profile?.faculty}
                      </Text>
                    </Flex>
                  </Flex>
                ))}
            </Flex>
          </Box>

          {/* Members table */}
          <Box mt={4}>
            <Text color='black' fontWeight='700' fontSize='20px'>
              Anggota:
            </Text>

            <Container minWidth='full' height='100%' px={0} pb={5}>
              <Table variant='black'>
                <Thead>
                  <Tr>
                    <Th>No</Th>
                    <Th>NIM</Th>
                    <Th>Nama</Th>
                    <Th>Fakultas</Th>
                    <Th>Kampus</Th>
                    <Th>Tugas</Th>
                    <Th>Absensi</Th>
                  </Tr>
                </Thead>
                <Tbody fontSize={16}>
                  {groupData
                    ?.filter((groupData) => groupData.user.role === 'STUDENT')
                    .map((groupData, id) => {
                      return (
                        <Tr bg='white' color='#2D3648DE' key={id}>
                          <Td borderColor='black' borderWidth='1px'>
                            {id + 1}
                          </Td>
                          <Td borderColor='black' borderWidth='1px'>
                            {groupData.user.nim}
                          </Td>
                          <Td borderColor='black' borderWidth='1px'>
                            {groupData.user.profile?.name}
                          </Td>
                          <Td borderColor='black' borderWidth='1px'>
                            {groupData.user.profile?.faculty}
                          </Td>
                          <Td borderColor='black' borderWidth='1px'>
                            {groupData.user.profile?.campus}
                          </Td>
                          <Td borderColor='black' borderWidth='1px'>
                            <Flex
                              width='full'
                              alignItems='center'
                              justifyContent='space-evenly'
                              position='relative'
                            >
                              <FaEye
                                size={24}
                                color='#4b19a7'
                                cursor='pointer'
                                onClick={() => {
                                  toggleTooltip({
                                    rowIndex: id,
                                    columnIndex: 5
                                  });
                                  setAssignmentMenteeId(groupData.userId);
                                }}
                              />
                              {tooltipPosition &&
                                tooltipPosition.rowIndex === id &&
                                tooltipPosition.columnIndex === 5 && (
                                  <Tooltip content={submissionTooltip()} />
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
                              <FaEye
                                size={24}
                                color='#4b19a7'
                                cursor='pointer'
                                onClick={() => {
                                  toggleTooltip({
                                    rowIndex: id,
                                    columnIndex: 6
                                  });
                                  setAttendanceMenteeId(groupData.userId);
                                }}
                              />
                              {tooltipPosition &&
                                tooltipPosition.rowIndex === id &&
                                tooltipPosition.columnIndex === 6 && (
                                  <Tooltip content={attendanceTooltip()} />
                                )}
                            </Flex>
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </Container>
          </Box>
        </Box>
      </Layout>
    </AdminRoute>
  );
}
