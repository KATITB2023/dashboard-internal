import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Text,
  TableContainer,
  Button,
  Flex,
  Menu,
  Input,
  MenuList,
  MenuButton,
  useToast
} from '@chakra-ui/react';
import { api } from '~/utils/api';
import AssignmentListRow from './AssignmentListRow';
import { useState } from 'react';

export default function AssignmentList() {
  const [page, setPage] = useState(1);
  const [jumpInput, setJumpInput] = useState(page.toString());
  const assignmentQuery = api.assignment.adminGetAssignment.useQuery({
    currentPage: page
  });
  const toast = useToast();
  const assignmentData = assignmentQuery.data?.data;
  const metadata = assignmentQuery.data?.metadata;
  const header = [
    { w: '10%', title: 'No.' },
    { w: '20%', title: 'Tugas' },
    { w: '20%', title: 'Jenis' },
    { w: '15%', title: 'Mulai' },
    { w: '15%', title: 'Berakhir' },
    { w: '10%', title: 'Rekap Nilai' },
    { w: '10%', title: 'Edit' }
  ];

  const prevPage = () => {
    let jump: number;
    if (page === 1) {
      jump = metadata?.lastPage as number;
    } else {
      jump = page - 1;
    }
    setPage(jump);
    setJumpInput(jump.toString());
  };

  const nextPage = () => {
    let jump: number;
    if (page === metadata?.lastPage) {
      jump = 1;
    } else {
      jump = page + 1;
    }
    setPage(jump);
    setJumpInput(jump.toString());
  };

  const jumpToPage = () => {
    const temp = parseInt(jumpInput);
    if (temp < 1 || temp > (metadata?.lastPage as number)) {
      toast({
        title: 'Error',
        description: 'Invalid page number',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } else {
      setPage(temp);
    }
  };

  return assignmentQuery.isLoading ? (
    <Text>Loading</Text>
  ) : (
    <Flex direction={'column'} rowGap={4}>
      <TableContainer>
        <Table variant={'black'}>
          <Thead>
            <Tr>
              {header.map((item, index) => {
                return (
                  <Th key={index} w={item.w} textAlign={'center'}>
                    {item.title}
                  </Th>
                );
              })}
            </Tr>
          </Thead>

          <Tbody>
            {assignmentData &&
              assignmentData.map((item, index) => {
                return (
                  <AssignmentListRow
                    data={item}
                    index={(page - 1) * 5 + index + 1}
                    page={page}
                    key={item.id}
                  />
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex justifyContent={'space-between'}>
        <Text>
          Showing rows {(page - 1) * 5 + 1} to{' '}
          {page * 5 > (metadata?.total as number) ? metadata?.total : page * 5}{' '}
          of {metadata?.total} entries
        </Text>
        <Flex>
          <Button
            variant='mono-outline'
            w={{ base: '30%', lg: '6em' }}
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
              w={{ base: '30%', lg: '6em' }}
              h='2.5em'
            >
              {page}
            </MenuButton>
            <MenuList border='1px solid gray' p='1em'>
              <Flex>
                <Input
                  type='number'
                  color={'white'}
                  value={jumpInput}
                  onChange={(e) => setJumpInput(e.target.value)}
                />
                <Button
                  variant={'outline'}
                  w='8em'
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
            w={{ base: '30%', lg: '6em' }}
            ml='1em'
            onClick={nextPage}
          >
            {'>'}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
