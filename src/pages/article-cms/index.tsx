import Layout from '~/layout/index';
import { Header } from '~/components/Header';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  Flex,
  Select,
  Button,
  Box,
  useToast,
  Link
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FiArrowLeft, FiArrowRight, FiChevronRight } from 'react-icons/fi';
import { api } from '~/utils/api';
import { TRPCError } from '@trpc/server';
import ReactHtmlParser from 'react-html-parser';
import { useRouter } from 'next/router';

export default function ArticleCMS() {
  const toast = useToast();
  const router = useRouter();
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [recordsNum, setRecordsNum] = useState<number>(3);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
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
  const handleRecordsNumChange: React.ChangeEventHandler<HTMLInputElement> = (
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

  const handleDeleteArticle = async (id: string) => {
    try {
      const res = await deleteArticleMutation.mutateAsync({
        articleId: id
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

  const handleEditArticle = (id: string) => {
    void router.push(`/article-cms/edit/${id}`);
  };

  return (
    <Layout type='admin' title='Article CMS' fullBg={true}>
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
        <InputGroup width='24' size='sm'>
          <Input
            variant='outline'
            borderColor='gray.400'
            borderRadius='12'
            mr='2'
            value={recordsNum}
            onChange={handleRecordsNumChange}
            defaultValue={3}
          />
          <InputRightElement pointerEvents='none'>
            <FiChevronRight />
          </InputRightElement>
        </InputGroup>
        <Text> records per page</Text>
      </Flex>

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
                onClick={() => void handleEditArticle(article.id)}
              >
                Edit
              </Text>
              <Text
                mx='2'
                cursor='pointer'
                onClick={() => void handleDeleteArticle(article.id)}
              >
                Remove
              </Text>
            </Flex>
          </Box>
        );
      })}

      <Flex alignItems='center' justifyContent='flex-end'>
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
    </Layout>
  );
}