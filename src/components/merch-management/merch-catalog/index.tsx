import { type BaseSyntheticEvent, useState } from 'react';
import { type RouterInputs, api } from '~/utils/api';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
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
import { useForm, Controller } from 'react-hook-form';

interface FormValues {
  name: string;
  price: number;
  stock: number;
  image: FileList;
  isPublished: boolean;
}

type FieldType = 'name' | 'price' | 'stock' | 'isPublished' | 'image';

export default function MerchCatalog() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const [page, setPage] = useState(1);
  const [jumpInput, setJumpInput] = useState(page.toString());
  const [filterBy, setFilterBy] = useState('Nama');
  const [searchQuery, setSearchQuery] = useState<string>();
  const [loading, setLoading] = useState(false);
  const addMerchMutation = api.merch.addNewMerch.useMutation();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset
  } = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      isPublished: false,
      image: undefined
    }
  });
  const filters = [
    { title: 'Nama', value: 'Nama' },
    { title: 'Status', value: 'Status' }
  ];

  const requestQuery = api.merch.getAllMerch.useQuery({
    page: page,
    filterBy: filterBy,
    searchQuery: searchQuery
  });
  const requestData = requestQuery.data ? requestQuery.data.data : [];
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
  const addMerch = async (data: FormValues) => {
    setLoading(true);
    let additionalFilePath = '';
    if (data.image && data.image[0]) {
      const fileName = data.image[0].name;
      additionalFilePath = sanitizeURL(
        `https://cdn.oskmitb.com/merch-images/${fileName}`
      );
      await uploadFile(additionalFilePath, data.image[0]);
    }
    const payload: RouterInputs['merch']['addNewMerch'] = {
      name: data.name,
      price: parseInt(data.price.toString()),
      stock: parseInt(data.stock.toString()),
      image: additionalFilePath
    };

    try {
      await addMerchMutation.mutateAsync(payload);
      toast({
        title: 'Merch added',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      closeModal();
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
  };

  const closeModal = () => {
    reset();
    onClose();
  };

  const handleNumberInputChange = (fieldName: FieldType, value: string) => {
    setValue(fieldName, value !== '' ? parseInt(value) : '');
  };

  const handleInputChange = (fieldName: FieldType, value: string) => {
    setValue(fieldName, value !== '' ? value : '');
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
        <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
          <ModalOverlay />
          <ModalContent>
            <form
              onSubmit={(e: BaseSyntheticEvent) =>
                void handleSubmit(addMerch)(e)
              }
            >
              <ModalHeader>Add merch</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel>Nama produk</FormLabel>
                  <Input
                    placeholder={'Nama produk'}
                    {...register('name', {
                      required: 'Nama produk tidak boleh kosong'
                    })}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </FormControl>

                <FormControl mt={4} isRequired isInvalid={!!errors.stock}>
                  <FormLabel>Quantity</FormLabel>
                  <Controller
                    control={control}
                    name='stock'
                    rules={{
                      required: {
                        value: true,
                        message: 'stok harus ada'
                      }
                    }}
                    render={() => (
                      <NumberInput
                        min={1}
                        clampValueOnBlur={false}
                        {...register('stock', {
                          required:
                            'Stock tidak boleh kosong dan harus lebih dari 0'
                        })}
                        onChange={(e) => handleNumberInputChange('stock', e)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                </FormControl>
                <FormControl mt={4} isRequired isInvalid={!!errors.price}>
                  <FormLabel>Harga</FormLabel>
                  <Controller
                    control={control}
                    name='price'
                    rules={{
                      required: {
                        value: true,
                        message: 'Harga harus ada'
                      }
                    }}
                    render={() => (
                      <NumberInput
                        min={1}
                        {...register('price', {
                          required:
                            'Harga tidak boleh kosong dan harus lebih dari 0'
                        })}
                        onChange={(e) => handleNumberInputChange('price', e)}
                      >
                        <NumberInputField />
                      </NumberInput>
                    )}
                  />
                </FormControl>
                <FormControl mt={4} flexDirection={'row'}>
                  <FormLabel>Foto produk (Opsional)</FormLabel>
                  <input type='file' {...register('image')} />
                  {errors.image && (
                    <FormErrorMessage>{errors.image.message}</FormErrorMessage>
                  )}
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
            </form>
          </ModalContent>
        </Modal>
      </Flex>
      {requestMetadata && requestMetadata.total > 5 && (
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
