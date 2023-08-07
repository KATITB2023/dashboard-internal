import Layout from '~/layout/index';
import {
  Text,
  Flex,
  Textarea,
  Input,
  Spacer,
  Button,
  FormErrorMessage,
  FormControl,
  useToast,
  Link
} from '@chakra-ui/react';
import { Header } from '~/components/Header';
import React, { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Markdown } from '~/components/Markdown';
import { api } from '~/utils/api';
import { TRPCError } from '@trpc/server';
// import { useRouter } from "next/router";

interface FormValue {
  title: string;
  body: string;
  featureImage: string;
}

// TO DO:
// belum handle feature image
// markdownnya belum bs resize image hadeh

export default function AddArticle() {
  const toast = useToast();
  // const router = useRouter();
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const addNewArticleMutation = api.cms.adminAddNewArticle.useMutation();

  const { register, formState, getValues, handleSubmit, reset } =
    useForm<FormValue>({
      mode: 'onSubmit',
      defaultValues: {
        title: '',
        body: '',
        featureImage:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9hxIGIRPVvvpnSQjDGNI0undzKEHbVYvWe-7bvt9W4A&s'
      }
    });

  const handlePreviewMode: React.MouseEventHandler<HTMLButtonElement> = () =>
    setIsPreviewMode(!isPreviewMode);

  const submitArticle: SubmitHandler<FormValue> = async (
    data: FormValue,
    event
  ) => {
    event?.preventDefault();
    try {
      const res = await addNewArticleMutation.mutateAsync(data);
      toast({
        title: 'Success',
        status: 'success',
        description: res.message,
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      reset();
    } catch (error: unknown) {
      if (!(error instanceof TRPCError)) throw error;
      toast({
        title: 'Failed',
        status: 'error',
        description: error.message,
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
    }
    // void router.push("/article-cms");
  };

  return (
    <Layout type='admin' title='Article Management' fullBg={true}>
      <Header title='Article CMS' />

      <form onSubmit={(e) => void handleSubmit(submitArticle)(e)}>
        <Flex direction='column'>
          <Flex alignItems='center'>
            {isPreviewMode ? (
              <Text
                fontFamily='SomarRounded-Bold'
                fontSize='42px'
                marginRight='16px'
              >
                {getValues('title')}
              </Text>
            ) : (
              <>
                <Text
                  fontFamily='SomarRounded-Bold'
                  fontSize='42px'
                  marginRight='16px'
                >
                  Headline:
                </Text>
                <FormControl isInvalid={!!formState.errors.title}>
                  <Input
                    isDisabled={isPreviewMode}
                    borderColor='gray.300'
                    borderWidth='2px'
                    variant='outline'
                    size='md'
                    {...register('title', {
                      required: {
                        value: true,
                        message: 'Headline tidak boleh kosong'
                      }
                    })}
                  />
                  {formState.errors.title && (
                    <FormErrorMessage>
                      {' '}
                      {formState.errors.title.message as string}{' '}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </>
            )}
          </Flex>
          <Flex marginTop='10px'>
            <Spacer />
            {!isPreviewMode && (
              <Button onClick={handlePreviewMode}>Preview</Button>
            )}
          </Flex>
          {isPreviewMode ? (
            <Markdown body={getValues('body')} />
          ) : (
            <FormControl isInvalid={!!formState.errors.body}>
              <Textarea
                placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
                marginTop='4'
                height='300px'
                borderColor='gray.300'
                borderWidth='2px'
                {...register('body', {
                  required: {
                    value: true,
                    message: 'Artikel tidak boleh kosong'
                  }
                })}
              />

              {formState.errors.body && (
                <FormErrorMessage>
                  {' '}
                  {formState.errors.body.message as string}{' '}
                </FormErrorMessage>
              )}
            </FormControl>
          )}
          <Flex justifyContent='flex-end' marginY='8'>
            {!isPreviewMode && (
              <>
                <Button
                  variant={'outlineBlue'}
                  marginRight='10px'
                  type='submit'
                >
                  Confirm
                </Button>
                <Link href='/article-cms'>
                  <Button variant={'solidBlue'}>Cancel</Button>
                </Link>
              </>
            )}

            {isPreviewMode && <Button onClick={handlePreviewMode}>Back</Button>}
          </Flex>
        </Flex>
      </form>
    </Layout>
  );
}
