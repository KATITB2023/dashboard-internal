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

export const Recap = () => {
  const [JumpInput, setJumpInput] = useState<string>('1');
  const jumpChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJumpInput(e.target.value);
  };

  const nextPage = () => {};
  const prevPage = () => {};
  const jumpToPage = () => {};
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
          <Menu>
            <MenuButton
              bg='gray.400'
              borderRadius='12px'
              p='1em'
              color='white'
              w='5em'
            >
              Filter By
            </MenuButton>
            <MenuList>
              <MenuItem>Event</MenuItem>
              <MenuItem>Day</MenuItem>
              <MenuItem>Week</MenuItem>
            </MenuList>
          </Menu>
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

      <Flex justifyContent='right' mt='1em'>
        <Button variant='mono-outline' w='8em' mr='1em' onClick={prevPage}>
          {'<'}
        </Button>
        <Menu>
          <MenuButton
            border='1px solid gray'
            borderRadius='12px'
            color='gray.600'
            minW='7em'
          >
            {`${JumpInput}  >`}
          </MenuButton>
          <MenuList border='1px solid gray' p='1em'>
            <Flex>
              <Input value={JumpInput} onChange={jumpChangeHandler} />
              <Button variant='mono-outline' w='8em' ml='1em'>
                Jump
              </Button>
            </Flex>
          </MenuList>
        </Menu>
        <Button variant='mono-outline' w='8em' ml='1em' onClick={nextPage}>
          {'>'}
        </Button>
      </Flex>
    </Flex>
  );
};
