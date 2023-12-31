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
  VStack,
  Flex,
  FormLabel,
  Select,
  FormErrorMessage,
  Textarea,
  Text,
  useToast
} from '@chakra-ui/react';
import { MdEdit } from 'react-icons/md';
import { type Assignment, AssignmentType } from '@prisma/client';
import { type SubmitHandler, useForm, Controller } from 'react-hook-form';
import { type BaseSyntheticEvent, useState } from 'react';
import { sanitizeURL, uploadFile } from '~/utils/file';
import moment from 'moment';
import { type RouterInputs, api } from '~/utils/api';
import DeleteAssignmentModal from './DeleteAssignmentModal';
import { TRPCClientError } from '@trpc/client';

interface FormValues {
  title: string;
  type: AssignmentType;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  filePath: FileList;
}

interface Props {
  props: Assignment;
  emit: () => void;
}

export default function EditAssignmentModal({ props, emit }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      title: props.title,
      type: props.type,
      startDate: undefined,
      startTime: undefined,
      endDate: undefined,
      endTime: undefined,
      description: props.description ? props.description : '',
      filePath: undefined
    }
  });

  const [loading, setLoading] = useState(false);

  const editAssignment = api.assignment.adminEditAssignment.useMutation();

  const submitEditAssignment: SubmitHandler<FormValues> = async (
    data: FormValues
  ) => {
    setLoading(true);
    try {
      let additionalFilePath = '';

      if (data.filePath[0]) {
        const fileName = `assignment-${data.title.split(' ').join('-')}-${
          data.type
        }`;
        const extension = data.filePath[0]?.name.split('.').pop() as string;
        additionalFilePath = sanitizeURL(
          `https://cdn.oskmitb.com/assignment-description/${fileName}.${extension}`
        );
        await uploadFile(additionalFilePath, data.filePath[0]);
      }

      const payload: RouterInputs['assignment']['adminEditAssignment'] = {
        assignmentId: props.id,
        title: data.title,
        type: data.type,
        startTime: new Date(
          moment(
            data.startDate + ' ' + data.startTime,
            'YYYY-MM-DD HH:mm'
          ).toDate()
        ),
        endTime: new Date(
          moment(data.endDate + ' ' + data.endTime, 'YYYY-MM-DD HH:mm').toDate()
        ),
        description: data.description,
        filePath: additionalFilePath.length > 0 ? additionalFilePath : undefined
      };

      const result = await editAssignment.mutateAsync(payload);
      toast({
        title: 'Success',
        description: result.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      closeModal();
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
    setLoading(false);
  };

  const openModal = () => {
    setValue(
      'startDate',
      moment(new Date(props.startTime).toISOString()).format('YYYY-MM-DD')
    );
    setValue(
      'startTime',
      moment(new Date(props.startTime).toISOString()).format('hh:mm')
    );
    setValue(
      'endDate',
      moment(new Date(props.endTime).toISOString()).format('YYYY-MM-DD')
    );
    setValue(
      'endTime',
      moment(new Date(props.endTime).toISOString()).format('hh:mm')
    );
    onOpen();
  };

  const closeModal = () => {
    reset();
    emit();
    onClose();
  };

  return (
    <Td w='10%'>
      <Button variant='outline' onClick={openModal}>
        <MdEdit fontSize='2rem' />
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} size={'3xl'} isCentered>
        <ModalOverlay />
        <form
          onSubmit={(e: BaseSyntheticEvent) =>
            void handleSubmit(submitEditAssignment)(e)
          }
        >
          <ModalContent>
            <ModalHeader>{props.title}</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <VStack spacing={4}>
                <Flex width={'full'} columnGap={'2rem'}>
                  <FormControl isInvalid={!!errors.title}>
                    <FormLabel>Judul Tugas</FormLabel>
                    <Input
                      type='text'
                      placeholder='Masukkan nama tugas'
                      {...register('title', {
                        required: 'Nama tugas tidak boleh kosong'
                      })}
                      color={'white'}
                      size={{ base: 'sm', md: 'md' }}
                    />
                    {errors.title && (
                      <FormErrorMessage>
                        {errors.title.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.type}>
                    <FormLabel>Jenis Tugas</FormLabel>
                    <Controller
                      control={control}
                      name='type'
                      rules={{
                        required: {
                          value: true,
                          message: 'Jenis tugas tidak boleh kosong'
                        }
                      }}
                      render={() => (
                        <Select
                          variant='filled'
                          bg='gray.600'
                          color='white'
                          w='full'
                          borderColor='gray.400'
                          defaultValue={props.type}
                          onChange={(e) =>
                            setValue(
                              'type',
                              AssignmentType[
                                e.target.value as keyof typeof AssignmentType
                              ]
                            )
                          }
                          transition='all 0.2s ease-in-out'
                          _hover={{
                            opacity: 0.8
                          }}
                          _focus={{
                            background: 'gray.600',
                            borderColor: 'gray.400',
                            color: 'white'
                          }}
                          css={{
                            option: {
                              background: '#2F2E2E'
                            }
                          }}
                        >
                          {Object.values(AssignmentType).map((type, index) => (
                            <option
                              style={{
                                background: 'gray.600',
                                color: 'white'
                              }}
                              key={index}
                              value={type}
                            >
                              {type.includes('_')
                                ? type.split('_').join(' ')
                                : type}
                            </option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.type && (
                      <FormErrorMessage>{errors.type.message}</FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>
                <Flex width={'full'} columnGap={'2rem'}>
                  <FormControl isInvalid={!!errors.startTime}>
                    <FormLabel>Mulai</FormLabel>
                    <Controller
                      control={control}
                      name='startTime'
                      rules={{
                        required: {
                          value: true,
                          message: 'Waktu awal harus ada'
                        }
                      }}
                      render={() => (
                        <Flex columnGap={'1rem'}>
                          <Input
                            type='date'
                            color={'white'}
                            size={{ base: 'sm', md: 'md' }}
                            {...register('startDate')}
                          ></Input>
                          <Input
                            type='time'
                            color={'white'}
                            size={{ base: 'sm', md: 'md' }}
                            width={'50%'}
                            {...register('startTime')}
                          ></Input>
                        </Flex>
                      )}
                    />

                    {errors.startTime && (
                      <FormErrorMessage>
                        {errors.startTime.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={!!errors.endTime}>
                    <FormLabel>Selesai</FormLabel>
                    <Controller
                      control={control}
                      name='endTime'
                      rules={{
                        required: {
                          value: true,
                          message: 'Waktu selesai harus ada'
                        }
                      }}
                      render={() => (
                        <Flex columnGap={'1rem'}>
                          <Input
                            type='date'
                            color={'white'}
                            size={{ base: 'sm', md: 'md' }}
                            {...register('endDate')}
                          ></Input>
                          <Input
                            type='time'
                            color={'white'}
                            size={{ base: 'sm', md: 'md' }}
                            width={'50%'}
                            {...register('endTime')}
                          ></Input>
                        </Flex>
                      )}
                    />

                    {errors.endTime && (
                      <FormErrorMessage>
                        {errors.endTime.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>
                <FormControl isInvalid={!!errors.description}>
                  <FormLabel>Deskripsi Tugas (Opsional)</FormLabel>
                  <Textarea
                    rows={6}
                    color={'white'}
                    placeholder='Masukkan deskripsi'
                    {...register('description')}
                  ></Textarea>
                  {errors.description && (
                    <FormErrorMessage>
                      {errors.description.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.filePath}>
                  <FormLabel>File Terkait (Opsional)</FormLabel>
                  <Input
                    type='file'
                    variant='unstyled'
                    {...register('filePath')}
                  />
                  {errors.filePath && (
                    <FormErrorMessage>
                      {errors.filePath.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter columnGap={4}>
              <DeleteAssignmentModal
                id={props.id}
                title={props.title}
                emit={() => emit()}
              />
              <Button
                variant={'outline'}
                isLoading={loading}
                loadingText='Saving...'
                type='submit'
              >
                <Flex columnGap={'0.5rem'} alignItems={'center'}>
                  <Text>Edit</Text>
                  <MdEdit fontSize='1.5rem' />
                </Flex>
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Td>
  );
}
