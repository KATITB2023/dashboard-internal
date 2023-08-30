/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { SetStateAction, useState } from 'react';
import { api } from '~/utils/api';
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
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  FormErrorMessage
} from '@chakra-ui/react';
import MerchCatalogRow from './MerchCatalogRow';
import { TRPCClientError } from '@trpc/client';
import { sanitizeURL, uploadFile } from '~/utils/file';

interface Props {
  emit: () => void;
}

export default function MerchCatalog({ emit }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const [page, setPage] = useState(1);
  const [jumpInput, setJumpInput] = useState(page.toString());
  const [filterBy, setFilterBy] = useState('Nama');
  const [searchQuery, setSearchQuery] = useState<string>();
  const [namaProduk, setNamaProduk] = useState('');
  const [loading, setLoading] = useState(false);
  const handleNamaProdukChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setNamaProduk(e.target.value);
  };
  const [harga, setHarga] = useState(0);
  const handleHargaChange = (e: string) => {
    setHarga(parseInt(e));
  };
  const [quantity, setQuantity] = useState(0);
  const handleQuantityChange = (e: string) => {
    setQuantity(parseInt(e));
  };
  const [file, setFile] = useState<File | null>(null);
  const isError = namaProduk === '';
  const isHargaError = harga === '';
  const isQuantityError = quantity === '';
  const addMerchMutation = api.merch.addNewMerch.useMutation();

  const filters = [
    { title: 'Nama', value: 'Nama' },
    { title: 'Status', value: 'Status' }
  ];

  const requestQuery = api.merch.getAllMerch.useQuery({
    page: page,
    filterBy: filterBy,
    searchQuery: searchQuery
  });
  const requestData = requestQuery.data?.data;
  const requestMetadata = requestQuery.data?.metadata;

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
  const addMerch = async (
    nama: string,
    quantity: number,
    harga: number,
    image?: File | null = null
  ) => {
    setLoading(true);
    try {
      let additionalFilePath = '';
      if (image) {
        const fileName = image.name;
        additionalFilePath = sanitizeURL(
          `https://cdn.oskmitb.com/merch-images/${fileName}`
        );
        file;
        await uploadFile(additionalFilePath, image);
      }
      try {
        await addMerchMutation.mutateAsync({
          name: namaProduk,
          price: harga,
          stock: quantity,
          image: additionalFilePath
        });
        toast({
          title: 'Merch added',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
      } catch (err) {
        if (!(err instanceof TRPCClientError)) throw err;

        toast({
          title: 'Error',
          status: 'error',
          description: err.message,
          duration: 2000,
          isClosable: true,
          position: 'top'
        });
      }
      setLoading(false);
      location.reload();
    } catch (error) {
      if (!(error instanceof TRPCClientError)) throw error;

      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const header = [
    { w: '5%', title: 'No.' },
    { w: '20%', title: 'Nama Produk' },
    { w: '10%', title: 'Quantity' },
    { w: '15%', title: 'Harga' },
    { w: '20%', title: 'Foto Produk' },
    { w: '10%', title: 'Edit' },
    { w: '10%', title: 'Delete' },
    { w: '10%', title: 'Publish' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    const file = files[0];
    if (!file) return;

    setFile(file);
  };

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
        {filterBy === 'Nama' ? (
          <Input
            placeholder='Search nama'
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        ) : (
          <Select
            placeholder='Select status'
            onChange={(e) => setSearchQuery(e.target.value)}
          >
            <option key={0} value='Published'>
              Published
            </option>
            <option key={1} value='Not Published'>
              Not Published
            </option>
          </Select>
        )}
      </Flex>
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
                  <MerchCatalogRow
                    data={item}
                    index={(page - 1) * 5 + index + 1}
                    loading={loading}
                    emit={() => emit()}
                    key={item.id}
                  />
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex
        columnGap={3}
        rowGap={2}
        w={'100%'}
        placeSelf={'flex-start'}
        flexDirection={{ base: 'column', lg: 'row' }}
      >
        <Button
          w='113px'
          h='34px'
          fontSize='12px'
          color={'white'}
          mr={'13%'}
          backgroundColor={'gray.400'}
          _hover={{ backgroundColor: 'gray.600' }}
          onClick={onOpen}
        >
          {'Add merch'}
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add merch</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired isInvalid={isError}>
                <FormLabel>Nama produk</FormLabel>
                <Input
                  placeholder='Nama produk'
                  value={namaProduk}
                  onChange={handleNamaProdukChange}
                />
                {!isError ? (
                  <></>
                ) : (
                  <FormErrorMessage>Nama produk is required</FormErrorMessage>
                )}
              </FormControl>

              <FormControl mt={4} isRequired isInvalid={isQuantityError}>
                <FormLabel>Quantity</FormLabel>
                <NumberInput
                  defaultValue={1}
                  min={1}
                  clampValueOnBlur={false}
                  value={quantity}
                  onChange={handleQuantityChange}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {!isQuantityError ? (
                  <></>
                ) : (
                  <FormErrorMessage>Quantity is required</FormErrorMessage>
                )}
              </FormControl>
              <FormControl mt={4} isRequired isInvalid={isHargaError}>
                <FormLabel>Harga</FormLabel>
                <NumberInput
                  defaultValue={1000}
                  min={1}
                  clampValueOnBlur={false}
                  value={harga}
                  onChange={handleHargaChange}
                >
                  <NumberInputField />
                  {!isHargaError ? (
                    <></>
                  ) : (
                    <FormErrorMessage>Harga is required</FormErrorMessage>
                  )}
                </NumberInput>
              </FormControl>
              <FormControl mt={4} flexDirection={'row'}>
                <FormLabel>Foto produk (Opsional)</FormLabel>
                <input
                  type='file'
                  onChange={(e) => {
                    handleFileChange(e);
                  }}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                mr={3}
                color={'white'}
                backgroundColor={'green.500'}
                _hover={{ backgroundColor: 'green.800' }}
                type='submit'
                isLoading={loading}
                onClick={() => void addMerch(namaProduk, quantity, harga, file)}
              >
                Save
              </Button>
              <Button
                onClick={onClose}
                color={'white'}
                backgroundColor={'red.500'}
                _hover={{ backgroundColor: 'red.800' }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
      {requestMetadata?.total > 5 && (
        <Flex placeSelf={'flex-end'}>
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
  );
}
