import {
  Box,
  Table,
  Tr,
  Td,
  Flex,
  Icon,
  Tbody,
  Link,
  Input,
  Spinner,
  useToast
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

const AssignmentListTable = ({
  filteredData,
  recordPerPage,
  page
}: {
  filteredData: AssignmentListProps[];
  recordPerPage: number;
  page: number;
}) => {
  const scoreRef = useRef<HTMLInputElement[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  const toast = useToast();

  const [isBottomScroll, setIsBottomScroll] = useState(
    Math.abs(
      Math.round(tableRef.current?.scrollTop as number) -
        (Number(tableRef.current?.scrollHeight) -
          Number(tableRef.current?.clientHeight))
    ) < 5
  ); // is table scrolled to bottom?
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

  return (
    // table wrapper
    <Box overflow='hidden' height='100%' position='relative'>
      {/* scrollable table container */}
      <Box
        ref={tableRef}
        overflowY='scroll'
        height='100%'
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          const bottom =
            Math.abs(
              Math.round(target.scrollTop) -
                (target.scrollHeight - target.clientHeight)
            ) < 5;
          setIsBottomScroll(bottom);
        }}
        sx={{
          '&::-webkit-scrollbar': {
            width: '0rem'
          }
        }}
      >
        {/* sticky table header */}
        <Box position='sticky' top='0' backgroundColor='gray.200' zIndex={1}>
          <Box borderRadius='2rem 2rem 0 0' overflow='hidden'>
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
                    >
                      Tugas <Icon as={FiChevronDown} marginLeft='.5rem' />
                    </Flex>
                  </Td>
                  <Td width='12%'>NIM</Td>
                  <Td width='18%'>Nama</Td>
                  <Td>Timestamp</Td>
                  <Td width='12%'>
                    <Flex
                      alignItems='center'
                      justifyContent='center'
                      cursor='pointer'
                    >
                      Status <Icon as={FiChevronDown} marginLeft='.5rem' />
                    </Flex>
                  </Td>
                  <Td width='11%'>Nilai</Td>
                  <Td width='9%'>Action</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>

        {/* table body */}
        <Box
          overflow='hidden'
          borderRadius='0 0 2rem 2rem'
          borderInline='1px'
          borderBottom='1px'
        >
          <Table whiteSpace='normal'>
            <Tbody>
              {filteredData.map((item: AssignmentListProps, index: number) => {
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
                    <Td width='18%'>{item.name}</Td>
                    <Td textAlign='center'>
                      {item.time.toLocaleDateString('id') +
                        ' ' +
                        item.time.toLocaleTimeString('id')}
                    </Td>
                    <Td width='12%' textAlign='center'>
                      {item.time > item.deadline ? 'Terlambat' : 'Tepat Waktu'}
                    </Td>
                    <Td width='11%' textAlign='center'>
                      <Flex
                        position='relative'
                        justifyContent='center'
                        alignItems='center'
                        zIndex={activeScoreBar === index && isEditing ? 10 : 0}
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
                              (scoreRef.current[index] = el as HTMLInputElement)
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
                                Number(scoreRef.current[index]?.value) < 0 ||
                                Number(scoreRef.current[index]?.value) > 100
                              ) {
                                toast({
                                  title:
                                    'Nilai harus berada diantara 0 dan 100',
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
                                  score: Number(scoreRef.current[index]?.value),
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
                    <Td width='9%' textAlign='center'>
                      <Link download href={item.filePath as string}>
                        <Icon as={FiDownload} />
                      </Link>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Box>
      <Box
        position='absolute'
        width='100%'
        height='3rem'
        bottom='0'
        left='0'
        opacity={isBottomScroll ? 0 : 1}
        zIndex={isBottomScroll ? -1 : 1}
        transitionDuration='.25s'
        pointerEvents='none'
        backgroundImage='linear-gradient(to bottom, rgba(255,255,255,0), gray.200)'
      />
    </Box>
  );
};

export default AssignmentListTable;
