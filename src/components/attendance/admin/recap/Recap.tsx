import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr
} from '@chakra-ui/react';
import { useState } from 'react';
import { RouterInputs, api } from '~/utils/api';

type recordListQueryInputs =
  RouterInputs['attendance']['adminGetAttendanceRecord'];

export const Recap = () => {
  const recordListQuery = api.attendance.adminGetAttendanceRecord.useQuery({
    currentPage: 1,
    limitPerPage: 5
  });

  const recordList = recordListQuery.data;

  const [filterBy, setFilterBy] = useState<string>('ALL');
  const [maxRow, setMaxRow] = useState<number>(5);
  const maxPage = Math.ceil(1000);

  const [page, setPage] = useState<number>(1);
  const [jumpInput, setJumpInput] = useState<string>('1');
  const jumpChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJumpInput(e.target.value);
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

  return (
    <Flex flexDir='column'>
      <Flex justifyContent='space-between'>
        <Flex alignItems='center' mt='1em'>
          <Button variant='mono-outline' w='8em' disabled>
            20
          </Button>{' '}
          <Text ml='1em' fontWeight='bold' color='black'>
            Records per page
          </Text>
        </Flex>
        <Flex>
          <Select>
            <option value='ALL'>All</option>
            <option value='EVENT'>Event</option>
          </Select>
          <InputGroup ml='1em' w='10em'>
            <Input placeholder='Search' />
          </InputGroup>
        </Flex>
      </Flex>

      <Box
        borderRadius='12px'
        overflow='hidden'
        mt='1em'
        borderRight='1px solid'
        borderLeft='1px solid'
        borderColor='gray.400'
      >
        <Table w='100%' mt='1em'>
          <Thead>
            <Td w='10%'>No.</Td>
            <Td w='10%'>Kelompok</Td>
            <Td w='25%'>Mentor</Td>
            <Td w='10%'>Tanggal</Td>
            <Td w='10%'>Jam</Td>
            <Td w='10%'>Status</Td>
            <Td w='25%'>Keterangan</Td>
          </Thead>
          <Tbody>
            <Tr>
              <Td>231</Td>
              <Td>231</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Flex
        justifyContent='space-between'
        mt='1em'
        flexDir={{ base: 'column', lg: 'row-reverse' }}
      >
        <Flex justifyContent={{ base: 'space-between', lg: 'right' }}>
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
              {`${page}`}
            </MenuButton>
            <MenuList border='1px solid gray' p='1em'>
              <Flex>
                <Input value={jumpInput} onChange={jumpChangeHandler} />
                <Button
                  variant='mono-outline'
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
};
