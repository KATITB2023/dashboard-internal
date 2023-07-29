import Layout from '~/layout/index';
import {
  Text,
  Box,
  Flex,
  Textarea,
  Input,
  Spacer,
  Button,
  FormErrorMessage,
  FormControl
} from '@chakra-ui/react';
import { type BaseSyntheticEvent, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

interface FormValue {
  headline: string;
  keyword: string;
  article: string;
  imageUrl: string;
}

export default function ArticleManagement() {
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  const { register, formState, getValues, handleSubmit } = useForm<FormValue>({
    mode: 'onSubmit',
    defaultValues: {
      headline: '',
      keyword: '',
      article: '',
      imageUrl: ''
    }
  });

  const handlePreviewMode: React.MouseEventHandler<HTMLButtonElement> = () =>
    setIsPreviewMode(!isPreviewMode);

  const submitArticle: SubmitHandler<FormValue> = (data: FormValue) => {
    // TO DO : submit
    console.log('submit article', data);
  };

  return (
    <Layout title='Article Management'>
      <Box
        bg='white'
        p={12}
        boxShadow='md'
        height='92vh'
        width='full'
        borderLeftRadius='3xl'
      >
        <Flex direction='column'>
          {/* nanti bakal diganti header  */}
          <Text>Dashboard</Text>
          <Text>Article CMS</Text>
        </Flex>

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
                  {getValues('headline')}
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
                  <FormControl isInvalid={!!formState.errors.headline}>
                    <Input
                      isDisabled={isPreviewMode}
                      borderColor='gray.300'
                      borderWidth='2px'
                      {...register('headline', {
                        required: {
                          value: true,
                          message: 'Headline tidak boleh kosong'
                        }
                      })}
                    />
                    {formState.errors.headline && (
                      <FormErrorMessage>
                        {' '}
                        {formState.errors.headline.message as string}{' '}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </>
              )}
            </Flex>
            <Flex marginTop='10px'>
              <Flex alignItems='center'>
                <Text
                  fontFamily='SomarRounded-Regular'
                  fontSize='28px'
                  marginRight='16px'
                >
                  Keyword:
                </Text>
                <FormControl isInvalid={!!formState.errors.keyword}>
                  <Input
                    isDisabled={isPreviewMode}
                    borderColor='gray.300'
                    borderWidth='2px'
                    {...register('keyword', {
                      required: {
                        value: true,
                        message: 'Keyword tidak boleh kosong'
                      }
                    })}
                  />
                  {formState.errors.keyword && (
                    <FormErrorMessage>
                      {' '}
                      {formState.errors.keyword.message as string}{' '}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <Spacer />
              {!isPreviewMode && (
                <Button onClick={handlePreviewMode}>Preview</Button>
              )}
            </Flex>
            <FormControl isInvalid={!!formState.errors.article}>
              <Textarea
                isDisabled={isPreviewMode}
                placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
                marginTop='4'
                height='300px'
                borderColor='gray.300'
                borderWidth='2px'
                {...register('article', {
                  required: {
                    value: true,
                    message: 'Artikel tidak boleh kosong'
                  }
                })}
              />
              {formState.errors.article && (
                <FormErrorMessage>
                  {' '}
                  {formState.errors.article.message as string}{' '}
                </FormErrorMessage>
              )}
            </FormControl>
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
      </Box>
    </Layout>
  );
}
