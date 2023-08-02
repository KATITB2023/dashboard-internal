import { Flex, Input, Image, Select, Box, IconButton } from '@chakra-ui/react';
import { type ChangeEvent, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import AssignmentListTable from '../../component/assignment-list/AssignmentListTable';

// type for table data
export interface AssignmentListProps {
  title: string;
  nim: string;
  name: string;
  timestamp: string;
  status: string;
  grade: string | null;
  filePath?: string;
}

const AssignmentList = () => {
  // dummy data
  const tableData: AssignmentListProps[] = [
    {
      title: 'Tentang Bangsa Indonesia',
      nim: '123456789',
      name: 'Anu',
      timestamp: '2021-09-09',
      status: 'Terlambat',
      grade: '100'
    },
    {
      title: 'Tentang Kita',
      nim: '123456789',
      name: 'Ani',
      timestamp: '2021-09-09',
      status: 'Tepat waktu',
      grade: '92'
    },
    {
      title: 'Tentang Bangsa Indonesia',
      nim: '123456789',
      name: 'Ana',
      timestamp: '2021-09-09',
      status: 'Terlambat',
      grade: '90'
    },
    {
      title: 'Wawancara',
      nim: '123456789',
      name: 'Anu',
      timestamp: '2021-09-09',
      status: 'Tepat waktu',
      grade: null
    },
    {
      title: 'Cari Jodoh',
      nim: '123456789',
      name: 'Ani',
      timestamp: '2021-09-09',
      status: 'Tepat waktu',
      grade: '100'
    },
    {
      title: 'Cari Jodoh',
      nim: '123456789',
      name: 'Ana',
      timestamp: '2021-09-09',
      status: 'Tepat waktu',
      grade: null
    },
    {
      title: 'Tentang Bangsa Indonesia',
      nim: '123456789',
      name: 'Anu',
      timestamp: '2021-09-09',
      status: 'Tepat waktu',
      grade: '87'
    },
    {
      title: 'Tentang Kita',
      nim: '123456789',
      name: 'Ani',
      timestamp: '2021-09-09',
      status: 'Terlambat',
      grade: '70'
    },
    {
      title: 'Cari Jodoh',
      nim: '123456789',
      name: 'Ana',
      timestamp: '2021-09-09',
      status: 'Tepat waktu',
      grade: '86'
    }
  ];
  const tugasList = [
    'Tentang Bangsa Indonesia',
    'Tentang Kita',
    'Wawancara',
    'Cari Jodoh'
  ];

  const [seacrh, setSearch] = useState(''); // serach bar value
  const [filterBy, setFilterBy] = useState(''); // filter by value
  const [filterTugas, setFilterTugas] = useState(''); // filter tugas value

  const filteredData: AssignmentListProps[] = tableData.filter(
    // filter data by type and search
    (item: AssignmentListProps) => {
      if (filterBy === 'Tugas') {
        return item.title.toLowerCase().includes(filterTugas.toLowerCase());
      } else if (filterBy === 'NIM') {
        return item.nim.toLowerCase().includes(seacrh.toLowerCase());
      } else if (filterBy === 'Nama') {
        return item.name.toLowerCase().includes(seacrh.toLowerCase());
      }
      return true;
    }
  );

  const [recordsPerPage, setRecordsPerPage] = useState(() =>
    filteredData.length > 5 ? 5 : filteredData.length
  ); // records per page
  const [page, setPage] = useState(1); // page number

  return (
    <>
      <Flex height='100vh'>
        <Image
          src='/images/assignment-list/navbar.png'
          height='100%'
          alt=''
          draggable='false'
          loading='lazy'
        />
        <Box
          backgroundColor='black'
          paddingBlock='1rem'
          paddingRight='1rem'
          flexGrow='1'
          height='100%'
        >
          <Flex
            backgroundColor='gray.200'
            color='black'
            padding='2rem 3rem'
            gap='1.5rem'
            direction='column'
            borderRadius='2rem'
            height='100%'
          >
            <Image
              src='/images/assignment-list/tittle.png'
              width='25rem'
              alt=''
              draggable='false'
              loading='lazy'
            />
            <Flex justifyContent='space-between' alignItems='end'>
              <Flex>
                <label>
                  <Flex alignItems='center' gap='.5rem'>
                    <Select
                      value={recordsPerPage}
                      width='fit-content'
                      border='2px'
                      borderColor='gray.300'
                      cursor='pointer'
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setRecordsPerPage(parseInt(e.target.value));
                        setPage(1);
                      }}
                    >
                      {filteredData.length > 0 ? (
                        Array(filteredData.length)
                          .fill(1)
                          .map((_, index: number) => (
                            <option key={index} value={index + 1}>
                              {index + 1}
                            </option>
                          ))
                      ) : (
                        <option value={0}>-</option>
                      )}
                    </Select>
                    <span>data perhalaman</span>
                  </Flex>
                </label>
              </Flex>
              <Flex gap='.5rem'>
                <label>
                  <Select
                    value={filterBy}
                    width='max-content'
                    placeholder='filter by'
                    border='2px'
                    borderColor='gray.300'
                    cursor='pointer'
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setFilterBy(e.target.value)
                    }
                  >
                    {['Tugas', 'NIM', 'Nama'].map((item: string) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </label>
                {filterBy !== 'Tugas' ? (
                  <Input
                    type='search'
                    placeholder='Search'
                    width='15rem'
                    value={seacrh}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSearch(e.target.value)
                    }
                    variant='outline'
                    border='2px'
                    borderColor='gray.300'
                    display={filterBy === '' ? 'none' : 'block'}
                  />
                ) : (
                  <label>
                    <Select
                      width='15rem'
                      value={filterTugas}
                      border='2px'
                      borderColor='gray.300'
                      placeholder='Daftar Tugas'
                      cursor='pointer'
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setFilterTugas(e.target.value)
                      }
                    >
                      {tugasList.map((item: string) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  </label>
                )}
              </Flex>
            </Flex>

            {/* table */}
            {filteredData.length > 0 ? (
              <AssignmentListTable
                filteredData={filteredData}
                recordsPerPage={recordsPerPage}
                page={page}
              />
            ) : (
              <Box marginInline='auto'> Tidak ada data yang sesuai </Box>
            )}

            <Flex alignItems='end' justifyContent='flex-end' gap='.5rem'>
              <IconButton
                variant='unstyled'
                display='flex'
                justifyContent='center'
                border='1px'
                _hover={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }}
                aria-label='back'
                icon={<FiArrowLeft />}
                onClick={() => {
                  setPage((prev) => prev - 1);
                }}
                visibility={page === 1 ? 'hidden' : 'visible'}
              />
              <label>
                Halaman
                <Select
                  border='2px'
                  borderColor='gray.300'
                  cursor='pointer'
                  value={page}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setPage(parseInt(e.target.value))
                  }
                >
                  {filteredData.length > 0 ? (
                    Array(Math.ceil(filteredData.length / recordsPerPage))
                      .fill(1)
                      .map((_, index: number) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))
                  ) : (
                    <option value={0}>-</option>
                  )}
                </Select>
              </label>
              <IconButton
                variant='unstyled'
                display='flex'
                justifyContent='center'
                border='1px'
                _hover={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }}
                aria-label='back'
                icon={<FiArrowRight />}
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
                visibility={
                  page === Math.ceil(filteredData.length / recordsPerPage) ||
                  filteredData.length === 0
                    ? 'hidden'
                    : 'visible'
                }
              />
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default AssignmentList;
