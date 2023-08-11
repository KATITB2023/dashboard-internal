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
  Link,
  Image,
  Box
} from '@chakra-ui/react';
import { Header } from '~/components/Header';
import React, { useState, useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { api, type RouterInputs } from '~/utils/api';
import { TRPCError } from '@trpc/server';
import { uploadFile, sanitizeURL } from '~/utils/file';
import ReactHtmlParser from 'react-html-parser';
import { useRouter } from 'next/router';

interface FormValue {
  title: string;
  body: string;
  featureImage: FileList;
}

export default function EditArticle() {
  const toast = useToast();
  const router = useRouter();
  const { id } = router.query;
  const articleId: string = id as string;
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const editArticleMutation = api.cms.adminEditArticle.useMutation();
  const getArticlesByIdMutation = api.cms.adminGetArticlesById.useQuery({
    id: articleId
  });
  const articleData = getArticlesByIdMutation.data;

  const { register, formState, getValues, handleSubmit, reset, setValue } =
    useForm<FormValue>({
      mode: 'onSubmit',
      defaultValues: {
        title: articleData?.title,
        body: articleData?.html as string,
        featureImage: undefined
      }
    });

  useEffect(() => {
    setValue('title', articleData?.title as string);
    setValue('body', articleData?.html as string);
    setSelectedImage(articleData?.feature_image as string);
  }, [articleData, setValue]);

  const handlePreviewMode: React.MouseEventHandler<HTMLButtonElement> = () =>
    setIsPreviewMode(!isPreviewMode);

  const handleDrop: React.DragEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile) return;
      setFile(droppedFile);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(URL.createObjectURL(e.target.files[0] as Blob));
    }
  };

  const submitArticle: SubmitHandler<FormValue> = async (
    data: FormValue,
    event
  ) => {
    event?.preventDefault();
    try {
      let imagePath = articleData?.feature_image as string;
      if (data.featureImage && data.featureImage[0]) {
        console.log('hii');
        const fileName = `article-feature-img-${data.featureImage[0].name.replace(
          ' ',
          ''
        )}`;
        imagePath = sanitizeURL(`https://cdn.oskmitb.com/article/${fileName}`);
        await uploadFile(imagePath, data.featureImage[0]);
      }

      const payload: RouterInputs['cms']['adminEditArticle'] = {
        articleId: id as string,
        title: data.title,
        body: data.body,
        featureImage: imagePath
      };

      const res = await editArticleMutation.mutateAsync(payload);

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
  };

  useEffect(() => {
    if (file) {
      console.log('tes');
      try {
        const handleUploadFile = async () => {
          const fileName = `article-${file.name.replace(' ', '')}`;
          const imagePath = sanitizeURL(
            `https://cdn.oskmitb.com/article/${fileName}`
          );

          await uploadFile(imagePath, file);
          const imgHtml = `<img src=${imagePath} alt=${fileName} width='500px'/>`;
          setValue('body', getValues('body') + imgHtml);
          setFile(null);
        };
        void handleUploadFile();
      } catch (err) {
        console.log(err);
      }
    }
  });

  return (
    <Layout type='admin' title='Article Management' fullBg={true}>
      <Header title='Edit Article' />
      <Flex marginY='10px'>
        <Spacer />
        <Button onClick={handlePreviewMode}>
          {isPreviewMode ? 'Back' : 'Preview'}
        </Button>
      </Flex>
      {isPreviewMode && <Image src={selectedImage} alt='selected image' />}
      <form onSubmit={(e) => void handleSubmit(submitArticle)(e)}>
        <Flex direction='column'>
          <Flex alignItems='center'>
            <Text
              fontFamily='SomarRounded-Bold'
              fontSize='42px'
              marginRight='16px'
            >
              {isPreviewMode ? getValues('title') : 'Headline:'}
            </Text>
            {!isPreviewMode && (
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
            )}
          </Flex>

          {!isPreviewMode && (
            <Flex>
              <Text minWidth='220px'>Reupload Feature Image</Text>
              <FormControl isInvalid={!!formState.errors.featureImage}>
                <Input
                  type='file'
                  accept='image/*'
                  variant='unstyled'
                  display={isPreviewMode ? 'none' : undefined}
                  {...register('featureImage', {
                    required: {
                      value: true,
                      message: 'Feature Image tidak boleh kosong'
                    },
                    validate: (value) => {
                      const file: File | undefined = value[0];
                      if (
                        file &&
                        file.name.split('.')[1] !== 'png' &&
                        file.name.split('.')[1] !== 'jpeg'
                      ) {
                        return 'Gambar harus berupa .png atau .jpeg';
                      }
                      return true;
                    }
                  })}
                  onChange={(e) => handleImageChange(e)}
                />
                {formState.errors.featureImage && (
                  <FormErrorMessage>
                    {formState.errors.featureImage.message as string}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Flex>
          )}

          {isPreviewMode ? (
            <Box>{ReactHtmlParser(getValues('body'))}</Box>
          ) : (
            <>
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
                  onDrop={handleDrop}
                />

                {formState.errors.body && (
                  <FormErrorMessage>
                    {' '}
                    {formState.errors.body.message as string}{' '}
                  </FormErrorMessage>
                )}
              </FormControl>
              <Flex justifyContent='flex-end' marginY='8'>
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
              </Flex>
            </>
          )}
        </Flex>
      </form>
    </Layout>
  );
}
