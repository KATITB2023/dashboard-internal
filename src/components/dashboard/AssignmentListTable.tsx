import {
  Box,
  Table,
  Thead,
  Tr,
  Td,
  Flex,
  Icon,
  Tbody,
  type TableCellProps
} from '@chakra-ui/react';
import { FiChevronDown, FiDownload, FiEdit2, FiPlus } from 'react-icons/fi';
import { type AssignmentListProps } from './AssignmentList';
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
    <Box overflow='hidden' height='100%' position='relative'>
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
          <Table whiteSpace='normal'>
            <Thead
              display='block'
              borderRadius='2rem 2rem 0 0'
              backgroundColor='black'
              color='white'
            >
              <Tr>
                <Td width='6%' textAlign='center'>
                  No
                </Td>
                <Td width='22.5%'>
                  <Flex
                    alignItems='center'
                    justifyContent='center'
                    cursor='pointer'
                  >
                    Tugas <Icon as={FiChevronDown} marginLeft='.5rem' />
                  </Flex>
                </Td>
                <Td width='12%' textAlign='center'>
                  NIM
                </Td>
                <Td width='18%' textAlign='center'>
                  Nama
                </Td>
                <Td width='' textAlign='center'>
                  Timestamp
                </Td>
                <Td width='12%'>
                  <Flex
                    alignItems='center'
                    justifyContent='center'
                    cursor='pointer'
                  >
                    Status <Icon as={FiChevronDown} marginLeft='.5rem' />
                  </Flex>
                </Td>
                <Td width='9%' textAlign='center'>
                  Nilai
                </Td>
                <Td width='8%' textAlign='center'>
                  Action
                </Td>
              </Tr>
            </Thead>
          </Table>
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

                const TableCell = (props: TableCellProps) => (
                  <Td
                    borderBottom={bottom}
                    borderRight='1px'
                    paddingInline='1rem'
                    textAlign='center'
                    {...props}
                  />
                );

                return (
                  <Tr
                    key={index}
                    sx={{
                      '&:nth-child(n)': {
                        paddingInline: '1rem'
                      }
                    }}
                  >
                    <TableCell width='6%'>{index + 1}</TableCell>
                    <TableCell width='22.5%' textAlign='left'>
                      {item.title}
                    </TableCell>
                    <TableCell width='12%'>{item.nim}</TableCell>
                    <TableCell width='18%' textAlign='left'>
                      {item.name}
                    </TableCell>
                    <TableCell>{item.timestamp}</TableCell>
                    <TableCell width='12%'>{item.status}</TableCell>
                    <TableCell width='9%'>
                      {item.grade ? (
                        <>
                          {item.grade}{' '}
                          <Icon as={FiEdit2} ml='.5rem' cursor='pointer' />
                        </>
                      ) : (
                        <Icon as={FiPlus} cursor='pointer' />
                      )}
                    </TableCell>
                    <TableCell width='8%' borderRight='none'>
                      <Icon as={FiDownload} cursor='pointer' />
                    </TableCell>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Box>
      {!isBottomScroll && (
        <Box
          position='absolute'
          width='100%'
          height='3rem'
          bottom='0'
          left='0'
          backgroundImage='linear-gradient(to bottom, rgba(255,255,255,0), gray.200)'
        />
      )}
    </Box>
  );
};

export default AssignmentListTable;
