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
import { type SubmitHandler, useForm, Controller } from 'react-hook-form';
import { type BaseSyntheticEvent, useState } from 'react';
import { sanitizeURL, uploadFile } from '~/utils/file';
import { type RouterInputs, api } from '~/utils/api';
import { TRPCClientError } from '@trpc/client';

interface FormValues {
  name: string;
  price: number;
  stock: number;
  image: FileList;
  isPublished: boolean;
}

interface Props {
  props: Merchandise;
}

type FieldType = 'name' | 'price' | 'stock' | 'isPublished' | 'image';

export default function EditMerchModal({ props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const toast = useToast();
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
      name: props.name,
      price: props.price,
      stock: props.stock,
      isPublished: props.isPublished,
      image: undefined
    }
  });

  const editMerchMutation = api.merch.editMerch.useMutation();

  const editMerch: SubmitHandler<FormValues> = async (data: FormValues) => {
    let additionalFilePath = '';

    if (data.image && data.image[0]) {
      const fileName = data.image[0]?.name;
      additionalFilePath = sanitizeURL(
        `https://cdn.oskmitb.com/merch-images/${fileName}`
      );
      await uploadFile(additionalFilePath, data.image[0]);
    }

    const payload: RouterInputs['merch']['editMerch'] = {
      merchId: props.id,
      name: data.name,
      price: parseInt(data.price.toString()),
      stock: parseInt(data.stock.toString()),
      image: additionalFilePath
    };
    try {
      await editMerchMutation.mutateAsync(payload);
      toast({
        title: 'Merch edited',
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

  return (
    <Td w='10%'>
      <Button variant='outline' onClick={onOpen}>
        <MdEdit fontSize='1.5rem' />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={(e: BaseSyntheticEvent) =>
              void handleSubmit(editMerch)(e)
            }
          >
            <ModalHeader>Edit merch</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {props.isPublished ? (
                <></>
              ) : (
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
              )}
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
              {props.isPublished ? (
                <></>
              ) : (
                <>
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
                  <FormControl
                    mt={4}
                    flexDirection={'row'}
                    isInvalid={!!errors.image}
                  >
                    <FormLabel>Foto produk (Opsional)</FormLabel>
                    <input type='file' {...register('image')} />
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
