import Layout from '~/layout/index';
import {
  Text,
  Flex,
  Textarea,
  Input,
  Spacer,
  Button,
  FormErrorMessage,
  FormControl
} from '@chakra-ui/react';
import { Header } from '~/components/Header';
import React, { type BaseSyntheticEvent, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Markdown } from '~/components/Markdown';

interface FormValue {
  title: string;
  body: string;
  featureImage: string;
}

export default function AddArticle() {
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  const { register, formState, getValues, handleSubmit } = useForm<FormValue>({
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      body: '',
      featureImage: ''
    }
  });

  const handlePreviewMode: React.MouseEventHandler<HTMLButtonElement> = () =>
    setIsPreviewMode(!isPreviewMode);

  const submitArticle: SubmitHandler<FormValue> = (data: FormValue) => {
    // TO DO : submit
    console.log('submit article', data);
  };

  return (
    <Layout type='admin' title='Article Management' fullBg={true}>
      <Header title='Article CMS' />

      <form
        onSubmit={(e: BaseSyntheticEvent) =>
          void handleSubmit(submitArticle)(e)
        }
      >
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
            {!isPreviewMode ? (
              <>
                <Button
                  variant={'outlineBlue'}
                  marginRight='10px'
                  type='submit'
                >
                  Confirm
                </Button>
                <Button variant={'solidBlue'}>Cancel</Button>
              </>
            ) : (
              <Button onClick={handlePreviewMode}>Back</Button>
            )}
          </Flex>
        </Flex>
      </form>
    </Layout>
  );
}
