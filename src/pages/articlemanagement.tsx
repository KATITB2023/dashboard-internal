import Layout from '~/layout/index';
import {
  Text,
  Box,
  Flex,
  Textarea,
  Input,
  Spacer,
  Button
} from '@chakra-ui/react';
import { type BaseSyntheticEvent, useState } from 'react';
import { type SubmitHandler, useForm, Controller } from 'react-hook-form';

interface FormValue {
  headline: string;
  keyword: string;
  article: string;
  imageUrl: string;
}

export default function ArticleManagement() {
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  const { control, register, formState, setValue, getValues, handleSubmit } =
    useForm<FormValue>({
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
                  <Input
                    isDisabled={isPreviewMode}
                    borderColor='gray.300'
                    borderWidth='2px'
                    {...register('headline')}
                  />
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
                <Input
                  isDisabled={isPreviewMode}
                  borderColor='gray.300'
                  borderWidth='2px'
                  {...register('keyword')}
                />
              </Flex>
              <Spacer />
              {!isPreviewMode && (
                <Button onClick={handlePreviewMode}>Preview</Button>
              )}
            </Flex>
            <Textarea
              isDisabled={isPreviewMode}
              placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
              marginY='8'
              height='300px'
              borderColor='gray.300'
              borderWidth='2px'
              {...register('article')}
            />
            <Flex justifyContent='flex-end'>
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
