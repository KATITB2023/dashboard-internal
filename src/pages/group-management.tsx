import {
  Box,
  Flex,
  Text,
  Avatar,
  Container,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { FaEye } from 'react-icons/fa';
import { Header } from '~/components/Header';
import Tooltip from '~/components/group-information-management/Tooltip';
import Layout from '~/layout/index';
import { api } from '~/utils/api';
import MentorRoute from '~/layout/MentorRoute';
import { useSession } from 'next-auth/react';
import { withSession } from '~/server/auth/withSession';

interface CellIdentifier {
  rowIndex: number;
  columnIndex: number;
}

export const getServerSideProps = withSession({ force: true });

export default function GroupManagement() {
  const { data: session } = useSession();
  const mentorGroupQuery = api.group.mentorGetGroupData.useQuery();
  const mentorGroup = mentorGroupQuery.data;

  // Mengambil assignment
  const assignmentQuery =
    api.assignment.mentorGetAssignmentTitleList.useQuery();
  const assignment = assignmentQuery.data;

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
    <MentorRoute session={session}>
      <Layout type='mentor' title='Group Management' fullBg={false}>
        <Box height='100%' p={1}>
          {/* Logo and kelompok, flex display  */}
          <Flex
            justifyContent='space-between'
            alignItems='center'
            flexDirection={{ base: 'column', md: 'row' }}
          >
            {/* Logo */}
            <Header title='Group Management' />

            {/* Kelompok */}
            <Box
              width='auto'
              height='96px'
              bgImage='/images/comet_container.png'
              backgroundSize='cover'
              borderRadius='25px'
            >
              <Flex
                p={3}
                mr={12}
                justifyContent='left'
                alignItems='center'
                height='100%'
              >
                <Avatar
                  name={(mentorGroup
                    ? mentorGroup[0]?.group.group
                    : []
                  )?.toString()}
                  boxSize='70px'
                  mr={4}
                />
                <Text fontWeight='bold' fontSize='24px' color='white'>
                  Kelompok {mentorGroup ? mentorGroup[0]?.group.group : []}
                </Text>
              </Flex>
            </Box>
          </Flex>

          <br />

          {/* Mentor boxes*/}
          <Box mt={4}>
            <Text color='#2D3648DE' fontWeight='700' fontSize='20px'>
              Mentor:
            </Text>
            <Flex justifyContent='space-between' flexWrap='wrap' rowGap={4}>
              {mentorGroup
                ?.filter((mentorGroup) => mentorGroup.user.role === 'MENTOR')
                .map((mentorGroup, id) => (
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
                      name={mentorGroup.user.profile?.name}
                      boxSize='70px'
                      mr={4}
                    />
                    <Flex
                      flexDirection='column'
                      height='74px'
                      justifyContent='center'
                    >
                      <Text fontSize='16px' fontWeight='700'>
                        {mentorGroup.user.profile?.name}
                      </Text>
                      <Text fontSize='14px' fontWeight='400'>
                        {mentorGroup.user.nim}
                      </Text>
                      <Text fontSize='14px' fontWeight='400'>
                        {mentorGroup.user.profile?.faculty}
                      </Text>
                    </Flex>
                  </Flex>
                ))}
            </Flex>
          </Box>

          {/* Members table */}
          <Box mt={4}>
            <Text color='#2D3648DE' fontWeight='700' fontSize='20px'>
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
                  {mentorGroup
                    ?.filter(
                      (mentorGroup) => mentorGroup.user.role === 'STUDENT'
                    )
                    .map((mentorGroup, id) => {
                      // submisi Tugas
                      const totalAssignment = assignment?.length as number; // Banyak total assignment
                      const allAssignmentTitles: string[] = assignment?.map(
                        (assignment) => assignment.title
                      ) as string[]; // Mengambil array judul assignment
                      const studentAssignmentTitles: string[] =
                        mentorGroup.user.submission.map(
                          (submission) => submission.assignment.title
                        ); // Mengambil array judul assignment yang sudah dikerjakan
                      const completedAssignment =
                        mentorGroup.user.submission.length;
                      const assignmentPercentage = parseFloat(
                        ((completedAssignment / totalAssignment) * 100).toFixed(
                          2
                        )
                      );

                      // presensi
                      const attendanceArray = mentorGroup.user.attendance;
                      const totalAttendance = attendanceArray.length;
                      const hadirCount = attendanceArray.filter(
                        (item) => item.status === 'HADIR'
                      ).length;
                      const attendancePercentage = parseFloat(
                        ((hadirCount / totalAttendance) * 100).toFixed(2)
                      );

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
                        return mentorGroup.user.attendance.map(
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
                            {mentorGroup.user.nim}
                          </Td>
                          <Td borderColor='black' borderWidth='1px'>
                            {mentorGroup.user.profile?.name}
                          </Td>
                          <Td borderColor='black' borderWidth='1px'>
                            {mentorGroup.user.profile?.faculty}
                          </Td>
                          <Td borderColor='black' borderWidth='1px'>
                            {mentorGroup.user.profile?.campus}
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
    </MentorRoute>
  );
}
