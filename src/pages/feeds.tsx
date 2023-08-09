import {
    Flex,
    Box,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Text,
    FormErrorMessage,
    FormControl,
    Textarea,
    Center,
    HStack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverFooter,
    Input,
    Tag,
    TagLabel,
    TagCloseButton,
    Icon,
    BoxProps
} from '@chakra-ui/react';
import Layout from '~/layout/index';
import { type SubmitHandler, useForm } from 'react-hook-form';
import React, { BaseSyntheticEvent, ChangeEvent, ChangeEventHandler, useState, forwardRef } from 'react';
import { Header } from '~/components/Header';
import { SlOptions, SlPencil, SlPicture, SlTrash } from 'react-icons/sl';

interface FeedProps {
    postId: string;
    content: string;
    url: string;
    img: string;
    time: string;
}

const PopoverBox = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
    return (
        <Box ref={ref} {...props}>
            {props.children}
        </Box>
    );
});

export default function Feeds() {
    const { register, formState, handleSubmit, reset } = useForm<FeedProps>({
        mode: 'onSubmit',
        defaultValues: {
            postId: '',
            time: '',
            content: '',
            url: '',
            img: '',
        }
    });


    const { isOpen: isPostOpen, onOpen: onPostOpen, onClose: onPostClose } = useDisclosure();
    const { isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    const getTimeLabel = (timestamp: string): string => {
        const currentTime = new Date();
        const uploadTime = new Date(timestamp);
        const timeDifference = (currentTime.getTime() - uploadTime.getTime()) / (1000 * 60);

        if (timeDifference < 60) {
            return `Baru diunggah ${Math.floor(timeDifference)} menit yang lalu`;
        } else if (timeDifference < 1440) {
            return `Diunggah ${Math.floor(timeDifference / 60)} jam yang lalu`;
        } else {
            return `Diunggah ${Math.floor(timeDifference / 1440)} hari yang lalu`;
        }
    };


    // SIMPEN DATA FEEDS
    const [dataPost, setDataPost] = useState<FeedProps[]>([]);


    // INSERT URL (TO DO: upload handlers)
    const [isAttachImg, setIsAttachImg] = useState<boolean>(false);
    const handleIsAttachImg = () => {
        reset({ img: '' })
        if (isAttachImg === true) {
            setIsAttachImg(false);
        } else {
            setIsAttachImg(true);
        }
    }

    // POST FEEDS (TO DO: Submit handlers)
    const submitcontent: SubmitHandler<FeedProps> = (data: FeedProps) => {
        const newId = Math.random().toString(36).substr(2, 9);
        const currentTime = new Date().toISOString();
        setDataPost([...dataPost, { ...data, postId: newId, time: currentTime, img: 'gambar.jpg' }]);
        console.log('feed data: ', data);
        reset();
        setIsAttachImg(false);
        onPostClose();
        onEditClose();
    };


    // EDIT FEEDS (TO DO: Edit handler)
    const handleSubmitEdit = (id: string) => {};

    const handleSaveEdit = () => {
        setIsAttachImg(false);

    };
    const handleCancelEdit = () => {
        reset();
        setIsAttachImg(false);
    };


    // HAPUS FEEDS (TO DO: Remove handlers)
    const [itemToDeleteIndex, setItemToDeleteIndex] = useState('');
    const handleDelete = (itemId: string) => {
        const newDataPost = dataPost.filter(item => item.postId !== itemId);
        setDataPost(newDataPost);
        onRemoveClose();
    };

    console.log(dataPost)

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
                    {/* ========== Post Form ========== */}
                    <Box px='1.5rem' py='1rem' borderBottom='1px solid #CBD2E0'>
                        <Button variant='solidBlue' onClick={onPostOpen}>
                            Add Post
                        </Button>
                        <Modal blockScrollOnMount={true} isOpen={isPostOpen} onClose={onPostClose} size='4xl'>
                            <ModalOverlay />
                            <ModalContent>
                                <form
                                    onSubmit={(e: BaseSyntheticEvent) =>
                                        void handleSubmit(submitcontent)(e)
                                    }
                                >
                                    <ModalHeader width='100%' mx='auto' borderBottom='1px solid #CBD2E0'>
                                        <ModalCloseButton pos='absolute' left='0' onClick={() => { reset(), handleIsAttachImg() }} />
                                        <Center>
                                            Add New Post
                                        </Center>
                                    </ModalHeader>
                                    <ModalBody>
                                        <FormControl isInvalid={!!formState.errors.url}>
                                            <Text> URL</Text>
                                            <Input
                                                variant='solidLight'
                                                border={formState.errors.url ? '1px solid red' : '1px solid black'}
                                                {...register('url', {
                                                    required: {
                                                        value: true,
                                                        message: 'URL is required'
                                                    }
                                                })}
                                            />
                                            {formState.errors.url && (
                                                <FormErrorMessage>
                                                    {' '}
                                                    {formState.errors.url.message as string}{' '}
                                                </FormErrorMessage>
                                            )}
                                        </FormControl>
                                        <FormControl isInvalid={!!formState.errors.content} mt='1rem'>
                                            <Text>content</Text>
                                            <Textarea
                                                variant='unstyled'
                                                border={formState.errors.url ? '1px solid red' : '1px solid black'}
                                                px='0.5rem'
                                                py='0.25rem'
                                                width='100%'
                                                bgColor='white'
                                                focusBorderColor='none'
                                                borderRadius='8px'
                                                height='400px'
                                                {...register('content', {
                                                    required: {
                                                        value: true,
                                                        message: 'content is required'
                                                    }
                                                })}
                                            />
                                            {formState.errors.content && (
                                                <FormErrorMessage>
                                                    {' '}
                                                    {formState.errors.content.message as string}{' '}
                                                </FormErrorMessage>
                                            )}
                                        </FormControl>
                                        {
                                            isAttachImg ?
                                                (
                                                    <Tag
                                                        mt='8px'
                                                    >
                                                        <TagLabel
                                                            {...register('url')}
                                                        >Image.jpg</TagLabel>
                                                        <TagCloseButton onClick={handleIsAttachImg} />
                                                    </Tag>
                                                )
                                                : ''
                                        }
                                    </ModalBody>
                                    <ModalFooter borderTop='1px solid #CBD2E0'>
                                        <Flex width='100%' justifyContent='space-between' alignItems='center'>
                                            <Icon as={SlPicture} boxSize={8} onClick={handleIsAttachImg} cursor='pointer' />
                                            <Button variant='solidBlue' type='submit'>Post</Button>
                                        </Flex>
                                    </ModalFooter>
                                </form>
                            </ModalContent>
                        </Modal>
                    </Box>
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
                        {dataPost && dataPost.slice(0).reverse().map((item, index) => (
                            <Box key={index} px='1.5rem' borderTop='1px solid #CBD2E0'>
                                <Box float='right' my='1rem' cursor='pointer'>
                                    <Popover placement='bottom-end' autoFocus={false}>
                                        <PopoverTrigger>
                                            <PopoverBox>

                                                <Icon as={SlOptions} boxSize={6} fill='gray.300' />
                                            </PopoverBox>
                                        </PopoverTrigger>
                                        <PopoverContent width='fit-content' borderColor='#000' zIndex='100000'>
                                            <PopoverHeader onClick={() => { handleSubmitEdit(item.postId), onEditOpen() }} borderColor='#000'>
                                                <HStack>
                                                    <Icon as={SlPencil} boxSize={6} />
                                                    <Text>Edit</Text>
                                                    {/* ========== Edit Form ========== */}
                                                    <Modal blockScrollOnMount={true} isOpen={isEditOpen} onClose={onEditClose} size='4xl'>
                                                        <ModalContent>
                                                            <form
                                                            onSubmit={(e: BaseSyntheticEvent) =>
                                                                void handleSubmit(submitcontent)(e)
                                                            }
                                                            >
                                                                <ModalHeader width='100%' mx='auto' borderBottom='1px solid #CBD2E0'>
                                                                    <ModalCloseButton pos='absolute' left='0' onClick={() => { setIsAttachImg(false), (false), handleCancelEdit() }} />
                                                                    <Center>
                                                                        Edit Post
                                                                    </Center>
                                                                </ModalHeader>
                                                                <ModalBody>
                                                                    <FormControl isInvalid={!!formState.errors.url}>
                                                                        <Text> URL</Text>
                                                                        <Input
                                                                            variant='solidLight'
                                                                            border={formState.errors.url ? '1px solid red' : '1px solid black'}
                                                                            {...register('url', {
                                                                                required: {
                                                                                    value: true,
                                                                                    message: 'URL is required'
                                                                                }
                                                                            })}
                                                                            placeholder=''
                                                                            value=''
                                                                            // onChange={}
                                                                        />
                                                                        {formState.errors.url && (
                                                                            <FormErrorMessage>
                                                                                {' '}
                                                                                {formState.errors.url.message as string}{' '}
                                                                            </FormErrorMessage>
                                                                        )}
                                                                    </FormControl>
                                                                    <FormControl isInvalid={!!formState.errors.content} mt='1rem'>
                                                                        <Text>content</Text>
                                                                        <Textarea
                                                                            variant='unstyled'
                                                                            border={formState.errors.url ? '1px solid red' : '1px solid black'}
                                                                            px='0.5rem'
                                                                            py='0.25rem'
                                                                            width='100%'
                                                                            bgColor='white'
                                                                            focusBorderColor='none'
                                                                            borderRadius='8px'
                                                                            height='400px'
                                                                            {...register('content', {
                                                                                required: {
                                                                                    value: true,
                                                                                    message: 'content is required'
                                                                                }
                                                                            })}
                                                                            placeholder=''
                                                                            value=''
                                                                            // onChange={}
                                                                        />
                                                                        {formState.errors.content && (
                                                                            <FormErrorMessage>
                                                                                {' '}
                                                                                {formState.errors.content.message as string}{' '}
                                                                            </FormErrorMessage>
                                                                        )}
                                                                    </FormControl>
                                                                    {item.img ? (<Tag
                                                                        mt='8px'
                                                                    >
                                                                        {item.img}
                                                                        <TagCloseButton onClick={handleIsAttachImg} />
                                                                    </Tag>) : ''}
                                                                </ModalBody>
                                                                <ModalFooter borderTop='1px solid #CBD2E0'>
                                                                    <Flex width='100%' justifyContent='space-between' alignItems='center'>
                                                                        <Box onClick={handleIsAttachImg}>
                                                                            <Icon as={SlPicture} boxSize={8} onClick={handleIsAttachImg} cursor='pointer' />
                                                                        </Box>
                                                                        <Button variant='solidBlue' onClick={handleSaveEdit} type='submit'>Confirm</Button>
                                                                    </Flex>
                                                                </ModalFooter>
                                                            </form>
                                                        </ModalContent>
                                                    </Modal>
                                                </HStack>
                                            </PopoverHeader>
                                            <PopoverFooter >
                                                {/* ========== Delete Form ========== */}
                                                <HStack onClick={() => {
                                                    setItemToDeleteIndex(item.postId);
                                                    onRemoveOpen();
                                                }} >
                                                    <Icon as={SlTrash} boxSize={6} />
                                                    <Text>Remove</Text>
                                                </HStack>
                                                <Modal isOpen={isRemoveOpen} onClose={onRemoveClose}>
                                                    <ModalContent>
                                                        <ModalHeader>Are you sure to delete this feed?</ModalHeader>
                                                        <ModalFooter>
                                                            <Button variant='outlineBlue' mr={3} onClick={() => { setItemToDeleteIndex(''), onRemoveClose() }}>
                                                                Cancel
                                                            </Button>
                                                            <Button variant='solidBlue' onClick={() => handleDelete(itemToDeleteIndex)}>
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
                                        <Text mr='1rem'>{getTimeLabel(item.time)}</Text>
                                    </Flex>
                                    <Text>
                                        {item.content}
                                    </Text>
                                    <HStack>
                                        <Tag>{item.url}</Tag>
                                        {
                                            item.img ? (<Tag>{item.img}</Tag>) : ''
                                        }
                                    </HStack>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}