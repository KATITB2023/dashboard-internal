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
  useToast,
  Select
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { api } from '~/utils/api';
import MerchRequestRow from './MerchRequestRow';

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function MerchRequest() {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [jumpInput, setJumpInput] = useState(page.toString());
  const [filterBy, setFilterBy] = useState('NIM');
  const [searchQuery, setSearchQuery] = useState<string>();

  const searchValue = useDebounce(searchQuery);

  console.log(searchValue, 'ini value');

  const requestQuery = api.merch.getMerchRequest.useQuery({
    page: page,
    filterBy: filterBy,
    searchQuery: searchValue
  });
  const requestData = requestQuery.data?.data;
  const requestMetadata = requestQuery.data?.metadata;

  const merchNameQuery = api.merch.getMerchNameList.useQuery();
  const merchNameList = merchNameQuery.data;

  const header = [
    { w: '10%', title: 'No.' },
    { w: '25%', title: 'Nama Produk' },
    { w: '25%', title: 'Nama Pemohon' },
    { w: '20%', title: 'NIM' },
    { w: '20%', title: 'Action' }
  ];

  const filters = [
    { title: 'NIM', value: 'NIM' },
    { title: 'Merch', value: 'Merch' }
  ];

  const prevPage = () => {
    let jump: number;
    if (page === 1) {
      jump = requestMetadata?.lastPage as number;
    } else {
      jump = page - 1;
    }
    setPage(jump);
    setJumpInput(jump.toString());
  };

  const nextPage = () => {
    let jump: number;
    if (page === requestMetadata?.lastPage) {
      jump = 1;
    } else {
      jump = page + 1;
    }
    setPage(jump);
    setJumpInput(jump.toString());
  };

  const jumpToPage = () => {
    const temp = parseInt(jumpInput);
    if (temp < 1 || temp > (requestMetadata?.lastPage as number)) {
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

  useEffect(() => {
    setSearchQuery('');
  }, [filterBy]);

  return (
    <Flex direction={'column'} rowGap={4}>
      <Flex columnGap={4} w={'30%'} placeSelf={'flex-end'}>
        <Select onChange={(e) => setFilterBy(e.target.value)}>
          {filters.map((filter) => {
            return (
              <option key={filter.value} value={filter.value}>
                {filter.title}
              </option>
            );
          })}
        </Select>
        {filterBy === 'NIM' ? (
          <Input
            placeholder='Search NIM'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        ) : (
          <Select
            placeholder='Select Merch'
            defaultValue={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          >
            {merchNameList &&
              merchNameList.map((item, index) => {
                return (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
          </Select>
        )}
      </Flex>
      {requestQuery.isLoading ? (
        <Text>Loading...</Text>
      ) : requestMetadata && requestMetadata.total > 0 ? (
        <>
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
                {requestData &&
                  requestData.map((item, index) => {
                    return (
                      <MerchRequestRow
                        data={item}
                        index={(page - 1) * 5 + index + 1}
                        key={item.id}
                        emit={() => void requestQuery.refetch()}
                      />
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex
            justifyContent={'space-between'}
            flexDir={{ base: 'column-reverse', lg: 'row-reverse' }}
            rowGap={'1rem'}
          >
            {requestMetadata && requestMetadata.total > 0 && (
              <Flex>
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
                  w={{ base: '30%', lg: '4em' }}
                  ml='1em'
                  onClick={nextPage}
                >
                  {'>'}
                </Button>
              </Flex>
            )}
          </Flex>
        </>
      ) : (
        <Text>Tidak ada data</Text>
      )}
    </Flex>
  );
}
