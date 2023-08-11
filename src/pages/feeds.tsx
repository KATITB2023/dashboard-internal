import {
    Flex,
    Box,
    Button,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Text,
    HStack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverFooter,
    Tag,
    Icon,
    BoxProps,
    useToast
} from '@chakra-ui/react';
import Layout from '~/layout/index';
import { useForm } from 'react-hook-form';
import React, { ChangeEvent, useState, forwardRef } from 'react';
import { Header } from '~/components/Header';
import { SlOptions, SlTrash } from 'react-icons/sl';
import { deleteFile } from '~/utils/file';
import { api } from '~/utils/api';
import AddFeed from './add-feed';
import EditFeed from './edit-feed';
import { TRPCError } from '@trpc/server';

export interface FeedProps {
    id: number;
    content: string;
    url?: string | undefined;
    filePath?: any;
}

const PopoverBox = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
    return (
        <Box ref={ref} {...props}>
            {props.children}
        </Box>
    );
});

export default function Feeds() {
    const toast = useToast();
    const { reset, setValue, getValues } = useForm<FeedProps>({
        mode: 'onSubmit',
        defaultValues: {
            id: undefined,
            content: '',
            url: '',
        }
    });

    const { isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose } = useDisclosure();
    const getFeedsList = api.feeds.adminGetFeeds.useQuery();
    const deleteFeed = api.feeds.adminDeleteFeed.useMutation()
    const feedsList = getFeedsList.data

    const handleDelete = (idValue: number) => {
        setValue('id', idValue)
    }

    const handleSubmitDelete = async (itemId: number, url: string | null) => {
        try {
            deleteFeed.mutate({ feedId: itemId });
            if(url){
                await deleteFile(url);  
            }
        } catch (error) {
            console.log(error);
        }
        reset();
        onRemoveClose();
    };

    const getTimeLabel = (timestamp: Date): string => {
        const currentTime = new Date();
        const uploadTime = new Date(timestamp);
        const timeDifference = (currentTime.getTime() - uploadTime.getTime()) / (1000 * 60);

        if (timeDifference < 60) {
            return `Diunggah ${Math.floor(timeDifference)} menit yang lalu`;
        } else if (timeDifference < 1440) {
            return `Diunggah ${Math.floor(timeDifference / 60)} jam yang lalu`;
        } else {
            return `Diunggah ${Math.floor(timeDifference / 1440)} hari yang lalu`;
        }
    };

    return (
        <Layout type='admin' title='Feeds' fullBg={true}>
            <Box width='100%'>
                <Header title='Feeds' />
                <Box
                    mt='1.5rem'
                    bgColor='#ffffff'
                    border='1px solid #CBD2E0'
                    borderRadius='8px'
                >
                    <AddFeed />
                    {/* ========== content List ========== */}
                    <Box overflowY='auto' width='100%' maxHeight='600px'
                        css={{
                            '&::-webkit-scrollbar': {
                                width: '4px',
                            },
                            '&::-webkit-scrollbar-track': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#2D3648',
                                borderRadius: '24px',
                            },
                        }}
                    >
                        {feedsList?.slice()
                            .sort((b, a) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((item, index: number) => (
                                <Box key={index} px='1.5rem' borderTop='1px solid #CBD2E0'>
                                    <Box float='right' my='1rem' cursor='pointer'>
                                        <Popover placement='bottom-end' autoFocus={false}>
                                            <PopoverTrigger>
                                                <PopoverBox>
                                                    <Icon as={SlOptions} boxSize={6} fill='gray.300' />
                                                </PopoverBox>
                                            </PopoverTrigger>
                                            <PopoverContent width='fit-content' borderColor='#000' zIndex='100000'>
                                                <PopoverHeader borderColor='#000'>
                                                    <EditFeed id={item.id} content={item.text} url={item.attachmentUrl!} />
                                                </PopoverHeader>
                                                <PopoverFooter >
                                                    <HStack onClick={() => {
                                                        handleDelete(item.id);
                                                        onRemoveOpen();
                                                    }} >
                                                        <Icon as={SlTrash} boxSize={6} />
                                                        <Text>Remove</Text>
                                                    </HStack>
                                                    <Modal isOpen={isRemoveOpen} onClose={onRemoveClose}>
                                                        <ModalContent>
                                                            <ModalHeader>Are you sure to delete this feed?</ModalHeader>
                                                            <ModalFooter>
                                                                <Button variant='outlineBlue' mr={3} onClick={onRemoveClose}>
                                                                    Cancel
                                                                </Button>
                                                                <Button variant='solidBlue' onClick={() => handleSubmitDelete(getValues('id'), item.attachmentUrl)}>
                                                                    Confirm
                                                                </Button>
                                                            </ModalFooter>
                                                        </ModalContent>
                                                    </Modal>
                                                </PopoverFooter>
                                            </PopoverContent>
                                        </Popover>
                                    </Box>
                                    <Box py='1rem'>
                                        <Flex justifyContent='space-between' alignItems='center'>
                                            <Text fontSize='2xl' fontWeight='700'>OSKM ITB 2023</Text>
                                            <Text mr='1rem'>{getTimeLabel(item.createdAt)}</Text>
                                        </Flex>
                                        <Text>
                                            {item.text}
                                        </Text>
                                        {
                                            item.attachmentUrl && (
                                                <Tag>{item.attachmentUrl}</Tag>
                                            )
                                        }
                                    </Box>
                                </Box>
                            ))}
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}