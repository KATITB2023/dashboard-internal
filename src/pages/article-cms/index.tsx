import Layout from '~/layout/index';
import { Header } from '~/components/Header';
import {
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Flex,
  Select,
  Button,
  Box,
  useToast,
  Link
} from '@chakra-ui/react';
import { AlertModal } from '~/components/AlertModal';
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { api } from '~/utils/api';
import { TRPCError } from '@trpc/server';
import ReactHtmlParser from 'react-html-parser';
import { useRouter } from 'next/router';
import { withSession } from '~/server/auth/withSession';
import { TRPCClientError } from '@trpc/client';
import AdminRoute from '~/layout/AdminRoute';
import { useSession } from 'next-auth/react';

export const getServerSideProps = withSession({ force: true });

export default function ArticleCMS() {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [recordsNum, setRecordsNum] = useState<number>(5);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const options = Array.from({ length: totalPages }, (_, index) => index + 1);
  const getArticlesListQuery = api.cms.adminGetArticlesList.useQuery({
    currentPage: currentPageNum,
    limitPerPage: recordsNum,
    searchQuery: searchQuery
  });
  const deleteArticleMutation = api.cms.adminDeleteArticle.useMutation();
  const articlesList = getArticlesListQuery.data;

  const handleSearchQueryChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => setSearchQuery(e.target.value);
  const handleRecordsNumChange: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => setRecordsNum(parseInt(e.target.value));
  const handleCurrentPageNumChange: React.ChangeEventHandler<
    HTMLSelectElement
  > = (e) => setCurrentPageNum(parseInt(e.target.value));
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPageNum(page);
    }
  };

  useEffect(() => {
    void getArticlesListQuery.refetch();
  }, [totalRecords]);

  useEffect(() => {
    setTotalPages(articlesList?.meta.pagination.pages as number);
    setTotalRecords(articlesList?.meta.pagination.total as number);
  }, [articlesList]);

  const handleClickDelete = (id: string) => {
    setShowAlertModal(true);
    setSelectedId(id);
  };

  const handleDeleteArticle = async () => {
    try {
      const res = await deleteArticleMutation.mutateAsync({
        articleId: selectedId
      });

      toast({
        title: 'Success',
        status: 'success',
        description: res.message,
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      setTotalRecords(totalRecords - 1);
    } catch (error: unknown) {
      if (!(error instanceof TRPCError || error instanceof TRPCClientError))
        throw error;

      toast({
        title: 'Failed',
        status: 'error',
        description: error.message,
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
    }
    setShowAlertModal(false);
  };

  const handleEditArticle = (slug: string) => {
    void router.push(`/article-cms/edit/${slug}`);
  };

  return (
    <AdminRoute session={session}>
      <Layout type='admin' title='Article CMS' fullBg={false}>
        <Header title='Article CMS' />
        <Flex>
          <InputGroup my='4'>
            <Input
              variant='outline'
              size='md'
              placeholder='Search'
              width='48'
              borderColor='gray.400'
              borderRadius='12'
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
            <InputLeftElement pointerEvents='none'>
              <FaSearch />
            </InputLeftElement>
          </InputGroup>
          <Link href='/article-cms/add'>
            <Button>Add Article</Button>
          </Link>
        </Flex>
        <Flex alignItems='center' justifyContent='flex-start'>
          <Select
            placeholder=''
            width='20'
            borderColor='gray.400'
            size='sm'
            borderRadius='12'
            mx='2'
            value={recordsNum}
            onChange={handleRecordsNumChange}
          >
            <option value={5} selected>
              5
            </option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </Select>
          <Text> records per page</Text>
        </Flex>

        <Flex
          height='400'
          flexDirection='column'
          paddingRight='10'
          marginBottom='8'
        >
          {articlesList?.data.map((article, index: number) => {
            return (
              <Box
                border='2px solid'
                p='3'
                borderRadius='md'
                my='2'
                borderColor='gray.300'
                height='180'
                key={index}
              >
                <Text fontFamily='SomarRounded-Bold'> {article.title}</Text>
                <Box
                  height='108px'
                  overflow='hidden'
                  textOverflow='ellipsis'
                  whiteSpace='pre-line'
                  fontSize='sm'
                >
                  {ReactHtmlParser(article.html as string)}
                </Box>
                <Flex
                  textDecoration='underline'
                  justifyContent='flex-end'
                  fontSize='sm'
                >
                  <Text
                    mx='2'
                    cursor='pointer'
                    onClick={() => void handleEditArticle(article.slug)}
                  >
                    Edit
                  </Text>
                  <Text
                    mx='2'
                    cursor='pointer'
                    onClick={() => void handleClickDelete(article.id)}
                  >
                    Remove
                  </Text>
                  <AlertModal
                    title='Delete Article'
                    content='Are you sure you want to delete this article?'
                    isOpen={showAlertModal}
                    onYes={() => void handleDeleteArticle()}
                    onNo={() => setShowAlertModal(false)}
                  />
                </Flex>
              </Box>
            );
          })}
          <Flex alignItems='center' justifyContent='flex-end' pb={5}>
            {currentPageNum != 1 && (
              <Button
                variant='outlineBlue'
                onClick={() => handlePageChange(currentPageNum - 1)}
              >
                <FiArrowLeft />
              </Button>
            )}
            <Select
              placeholder=''
              width='20'
              borderColor='gray.400'
              size='sm'
              borderRadius='12'
              mx='2'
              value={currentPageNum}
              onChange={handleCurrentPageNumChange}
            >
              {options.map((page) => (
                <option key={page} value={page}>
                  {page}
                </option>
              ))}
            </Select>
            {currentPageNum != totalPages && (
              <Button
                variant='outlineBlue'
                onClick={() => handlePageChange(currentPageNum + 1)}
              >
                <FiArrowRight />
              </Button>
            )}
          </Flex>
        </Flex>
      </Layout>
    </AdminRoute>
  );
}
