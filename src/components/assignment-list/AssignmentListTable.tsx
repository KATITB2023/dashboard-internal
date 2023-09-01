import {
  Box,
  Table,
  Tr,
  Td,
  Flex,
  Icon,
  Tbody,
  Text,
  Input,
  Spinner,
  useToast,
  TableContainer
} from '@chakra-ui/react';
import {
  FiChevronDown,
  FiDownload,
  FiEdit2,
  FiPlus,
  FiCheck
} from 'react-icons/fi';
import { useRef, useState } from 'react';
import { type AssignmentListProps } from '~/pages/penilaian';
import { api } from '~/utils/api';
import axios from 'axios';

const AssignmentListTable = ({
  filteredData,
  recordPerPage,
  page,
  sortParams,
  setSortParams
}: {
  filteredData: AssignmentListProps[];
  recordPerPage: number;
  page: number;
  sortParams: { params: 'title' | 'status'; order: number };
  setSortParams: (params: {
    params: 'title' | 'status';
    order: number;
  }) => void;
}) => {
  const scoreRef = useRef<HTMLInputElement[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false); // is score being edited?
  const [activeScoreBar, setActiveScoreBar] = useState<number | null>(null); // active score bar index

  const mutation = api.assignment.mentorSetAssignmentScore.useMutation({
    onSuccess: () => {
      toast({
        title: 'Nilai berhasil disimpan',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      setActiveScoreBar(null);
    },
    onError: () => {
      toast({
        title: 'Nilai gagal disimpan',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      setActiveScoreBar(null);
    }
  });

  const downloadFile = async (fileUrl: string, fileName: string) => {
    const response = await axios.get(fileUrl, {
      responseType: 'blob'
    });

    const lastDotIndex = fileUrl.lastIndexOf('.');
    let fileExtension = '';
    if (lastDotIndex !== -1) {
      fileExtension = fileUrl.slice(lastDotIndex);
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName + fileExtension);
    document.body.appendChild(link);
    link.click();
  };

  return (
    // table wrapper
    <Box position='relative'>
      {/* scrollable table container */}
      <Box
        ref={tableRef}
        height='100%'
        sx={{
          '&::-webkit-scrollbar': {
            width: '0rem'
          }
        }}
      >
        {/* sticky table header */}
        <Box position='sticky' top='0' backgroundColor='gray.200' zIndex={1}>
          <Box borderRadius='2rem 2rem 0 0'>
            <TableContainer>
              <Table whiteSpace='normal'>
                <Tbody backgroundColor='black' color='white'>
                  <Tr
                    sx={{
                      '& > td': {
                        textAlign: 'center',
                        paddingInline: '1rem'
                      }
                    }}
                  >
                    <Td width='6.75%'>No</Td>
                    <Td width='18%'>
                      <Flex
                        alignItems='center'
                        justifyContent='center'
                        cursor='pointer'
                        onClick={() => {
                          if (sortParams.params === 'title') {
                            setSortParams({
                              params: 'title',
                              order: sortParams.order === 1 ? -1 : 1
                            });
                            return;
                          }
                          setSortParams({
                            params: 'title',
                            order: 1
                          });
                        }}
                      >
                        Tugas{' '}
                        <Icon
                          as={FiChevronDown}
                          marginLeft='.5rem'
                          transform={
                            sortParams.params === 'title' &&
                            sortParams.order === -1
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)'
                          }
                          transitionDuration='.2s'
                        />
                      </Flex>
                    </Td>
                    <Td width='12%'>NIM</Td>
                    <Td width='14%'>Nama</Td>
                    <Td width='10%'>Fakultas</Td>
                    <Td>Timestamp</Td>
                    <Td width='10%'>
                      <Flex
                        alignItems='center'
                        justifyContent='center'
                        cursor='pointer'
                        onClick={() => {
                          if (sortParams.params === 'status') {
                            setSortParams({
                              params: 'status',
                              order: sortParams.order === 1 ? -1 : 1
                            });
                            return;
                          }
                          setSortParams({
                            params: 'status',
                            order: 1
                          });
                        }}
                      >
                        Status{' '}
                        <Icon
                          as={FiChevronDown}
                          marginLeft='.5rem'
                          transitionDuration='.2s'
                        />
                      </Flex>
                    </Td>
                    <Td width='12%'>Nilai</Td>
                    <Td width='9%'>Action</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        {/* table body */}
        <Box borderRadius='0 0 2rem 2rem' borderInline='1px' borderBottom='1px'>
          <TableContainer>
            <Table whiteSpace='normal'>
              <Tbody>
                {filteredData.map(
                  (item: AssignmentListProps, index: number) => {
                    const bottom =
                      index === filteredData.length - 1 ? 'none' : '1px';

                    return (
                      <Tr
                        key={index}
                        sx={{
                          '& > td': {
                            paddingInline: '1rem',
                            borderBottom: `${bottom}`,
                            borderRight: `1px`,

                            '&:last-child': {
                              borderRight: 'none'
                            }
                          }
                        }}
                      >
                        <Td width='6.75%' textAlign='center'>
                          {index + recordPerPage * (page - 1) + 1}
                        </Td>
                        <Td width='18%'>{item.title}</Td>
                        <Td width='12%' textAlign='center'>
                          {item.nim}
                        </Td>
                        <Td width='14%'>{item.name}</Td>
                        <Td width='10%'>{item.faculty}</Td>
                        <Td textAlign='center'>
                          {item.time.toLocaleDateString('id') +
                            ' ' +
                            item.time.toLocaleTimeString('id')}
                        </Td>
                        <Td width='10%' textAlign='center'>
                          {item.status}
                        </Td>
                        <Td width='12%' textAlign='center'>
                          <Flex
                            position='relative'
                            justifyContent='center'
                            alignItems='center'
                            zIndex={
                              activeScoreBar === index && isEditing ? 10 : 0
                            }
                          >
                            {mutation.isLoading && activeScoreBar === index ? (
                              <Spinner
                                size='xs'
                                thickness='1px'
                                marginRight='.5rem'
                              />
                            ) : item.score ||
                              (isEditing && activeScoreBar === index) ? (
                              <Input
                                readOnly={!isEditing}
                                type='number'
                                ref={(el) =>
                                  (scoreRef.current[index] =
                                    el as HTMLInputElement)
                                }
                                defaultValue={item.score?.toString()}
                                textAlign='center'
                                cursor={isEditing ? 'auto' : 'not-allowed'}
                                outline='1px solid grey'
                                marginRight='.5rem'
                                variant='unstyled'
                              />
                            ) : undefined}
                            {isEditing && activeScoreBar === index ? (
                              <Icon
                                as={FiCheck}
                                cursor='pointer'
                                onClick={() => {
                                  if (
                                    scoreRef.current[index]?.value ===
                                    item.score?.toString()
                                  ) {
                                    setIsEditing(false);
                                    return;
                                  } else if (
                                    scoreRef.current[index]?.value === ''
                                  ) {
                                    toast({
                                      title: 'Nilai tidak boleh kosong',
                                      status: 'warning',
                                      duration: 2000,
                                      isClosable: true,
                                      position: 'top'
                                    });
                                    scoreRef.current[index]?.focus();
                                    return;
                                  } else if (
                                    Number(scoreRef.current[index]?.value) <
                                      0 ||
                                    Number(scoreRef.current[index]?.value) > 100
                                  ) {
                                    toast({
                                      title:
                                        'Nilai harus berada di antara 0 dan 100',
                                      status: 'warning',
                                      duration: 2000,
                                      isClosable: true,
                                      position: 'top'
                                    });
                                    scoreRef.current[index]?.focus();
                                    return;
                                  } else {
                                    setIsEditing(false);
                                    mutation.mutate({
                                      score: Number(
                                        scoreRef.current[index]?.value
                                      ),
                                      submissionId: item.id
                                    });
                                    item.score = Number(
                                      scoreRef.current[index]?.value
                                    );
                                  }
                                }}
                              />
                            ) : item.score ? (
                              <Icon
                                as={FiEdit2}
                                cursor='pointer'
                                onClick={() => {
                                  scoreRef.current[index]?.focus();
                                  setIsEditing(true);
                                  setActiveScoreBar(index);
                                }}
                              />
                            ) : (
                              <Icon
                                as={FiPlus}
                                cursor='pointer'
                                onClick={() => {
                                  scoreRef.current[index]?.focus();
                                  setIsEditing(true);
                                  setActiveScoreBar(index);
                                }}
                              />
                            )}
                            <Box
                              display={
                                activeScoreBar === index && isEditing
                                  ? 'block'
                                  : 'none'
                              }
                              zIndex='-1'
                              position='fixed'
                              inset='0'
                              onClick={() => {
                                scoreRef.current[index]?.focus();
                                toast({
                                  title: 'Mohon selesaikan pengeditan nilai',
                                  status: 'warning',
                                  duration: 2000,
                                  isClosable: true,
                                  position: 'top'
                                });
                              }}
                            />
                          </Flex>
                        </Td>
                        <Td
                          width='9%'
                          textAlign='center'
                          _hover={{ cursor: 'pointer' }}
                        >
                          {item.filePath ? (
                            <Icon
                              as={FiDownload}
                              onClick={() =>
                                void downloadFile(
                                  item.filePath as string,
                                  `${item.title}-${item.name as string}`
                                )
                              }
                              _hover={{
                                opacity: 0.5
                              }}
                            />
                          ) : (
                            <Text>-</Text>
                          )}
                        </Td>
                      </Tr>
                    );
                  }
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentListTable;
