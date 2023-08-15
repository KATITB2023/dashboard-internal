import {
  Flex,
  Box,
  Text,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
  Tag,
  Icon,
  type BoxProps
} from '@chakra-ui/react';
import { AlertModal } from '~/components/AlertModal';
import Layout from '~/layout/index';
import { useForm } from 'react-hook-form';
import React, { useState, forwardRef, useEffect } from 'react';
import { Header } from '~/components/Header';
import { SlOptions, SlTrash } from 'react-icons/sl';
import { deleteFile } from '~/utils/file';
import { api } from '~/utils/api';
import AddFeed from '~/components/feeds/add-feed';
import EditFeed from '~/components/feeds/edit-feed';
import { withSession } from '~/server/auth/withSession';
import AdminRoute from '~/layout/AdminRoute';
import { useSession } from 'next-auth/react';

export const getServerSideProps = withSession({ force: true });

export interface FeedProps {
  id: number;
  content: string;
  url?: string;
  filePath?: FileList;
}

// eslint-disable-next-line react/display-name
const PopoverBox = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return (
    <Box ref={ref} {...props}>
      {props.children}
    </Box>
  );
});

export default function Feeds() {
  const { data: session } = useSession();
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const { reset, setValue, getValues } = useForm<FeedProps>({
    mode: 'onSubmit',
    defaultValues: {
      id: undefined,
      content: '',
      url: ''
    }
  });

  const getFeedsList = api.feeds.adminGetFeeds.useQuery();
  const deleteFeed = api.feeds.adminDeleteFeed.useMutation();
  const [fetchCount, setFetchCount] = useState<number>(0);
  const feedsList = getFeedsList.data;
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const increment = () => {
    setFetchCount(fetchCount + 1);
  };
  useEffect(() => {
    if (shouldRefetch) {
      const delay = 500;
      const timeoutId = setTimeout(() => {
        void getFeedsList.refetch();
        setShouldRefetch(false);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [shouldRefetch, getFeedsList]);

  useEffect(() => {
    setShouldRefetch(true);
  }, [fetchCount]);

  const handleDelete = (idValue: number) => {
    setShowAlertModal(true);
    setValue('id', idValue);
  };

  const handleSubmitDelete = async (itemId: number, url: string | null) => {
    try {
      deleteFeed.mutate({ feedId: itemId });
      if (url) {
        await deleteFile(url);
      }
    } catch (error) {
      console.log(error);
    }
    setShowAlertModal(false);
    setFetchCount(fetchCount + 1);
    reset();
  };

  const getTimeLabel = (timestamp: Date): string => {
    const currentTime = new Date();
    const uploadTime = new Date(timestamp);
    const timeDifference =
      (currentTime.getTime() - uploadTime.getTime()) / (1000 * 60);

    if (timeDifference < 60) {
      return `Diunggah ${Math.floor(timeDifference)} menit yang lalu`;
    } else if (timeDifference < 1440) {
      return `Diunggah ${Math.floor(timeDifference / 60)} jam yang lalu`;
    } else {
      return `Diunggah ${Math.floor(timeDifference / 1440)} hari yang lalu`;
    }
  };

  return (
    <AdminRoute session={session}>
      <Layout type='admin' title='Feeds' fullBg={false}>
        <Box width='100%'>
          <Header title='Feeds' />
          <Box
            mt='1.5rem'
            bgColor='#ffffff'
            border='1px solid #CBD2E0'
            borderRadius='8px'
          >
            <AddFeed feedChange={increment} />
            {/* ========== content List ========== */}
            <Box
              overflowY='auto'
              width='100%'
              maxHeight='600px'
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px'
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#2D3648',
                  borderRadius: '24px'
                }
              }}
            >
              {feedsList
                ?.slice()
                .sort(
                  (b, a) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((item, index: number) => (
                  <Box key={index} px='1.5rem' borderTop='1px solid #CBD2E0'>
                    <Box float='right' my='1rem' cursor='pointer'>
                      <Popover placement='bottom-end' autoFocus={false}>
                        <PopoverTrigger>
                          <PopoverBox>
                            <Icon as={SlOptions} boxSize={6} fill='gray.300' />
                          </PopoverBox>
                        </PopoverTrigger>
                        <PopoverContent
                          width='fit-content'
                          borderColor='#000'
                          zIndex='100000'
                        >
                          <PopoverHeader borderColor='#000'>
                            <EditFeed
                              id={item.id}
                              content={item.text}
                              url={item?.attachmentUrl as string}
                              feedChange={increment}
                            />
                          </PopoverHeader>
                          <PopoverFooter>
                            <HStack
                              onClick={() => {
                                handleDelete(item.id);
                              }}
                            >
                              <Icon as={SlTrash} boxSize={6} />
                              <Text>Remove</Text>
                            </HStack>
                            <AlertModal
                              title='Delete Feed'
                              content='Are you sure you want to delete this feed?'
                              isOpen={showAlertModal}
                              onYes={() =>
                                void handleSubmitDelete(
                                  getValues('id'),
                                  item.attachmentUrl
                                )
                              }
                              onNo={() => setShowAlertModal(false)}
                            />
                          </PopoverFooter>
                        </PopoverContent>
                      </Popover>
                    </Box>
                    <Box py='1rem'>
                      <Flex justifyContent='space-between' alignItems='center'>
                        <Text fontSize='2xl' fontWeight='700'>
                          OSKM ITB 2023
                        </Text>
                        <Text mr='1rem'>{getTimeLabel(item.createdAt)}</Text>
                      </Flex>
                      <Text>{item.text}</Text>
                      {item.attachmentUrl && <Tag>{item.attachmentUrl}</Tag>}
                    </Box>
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>
      </Layout>
    </AdminRoute>
  );
}
