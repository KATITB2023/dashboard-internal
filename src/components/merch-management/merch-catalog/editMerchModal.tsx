/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Td,
  Button,
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  useToast,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper
} from '@chakra-ui/react';
import { MdEdit } from 'react-icons/md';
import { type Merchandise } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { SetStateAction, useState } from 'react';
import { sanitizeURL, uploadFile } from '~/utils/file';
import { api } from '~/utils/api';
import { TRPCClientError } from '@trpc/client';

interface FormValues {
  nama: string;
  quantity: number;
  harga: number;
  image: string;
  isPublished: boolean;
}

interface Props {
  props: Merchandise;
  emit: () => void;
}

export default function EditMerchModal({ props, emit }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const {
    formState: { errors }
  } = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: {
      nama: props.name,
      quantity: props.stock,
      harga: props.price,
      image: props.image || undefined,
      isPublished: props.isPublished
    }
  });
  const [namaProduk, setNamaProduk] = useState(props.name);
  const isError = namaProduk === '';
  const handleNamaProdukChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setNamaProduk(e.target.value);
  };
  const [harga, setHarga] = useState(0);
  const isHargaError = harga === '';
  const handleHargaChange = (e: string) => {
    setHarga(parseInt(e));
  };
  const [quantity, setQuantity] = useState(0);
  const isQuantityError = quantity === '';
  const handleQuantityChange = (e: string) => {
    setQuantity(parseInt(e));
  };

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    const file = files[0];
    if (!file) return;

    setFile(file);
  };

  const editMerchMutation = api.merch.editMerch.useMutation();

  const editMerch = async (
    nama: string,
    quantity: number,
    harga: number,
    image: File | null = null,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    let additionalFilePath = '';

    if (image != null) {
      const fileName = image.name;
      additionalFilePath = sanitizeURL(
        `https://cdn.oskmitb.com/merch-images/${fileName}`
      );
      await uploadFile(additionalFilePath, image);
    }
    try {
      await editMerchMutation.mutateAsync({
        merchId: props.id,
        name: namaProduk,
        price: harga,
        stock: quantity,
        image: additionalFilePath
      });
      toast({
        title: 'Merch edited',
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
    setHarga(0);
    setNamaProduk('');
    setQuantity(0);
    location.reload();
  };

  return (
    <Td w='10%'>
      <Button
        variant='outline'
        onClick={() => {
          onOpen();
          setNamaProduk(props.name);
          setHarga(props.price);
          setQuantity(props.stock);
        }}
      >
        <MdEdit fontSize='1.5rem' />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form>
            <ModalHeader>Edit merch</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {props.isPublished ? (
                <></>
              ) : (
                <FormControl isRequired isInvalid={isError}>
                  <FormLabel>Nama produk</FormLabel>
                  <Input
                    placeholder={'Nama produk'}
                    value={namaProduk}
                    onChange={handleNamaProdukChange}
                  />
                  {!isError ? (
                    <></>
                  ) : (
                    <FormErrorMessage>Nama produk is required</FormErrorMessage>
                  )}
                </FormControl>
              )}
              <FormControl mt={4} isRequired isInvalid={isQuantityError}>
                <FormLabel>Quantity</FormLabel>
                <NumberInput
                  min={1}
                  value={quantity}
                  clampValueOnBlur={false}
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
              {props.isPublished ? (
                <></>
              ) : (
                <>
                  <FormControl mt={4} isRequired isInvalid={isHargaError}>
                    <FormLabel>Harga</FormLabel>
                    <NumberInput
                      min={1}
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
                    {errors.image && (
                      <FormErrorMessage>
                        {errors.image.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                mr={3}
                color={'white'}
                backgroundColor={'green.500'}
                _hover={{ backgroundColor: 'green.800' }}
                type='submit'
                isLoading={loading}
                onClick={(e) =>
                  void editMerch(namaProduk, quantity, harga, file, e)
                }
              >
                Edit
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
    </Td>
  );
}
