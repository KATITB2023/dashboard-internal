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
import MentorRoute from '~/layout/MentorRoute';
import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';
import { withSession } from '~/server/auth/withSession';

export const getServerSideProps = withSession({ force: true });

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
  faculty: string | null | undefined;
  score: number | null;
  time: Date;
  status: 'Terlambat' | 'Tepat Waktu';
  filePath: string | null;
  title: string;
  type: string;
}

export default function Penilaian() {
  const { data: session } = useSession();
  const [search, setSearch] = useState(''); // serach bar value
  const [filterBy, setFilterBy] = useState(''); // filter by value
  const [filterTugas, setFilterTugas] = useState(''); // filter tugas value
  const [filterFakultas, setFilterFakultas] = useState(''); // filter tugas value
  const [sortParams, setSortParams] = useState<{
    params: 'title' | 'status';
    order: number;
  }>({ params: 'title', order: 0 }); // sort params asc, desc
  const searchValue = useDebounce(search); // debounced search value

  const [recordsPerPage, setRecordsPerPage] = useState(5); // records per page
  const [page, setPage] = useState(1); // page number

  const data =
    api.assignment.mentorAndEOGetAssignment.useQuery({
      currentPage: page,
      limitPerPage: recordsPerPage,
      filterBy: filterBy,
      searchQuery: filterBy === 'Fakultas' ? filterFakultas : searchValue,
      assignment: filterTugas,
      isEO: session && session.user.role === UserRole.EO ? true : false
    }) || [];

  const tugasList =
    api.assignment.mentorGetAssignmentTitleList.useQuery().data || [];
  const totalData = data.data?.metadata.total || 0;

  const facultyList = api.faculty.getFaculties.useQuery().data || [];

  const dataList: AssignmentListProps[] =
    data.data?.data.map((item) => ({
      id: item.id,
      studentId: item.studentId,
      nim: item.student.nim,
      name: item.student.profile?.name,
      faculty: item.student.profile?.faculty,
      score: item.score,
      time: item.createdAt,
      status:
        item.createdAt > item.assignment.endTime ? 'Terlambat' : 'Tepat Waktu',
      filePath: item.filePath,
      title: item.assignment.title,
      type: item.assignment.type
    })) || [];

  const sortedDataList = dataList.sort((a, b) => {
    const { params, order } = sortParams;
    const rawReturnValue = () => {
      if (params === 'title') {
        return a.title.localeCompare(b.title);
      }
      return a.status.localeCompare(b.status);
    };

    return rawReturnValue() * order;
  });

  return (
    <MentorRoute session={session} allowEO={true}>
      <Layout
        type='mentor'
        title='Penilaian'
        fullBg={false}
        isEO={session?.user.role === 'EO'}
      >
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
                    {dataList.length > 0 ? (
                      <>
                        {[5, 10, 15].map((val, index: number) => (
                          <option key={index} value={val}>
                            {val}
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
                  width='15rem'
                  value={filterTugas}
                  border='2px'
                  borderColor='gray.300'
                  placeholder='Daftar Tugas'
                  cursor='pointer'
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setFilterTugas(e.target.value);
                    setRecordsPerPage(totalData);
                    setPage(1);
                  }}
                >
                  {tugasList.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </Select>
              </label>
              <label>
                <Select
                  value={filterBy}
                  width='max-content'
                  placeholder='Filter by'
                  border='2px'
                  borderColor='gray.300'
                  cursor='pointer'
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setFilterBy(e.target.value);
                    setSearch('');
                    setFilterFakultas('');
                    setRecordsPerPage(totalData);
                  }}
                >
                  {['NIM', 'Nama', 'Fakultas'].map((item: string) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </label>
              {filterBy === 'Fakultas' ? (
                <label>
                  <Select
                    width='15rem'
                    value={filterFakultas}
                    border='2px'
                    borderColor='gray.300'
                    placeholder='Daftar Fakultas'
                    cursor='pointer'
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      setFilterFakultas(e.target.value);
                      setRecordsPerPage(totalData);
                      setPage(1);
                    }}
                  >
                    {facultyList.map((item) => (
                      <option
                        key={item.faculty as string}
                        value={item.faculty as string}
                      >
                        {item.faculty}
                      </option>
                    ))}
                  </Select>
                </label>
              ) : (
                <Input
                  type='search'
                  placeholder='Search'
                  width='15rem'
                  value={search}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setSearch(e.target.value);
                    setRecordsPerPage(totalData);
                    setPage(1);
                  }}
                  variant='outline'
                  border='2px'
                  borderColor='gray.300'
                  display={filterBy === '' ? 'none' : 'block'}
                />
              )}
            </Flex>
          </Flex>

          {/* table */}
          {data.isLoading ? (
            <Flex justifyContent='center' height='100%'>
              <Spinner />
              <Box marginLeft='2rem'>Memuat data...</Box>
            </Flex>
          ) : dataList.length > 0 ? (
            <AssignmentListTable
              filteredData={sortedDataList}
              recordPerPage={recordsPerPage}
              page={page}
              sortParams={sortParams}
              setSortParams={setSortParams}
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
                page === Math.ceil(totalData / recordsPerPage) ||
                totalData === 0
                  ? 'hidden'
                  : 'visible'
              }
            />
          </Flex>
        </Flex>
      </Layout>
    </MentorRoute>
  );
}
