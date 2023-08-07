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
  Box
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { FiArrowLeft, FiArrowRight, FiChevronRight } from 'react-icons/fi';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

export default function ArticleCMS() {
  const markdownContent = `
# This is a level 1 heading (h1)

## This is a level 2 heading (h2)

### This is a level 3 heading (h3)

#### This is a level 4 heading (h4)

##### This is a level 5 heading (h5)

###### This is a level 6 heading (h6)
`;

  const handleDeleteArticle = () => {
    // TO DO : delete
    console.log('delete article');
  };

  const handleEditArticle = () => {
    // TO DO : submit
    console.log('edit article');
  };

  return (
    <Layout type='admin' title='Article CMS' fullBg={true}>
      <Header title='Article CMS' />
      <InputGroup my='4'>
        <Input
          variant='outline'
          size='md'
          placeholder='Search'
          width='48'
          borderColor='gray.400'
          borderRadius='12'
        />
        <InputLeftElement pointerEvents='none'>
          <FaSearch />
        </InputLeftElement>
      </InputGroup>
      <Flex alignItems='center' justifyContent='flex-start'>
        <InputGroup width='24' size='sm'>
          <Input
            variant='outline'
            borderColor='gray.400'
            borderRadius='12'
            mr='2'
          />
          <InputRightElement pointerEvents='none'>
            <FiChevronRight />
          </InputRightElement>
        </InputGroup>
        <Text> records per page</Text>
      </Flex>
      {/* component */}
      <Box
        border='2px solid'
        p='3'
        borderRadius='md'
        my='2'
        borderColor='gray.300'
        height='180'
      >
        <Text fontFamily='SomarRounded-Bold'> Hi 123</Text>
        <Box height='110' overflow='hidden' fontSize='sm'>
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </Box>
        <Flex
          textDecoration='underline'
          justifyContent='flex-end'
          fontSize='sm'
        >
          <Text mx='2' cursor='pointer' onClick={handleEditArticle}>
            Edit
          </Text>
          <Text mx='2' cursor='pointer' onClick={handleDeleteArticle}>
            Remove
          </Text>
        </Flex>
      </Box>

      <Flex alignItems='center' justifyContent='flex-end'>
        <Button variant='outlineBlue'>
          <FiArrowLeft />
        </Button>
        <Select
          placeholder=''
          width='20'
          borderColor='gray.400'
          size='sm'
          borderRadius='12'
          mx='2'
        >
          <option value='option1'>1</option>
          <option value='option2'>2</option>
          <option value='option3'>3</option>
        </Select>
        <Button variant='outlineBlue'>
          <FiArrowRight />
        </Button>
      </Flex>
    </Layout>
  );
}
