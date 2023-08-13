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

export const getServerSideProps = withSession({ force: true });

export default function GroupInformation() {
  const { data: session } = useSession();
  // Mengambil data id kelompok
  const groupListQuery = api.group.adminGetGroupList.useQuery();
  const groupList = groupListQuery.data;
  console.log(groupList);

  // Mengambil assignment
  const assignmentQuery =
    api.assignment.mentorGetAssignmentTitleList.useQuery();
  const assignment = assignmentQuery.data;

  // Untuk dropdown
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const [groupNumber, setGroupNumber] = useState<number>(1);

  useEffect(() => {
    if (groupList && groupList.length > 0) {
      const firstGroupId = groupList[0]?.id;
      setSelectedOption(firstGroupId);
    }
  }, [groupList]);

  const handleOptionSelect = (option: string, groupNumber: number) => {
    setSelectedOption(option);
    setGroupNumber(groupNumber);
  };

  // Mengambil data tiap kelompok
  const groupDataQuery = api.group.adminGetGroupData.useQuery({
    groupId: selectedOption || ''
  });
  const groupData = groupDataQuery.data;

  // Warna teks
  const getTextColor = (percentage: number): string => {
    if (percentage >= 100) {
      return '#278A43DE';
    } else if (percentage >= 50) {
      return '#CD7626DE';
    } else {
      return '#DE4545DE';
    }
  };

  // Tooltip
  const [tooltipPosition, setTooltipPosition] = useState<CellIdentifier | null>(
    null
  );

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
              height='96px'
              bgImage='/images/comet_container.png'
              backgroundSize='cover'
              borderRadius='25px'
            >
              <Menu>
                <Flex
                  p={3}
                  justifyContent='space-between'
                  alignItems='center'
                  height='100%'
                  cursor='pointer'
                  color='white'
                >
                  <Avatar name={groupNumber.toString()} boxSize='70px' mr={4} />
                  <Text fontWeight='bold' fontSize='24px' marginX='30px'>
                    Kelompok {groupNumber}
                  </Text>
                  <MenuButton
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <RiArrowDownSLine size={24} />
                  </MenuButton>
                </Flex>
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
                    <Avatar
                      name={groupData.user.profile?.name}
                      boxSize='70px'
                      mr={4}
                    />
                    <Flex
                      flexDirection='column'
                      height='74px'
                      justifyContent='center'
                    >
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

            <Container
              minWidth='full'
              height='100%'
              px={0}
              overflowX={{ base: 'scroll', lg: 'visible' }}
            >
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
                      // submisi Tugas
                      const totalAssignment = assignment?.length; // Banyak total assignment
                      const allAssignmentTitles: string[] = assignment?.map(
                        (assignment) => assignment.title
                      ); // Mengambil array judul assignment
                      const studentAssignmentTitles: string[] =
                        groupData.user.submission.map(
                          (submission) => submission.assignment.title
                        ); // Mengambil array judul assignment yang sudah dikerjakan
                      const completedAssignment =
                        groupData.user.submission.length;
                      const assignmentPercentage = (
                        (completedAssignment / totalAssignment) *
                        100
                      ).toFixed(2);

                      // presensi
                      const attendanceArray = groupData.user.attendance;
                      const totalAttendance = attendanceArray.length;
                      const attendedCount = attendanceArray.filter(
                        (item) => item.status === 'HADIR'
                      ).length;
                      const attendancePercentage = (
                        (attendedCount / totalAttendance) *
                        100
                      ).toFixed(2);

                      // Tooltip content
                      const submissionTooltip = () => {
                        return allAssignmentTitles.map((title, index) => {
                          const isCompleted =
                            studentAssignmentTitles.includes(title);

                          return (
                            <Flex key={index} alignItems='center'>
                              {isCompleted ? (
                                <BsCheckCircle size={24} color='#4909B3' />
                              ) : (
                                <BsCheckCircle size={24} color='#9B9B9B' />
                              )}
                              <Text
                                textAlign='center'
                                textDecoration={
                                  isCompleted ? 'line-through' : undefined
                                }
                                marginLeft='2px'
                              >
                                {allAssignmentTitles[index]}
                              </Text>
                            </Flex>
                          );
                        });
                      };

                      const attendanceTooltip = () => {
                        return groupData.user.attendance.map(
                          (attendance, index) => (
                            <Flex key={index} alignItems='center'>
                              {attendance.status === 'HADIR' ? (
                                <BsCheckCircle size={24} color='#4909B3' />
                              ) : (
                                <BsCheckCircle size={24} color='#9B9B9B' />
                              )}
                              <Text
                                textAlign='center'
                                textDecoration={
                                  attendance.status === 'HADIR'
                                    ? 'line-through'
                                    : undefined
                                }
                                marginLeft='2px'
                              >
                                {`Event ${index + 1}`}
                              </Text>
                            </Flex>
                          )
                        );
                      };

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
                              <Text color={getTextColor(assignmentPercentage)}>
                                {`${completedAssignment} / ${totalAssignment}`}
                              </Text>
                              <FaEye
                                size={24}
                                color='#4b19a7'
                                cursor='pointer'
                                onClick={() =>
                                  toggleTooltip({
                                    rowIndex: id,
                                    columnIndex: 5
                                  })
                                }
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
                              <Text color={getTextColor(attendancePercentage)}>
                                {`${attendancePercentage}%`}
                              </Text>
                              <FaEye
                                size={24}
                                color='#4b19a7'
                                cursor='pointer'
                                onClick={() =>
                                  toggleTooltip({
                                    rowIndex: id,
                                    columnIndex: 6
                                  })
                                }
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
