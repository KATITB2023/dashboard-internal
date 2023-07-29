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
import { useState } from 'react';

export default function ArticleManagement() {
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  const handlePreviewMode: React.MouseEventHandler<HTMLButtonElement> = () =>
    setIsPreviewMode(!isPreviewMode);

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

        <Flex direction='column'>
          <Flex alignItems='center'>
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
            />
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
              />
            </Flex>
            <Spacer />
            <Button onClick={handlePreviewMode}>Preview</Button>
          </Flex>
          <Textarea
            isDisabled={isPreviewMode}
            placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
            marginY='8'
            height='300px'
            borderColor='gray.300'
            borderWidth='2px'
          />
          <Flex justifyContent='flex-end'>
            <Button variant={'outline'} marginRight='10px'>
              Confirm
            </Button>
            <Button>Cancel</Button>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}
