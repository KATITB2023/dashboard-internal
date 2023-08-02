import { Box, Table, Tr, Td, Flex, Icon, Tbody } from '@chakra-ui/react';
import { FiChevronDown, FiDownload, FiEdit2, FiPlus } from 'react-icons/fi';
import { type AssignmentListProps } from '../../components/dashboard/AssignmentList';
import { useState } from 'react';

const AssignmentListTable = ({
  filteredData,
  recordsPerPage,
  page
}: {
  filteredData: AssignmentListProps[];
  recordsPerPage: number;
  page: number;
}) => {
  const [isBottomScroll, setIsBottomScroll] = useState(false); // is table scrolled to bottom?

  return (
    // table wrapper
    <Box overflow='hidden' height='100%' position='relative' fontSize='.825rem'>
      {/* scrollable table container */}
      <Box
        overflowY='scroll'
        height='100%'
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          const bottom =
            Math.round(target.scrollTop) ===
            target.scrollHeight - target.clientHeight;
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
                  <Td width=''>Timestamp</Td>
                  <Td width='14%'>
                    <Flex
                      alignItems='center'
                      justifyContent='center'
                      cursor='pointer'
                    >
                      Status <Icon as={FiChevronDown} marginLeft='.5rem' />
                    </Flex>
                  </Td>
                  <Td width='9%'>Nilai</Td>
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
                if (
                  index < (page - 1) * recordsPerPage ||
                  index >= page * recordsPerPage
                )
                  return;

                const bottom =
                  (index + 1) % recordsPerPage === 0 ||
                  index === filteredData.length - 1
                    ? 'none'
                    : '1px';

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
                      {index + 1}
                    </Td>
                    <Td width='18%'>{item.title}</Td>
                    <Td width='12%' textAlign='center'>
                      {item.nim}
                    </Td>
                    <Td width='18%'>{item.name}</Td>
                    <Td textAlign='center'>{item.timestamp}</Td>
                    <Td width='14%' textAlign='center'>
                      {item.status}
                    </Td>
                    <Td width='9%' textAlign='center'>
                      {item.grade ? (
                        <>
                          {item.grade}{' '}
                          <Icon as={FiEdit2} ml='.5rem' cursor='pointer' />
                        </>
                      ) : (
                        <Icon as={FiPlus} cursor='pointer' />
                      )}
                    </Td>
                    <Td width='9%' textAlign='center'>
                      <Icon as={FiDownload} cursor='pointer' />
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
        transitionDuration='.25s'
        backgroundImage='linear-gradient(to bottom, rgba(255,255,255,0), gray.200)'
      />
    </Box>
  );
};

export default AssignmentListTable;
