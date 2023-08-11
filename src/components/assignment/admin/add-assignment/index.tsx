import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast
} from '@chakra-ui/react';
import { AssignmentType } from '@prisma/client';
import { type RouterInputs, api } from '~/utils/api';
import { type SubmitHandler, useForm, Controller } from 'react-hook-form';
import { type BaseSyntheticEvent, useState } from 'react';
import { sanitizeURL, uploadFile } from '~/utils/file';
import moment from 'moment';
import { TRPCClientError } from '@trpc/client';

interface FormValues {
  title: string;
  type: AssignmentType;
  startTime: string;
  endTime: string;
  description: string;
  filePath: FileList;
}
export default function AddAssignment() {
  const toast = useToast();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
    reset
  } = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      type: 'MANDATORY',
      startTime: undefined,
      endTime: undefined,
      description: undefined,
      filePath: undefined
    }
  });

  const [loading, setLoading] = useState(false);

  const addAssignment = api.assignment.adminAddNewAssignment.useMutation();

  const submitAddNewAssignment: SubmitHandler<FormValues> = async (
    data: FormValues
  ) => {
    setLoading(true);
    try {
      let additionalFilePath = '';

      if (data.filePath[0]) {
        const fileName = `assignment-${data.title}-${data.type}`;
        const extension = data.filePath[0]?.name.split('.').pop() as string;
        additionalFilePath = `https://cdn.oskmitb.com/assignment-description/${fileName}.${extension}`;
        await uploadFile(sanitizeURL(additionalFilePath), data.filePath[0]);
      }

      const payload: RouterInputs['assignment']['adminAddNewAssignment'] = {
        title: data.title,
        type: data.type,
        startTime: new Date(
          moment(data.startTime, 'YYYY-MM-DD HH:mm').toDate()
        ),
        endTime: new Date(moment(data.endTime, 'YYYY-MM-DD HH:mm').toDate()),
        description: data.description,
        filePath: additionalFilePath
      };

      const result = await addAssignment.mutateAsync(payload);
      toast({
        title: 'Success',
        description: result.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      reset();
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

  return (
    <form
      onSubmit={(e: BaseSyntheticEvent) =>
        void handleSubmit(submitAddNewAssignment)(e)
      }
    >
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
              <FormErrorMessage>{errors.title.message}</FormErrorMessage>
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
                      {type.includes('_') ? type.split('_').join(' ') : type}
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
          <FormControl>
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
                    onChange={(e) => setValue('startTime', e.target.value)}
                    size={{ base: 'sm', md: 'md' }}
                  ></Input>
                  <Input
                    type='time'
                    color={'white'}
                    onChange={(e) =>
                      setValue(
                        'startTime',
                        getValues('startTime') + ' ' + e.target.value
                      )
                    }
                    size={{ base: 'sm', md: 'md' }}
                    width={'50%'}
                  ></Input>
                </Flex>
              )}
            />

            {errors.startTime && (
              <FormErrorMessage>{errors.startTime.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl>
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
                    onChange={(e) => setValue('endTime', e.target.value)}
                    size={{ base: 'sm', md: 'md' }}
                  ></Input>
                  <Input
                    type='time'
                    color={'white'}
                    onChange={(e) =>
                      setValue(
                        'endTime',
                        getValues('endTime') + ' ' + e.target.value
                      )
                    }
                    size={{ base: 'sm', md: 'md' }}
                    width={'50%'}
                  ></Input>
                </Flex>
              )}
            />

            {errors.endTime && (
              <FormErrorMessage>{errors.endTime.message}</FormErrorMessage>
            )}
          </FormControl>
        </Flex>
        <FormControl>
          <FormLabel>Deskripsi Tugas</FormLabel>
          <Textarea
            rows={6}
            color={'white'}
            placeholder='Masukkan deskripsi'
            {...register('description')}
          ></Textarea>
          {errors.description && (
            <FormErrorMessage>{errors.description.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl>
          <FormLabel>File Terkait</FormLabel>
          <Input type='file' variant='unstyled' {...register('filePath')} />
          {errors.filePath && (
            <FormErrorMessage>{errors.filePath.message}</FormErrorMessage>
          )}
        </FormControl>
        <Button
          isLoading={loading}
          loadingText='Saving...'
          placeSelf={'end'}
          type='submit'
        >
          Save
        </Button>
      </VStack>
    </form>
  );
}
