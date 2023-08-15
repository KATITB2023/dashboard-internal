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
import { type RouterOutputs, api } from '~/utils/api';
import AssignmentListRow from './AssignmentListRow';
import { useState } from 'react';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

export default function AssignmentList() {
  const [page, setPage] = useState(1);
  const [jumpInput, setJumpInput] = useState(page.toString());
  const [assignmentId, setAssignmentId] = useState('');
  const [loading, setLoading] = useState(false);
  const assignmentQuery = api.assignment.adminGetAssignment.useQuery({
    currentPage: page
  });
  const csvQuery = api.csv.adminGetCSVAssignment.useQuery({
    assignmentId
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

  const downloadCSV = async (id: string, title: string) => {
    setLoading(true);
    setAssignmentId(id);
    const curData: RouterOutputs['csv']['adminGetCSVAssignment'] | undefined = (
      await csvQuery.refetch()
    ).data;

    // GWS LINTER
    if (curData && !curData[0]) {
      toast({
        description: 'No data found',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      setLoading(false);
      return;
    }

    if (curData) {
      const toParse = curData[0];

      if (toParse?.submission.length === 0) {
        toast({
          description: 'No one submitted yet',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        setLoading(false);
        return;
      }

      const csv = toParse?.submission.map((item) => {
        const { nim, profile, groupRelation } = item.student;

        return {
          nim,
          name: profile?.name,
          faculty: profile?.faculty,
          campus: profile?.campus,
          score: item.score,
          filePath: item.filePath,
          group: groupRelation[0]?.group.group
        };
      });

      const csvByGroup = _.groupBy(csv, 'group');

      const header = [['NIM', 'Nama', 'Fakultas', 'Kampus', 'Nilai', 'Link']];
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const fileName = `Rekap Nilai ${title}`;
      const wb = XLSX.utils.book_new();

      Object.keys(csvByGroup).forEach((key) => {
        const ws = XLSX.utils.aoa_to_sheet(header);
        const res = csvByGroup[key]?.map((item) => {
          return {
            nim: item.nim,
            name: item.name,
            faculty: item.faculty,
            campus: item.campus,
            score: item.score,
            link: item.filePath
          };
        });

        ws['!cols'] = [
          { wch: 20 },
          { wch: 50 },
          { wch: 30 },
          { wch: 30 },
          { wch: 20 },
          { wch: 50 }
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        XLSX.utils.sheet_add_json(ws, res as any[], {
          skipHeader: true,
          origin: 'A2'
        });
        XLSX.utils.book_append_sheet(wb, ws, `Kelompok ${key}`);
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(blob, fileName + fileExtension);
    }

    setLoading(false);
  };

  [
    {
      filePath:
        'https://cdn.oskmitb.com/861a0126-a9cb-40cf-9ae8-f50282c016bc-KLMPK MENTOR AGAMA.png',
      score: 30,
      createdAt: '2023-08-15T06:17:17.073Z',
      student: {
        nim: '13523009',
        profile: {
          name: 'Raymond Elliott',
          faculty: 'FTSL',
          campus: 'CIREBON'
        },
        groupRelation: [
          {
            group: {
              group: 1
            }
          }
        ]
      }
    }
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
  ) : metadata && metadata.total > 0 ? (
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
                    loading={loading}
                    assignmentId={assignmentId}
                    downloadCSV={() => void downloadCSV(item.id, item.title)}
                  />
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
      {!assignmentQuery.isLoading && (
        <Flex
          justifyContent={'space-between'}
          flexDir={{ base: 'column-reverse', lg: 'row-reverse' }}
          rowGap={'1rem'}
        >
          {metadata && metadata.total > 0 && (
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

          <Text>
            Showing rows {metadata.total === 0 ? 0 : (page - 1) * 5 + 1} to{' '}
            {page * 5 > metadata.total ? metadata?.total : page * 5} of{' '}
            {metadata?.total} entries
          </Text>
        </Flex>
      )}
    </Flex>
  ) : (
    <Text>Tidak ada data</Text>
  );
}
