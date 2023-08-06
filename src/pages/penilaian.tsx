import Layout from '~/layout/index';
import {
  Flex,
  Input,
  Select,
  Box,
  IconButton,
  Spinner
} from '@chakra-ui/react';
import { type ChangeEvent, useState, useEffect } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import AssignmentListTable from '~/components/assignment-list/AssignmentListTable';
import { api } from '~/utils/api';
import { Header } from '~/components/Header';

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

export interface AssignmentListProps {
  id: string;
  studentId: string;
  nim: string;
  name: string | undefined;
  score: number | null;
  time: Date;
  deadline: Date;
  filePath: string | null;
  title: string;
  type: string;
}

export default function Penilaian() {
  // dummy data

  const [search, setSearch] = useState(''); // serach bar value
  const [filterBy, setFilterBy] = useState(''); // filter by value
  const [filterTugas, setFilterTugas] = useState(''); // filter tugas value
  const searchValue = useDebounce(search); // debounced search value

  const [recordsPerPage, setRecordsPerPage] = useState(1000); // records per page
  const [page, setPage] = useState(1); // page number

  const data =
    api.assignment.mentorGetAssignment.useQuery({
      currentPage: page,
      limitPerPage: recordsPerPage,
      filterBy: filterBy,
      searchQuery: filterBy === 'Tugas' ? filterTugas : searchValue
    }) || [];

  const tugasList =
    api.assignment.mentorGetAssignmentTitleList.useQuery().data || [];
  const totalData = data.data?.metadata.total || 0;

  const dataList: AssignmentListProps[] =
    data.data?.data.map((item) => ({
      id: item.id,
      studentId: item.studentId,
      nim: item.student.nim,
      name: item.student.profile?.name,
      score: item.score,
      time: item.createdAt,
      deadline: item.assignment.endTime,
      filePath: item.filePath,
      title: item.assignment.title,
      type: item.assignment.type
    })) || [];

  return (
    <Layout type='mentor' title='Penilaian' fullBg={false}>
      {/* wrapper */}

      <Flex color='black' gap='1.75rem' direction='column' height='100%'>
        <Header title='Penilaian' />
        <Flex justifyContent='space-between' alignItems='end'>
          {/* records perpage select element */}
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
                  {totalData > 0 ? (
                    <>
                      <option value={totalData}>All</option>
                      {Array(totalData)
                        .fill(1)
                        .map((_, index: number) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </>
                  ) : (
                    <option value={0}>-</option>
                  )}
                </Select>
                <span>data perhalaman</span>
              </Flex>
            </label>
          </Flex>
          {/* filter select element */}
          <Flex gap='.5rem'>
            <label>
              <Select
                value={filterBy}
                width='max-content'
                placeholder='filter by'
                border='2px'
                borderColor='gray.300'
                cursor='pointer'
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setFilterBy(e.target.value);
                  setSearch('');
                  setFilterTugas('');
                  setRecordsPerPage(totalData);
                }}
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
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSearch(e.target.value);
                  setRecordsPerPage(totalData);
                }}
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
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setFilterTugas(e.target.value);
                    setRecordsPerPage(totalData);
                  }}
                >
                  {tugasList.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </Select>
              </label>
            )}
          </Flex>
        </Flex>

        {/* table */}
        {data.isLoading ? (
          <Flex justifyContent='center'>
            <Spinner />
            <Box marginLeft='2rem'>Memuat data...</Box>
          </Flex>
        ) : dataList.length > 0 ? (
          <AssignmentListTable
            filteredData={dataList}
            recordPerPage={recordsPerPage}
            page={page}
          />
        ) : (
          <Box marginInline='auto'>Tidak ada data yang sesuai</Box>
        )}

        <Flex alignItems='end' justifyContent='flex-end' gap='.5rem'>
          {/* left arrow */}
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
          {/* page select element */}
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
              {totalData > 0 && recordsPerPage > 0 ? (
                Array(Math.ceil(totalData / recordsPerPage))
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
          {/* right arrow */}
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
              page === Math.ceil(totalData / recordsPerPage) || totalData === 0
                ? 'hidden'
                : 'visible'
            }
          />
        </Flex>
      </Flex>
    </Layout>
  );
}
