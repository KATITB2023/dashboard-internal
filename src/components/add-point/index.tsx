import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { RouterOutputs, api } from '~/utils/api';
import { Status } from '@prisma/client';
import { AddPointRow } from './AddPointRow';
import Layout from '~/layout';
import { TRPCClientError } from '@trpc/client';

type leaderboardQueryOutput =
  RouterOutputs['leaderboard']['mentorGetLeaderboardData']['data'][0];

export const AddPoint = () => {
  const toast = useToast();

  const editLeaderboardScoreMutation =
    api.leaderboard.mentorUpdateLeaderboardScore.useMutation();

  const [page, setPage] = useState<number>(1);
  const [rowPerPage, setRowPerPage] = useState<number>(5);
  const [filterBy, setFilterBy] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const groupDataQuery = api.group.mentorGetGroupData.useQuery();
  const groupData = groupDataQuery.data || [];
  const groupNumber = groupData[0] ? groupData[0].group.group : -1;

  const leaderboardQuery = api.leaderboard.mentorGetLeaderboardData.useQuery({
    currentPage: page,
    limitPerPage: rowPerPage,
    filterBy: filterBy,
    searchQuery: searchQuery
  });

  const leaderboardList =
    (leaderboardQuery.data && leaderboardQuery.data.data) || [];
  const leaderboardListMetaData = (leaderboardQuery.data &&
    leaderboardQuery.data.metadata) || {
    total: 0
  };

  const maxPage = Math.ceil(
    leaderboardListMetaData.total
      ? leaderboardListMetaData.total / rowPerPage
      : 100
  );

  const {
    isOpen: isEditingRowPerPageOpen,
    onClose: onEditingRowPerPageClose,
    onOpen: onEditingRowPerPageOpen
  } = useDisclosure();

  const [jumpInput, setJumpInput] = useState<string>('1');
  const jumpChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJumpInput(e.target.value);
  };

  const filterByChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterBy(e.target.value);
  };

  const searchQueryChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const statusSearchQueryChangeHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSearchQuery(e.target.value);
  };

  const nextPage = () => {
    let jump = page + 1;
    if (jump > maxPage) {
      jump = 1;
    }
    setPage(jump);
  };
  const prevPage = () => {
    let jump = page - 1;
    if (jump < 1) {
      jump = maxPage;
    }
    setPage(jump);
  };

  const jumpToPage = () => {
    const jumpInputInt = parseInt(jumpInput);
    if (jumpInputInt > maxPage) {
      setPage(maxPage);
      setJumpInput(maxPage.toString());
    } else if (jumpInputInt < 1) {
      setPage(1);
      setJumpInput('1');
    } else {
      setPage(jumpInputInt);
    }
  };

  const editPoint = (id: string, point: number) => {
    editLeaderboardScoreMutation
      .mutateAsync({
        userId: id,
        point: point
      })
      .then(async (res) => {
        toast({
          title: res.message,
          status: 'success',
          duration: 3000
        });
        await leaderboardQuery.refetch();
      })
      .catch((err) => {
        if (!(err instanceof TRPCClientError)) throw err;
        toast({
          title: err.message,
          status: 'error',
          duration: 3000
        });
      });
  };

  return (
    <Layout type='mentor' title='Tambah Poin' fullBg>
      <Flex flexDir='column'>
        <Flex
          justifyContent={{
            base: 'center',
            lg: 'space-between'
          }}
          flexDir={{
            base: 'column',
            lg: 'row'
          }}
          w='100%'
        >
          <Text
            color='#340C8F'
            fontSize='2xl'
            w='20em'
            textAlign='left'
            my='1em'
            fontWeight='bolder'
          >
            Tambah Poin
          </Text>
          <Flex
            bg='black'
            p='1em'
            borderRadius='10px'
            pos='relative'
            w='min(20em,90%)'
            alignItems='center'
            overflow='hidden'
          >
            <Text color='white' fontSize='3xl' fontWeight='bold' zIndex='2'>
              {`Kelompok ${groupNumber === -1 ? 'xx' : groupNumber}`}
            </Text>
            <Image
              src='/images/komet-absen.png'
              alt='comet-image'
              position='absolute'
              right='-5%'
              w='25%'
              top='-1em'
            />
          </Flex>
        </Flex>
        <Flex justifyContent='space-between' mt='2em'>
          <Flex alignItems='center' mt='1em'>
            <>
              <Button
                variant='mono-outline'
                w={{ base: '30%', lg: '6em' }}
                h='2em'
                onClick={onEditingRowPerPageOpen}
              >
                {rowPerPage}
              </Button>
              <Modal
                isOpen={isEditingRowPerPageOpen}
                onClose={() => {
                  onEditingRowPerPageClose();
                }}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Change Row Per Page</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Input
                      value={rowPerPage}
                      onChange={(e) =>
                        setRowPerPage(parseInt(e.target.value) | 0)
                      }
                    />
                  </ModalBody>
                </ModalContent>
              </Modal>
            </>
            <Text ml='1em' fontWeight='bold' color='black'>
              Records per page
            </Text>
          </Flex>
          <Flex>
            <Select
              value={filterBy}
              onChange={filterByChangeHandler}
              placeholder='Filter By'
              w='14em'
            >
              <option value='nim'>NIM</option>
              <option value='name'>Name</option>
            </Select>
            {filterBy.length !== 0 && (
              <InputGroup ml='1em' w='20em'>
                <Input
                  placeholder='Search'
                  value={searchQuery}
                  onChange={searchQueryChangeHandler}
                />
              </InputGroup>
            )}
          </Flex>
        </Flex>
        {leaderboardQuery.isLoading ? (
          <Text w='100%' fontStyle='italic' textAlign='center'>
            Loading...
          </Text>
        ) : leaderboardQuery.isError ? (
          <Text w='100%' color='salmon'>
            Error
          </Text>
        ) : leaderboardList.length < 1 ? (
          <Text w='100%'>Tidak ada data</Text>
        ) : (
          <Box
            borderRadius='12px'
            overflow='hidden'
            mt='1em'
            borderRight='1px solid'
            borderLeft='1px solid'
            borderColor='gray.400'
          >
            <Table w='100%' variant='black'>
              <Thead>
                <Td w='10%'>No.</Td>
                <Td w='20%'>NIM</Td>
                <Td w='20%'>Nama</Td>
                <Td w='50%'>Poin</Td>
              </Thead>
              <Tbody>
                {leaderboardList.map((data, index) => (
                  <AddPointRow
                    data={data}
                    num={rowPerPage * (page - 1) + index + 1}
                    key={index}
                    editPoint={editPoint}
                  />
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        <Flex
          justifyContent='space-between'
          mt='1em'
          flexDir={{ base: 'column', lg: 'row-reverse' }}
        >
          <Flex justifyContent={{ base: 'space-between', lg: 'right' }}>
            <Button
              variant='mono-outline'
              w={{ base: '30%', lg: '4em' }}
              mr='1em'
              onClick={prevPage}
            >
              {'<'}
            </Button>
            <Menu>
              <MenuButton
                border='1px solid gray'
                borderRadius='12px'
                color='gray.600'
                w={{ base: '30%', lg: '4em' }}
              >
                {`${page}`}
              </MenuButton>
              <MenuList border='1px solid gray' p='1em'>
                <Flex>
                  <Input value={jumpInput} onChange={jumpChangeHandler} />
                  <Button
                    variant='mono-outline'
                    w={{ base: '30%', lg: '4em' }}
                    h='2.5em'
                    ml='1em'
                    onClick={jumpToPage}
                  >
                    Jump
                  </Button>
                </Flex>
              </MenuList>
            </Menu>
            <Button
              variant='mono-outline'
              w={{ base: '30%', lg: '4em' }}
              ml='1em'
              onClick={nextPage}
            >
              {'>'}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};
