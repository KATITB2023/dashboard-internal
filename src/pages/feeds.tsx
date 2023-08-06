import {
    Flex,
    Box,
    Image,
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
    CloseButton,
    Tag,
    TagLabel,
    TagCloseButton
} from '@chakra-ui/react';
import Layout from '~/layout/index';
import { type SubmitHandler, useForm, Controller } from 'react-hook-form';
import React, { BaseSyntheticEvent, ChangeEvent, ChangeEventHandler, useState } from 'react';
import { Header } from '~/components/Header';
import { motion } from 'framer-motion';

const FadeUpBox = motion(Box);

interface FeedProps {
    postId: string;
    article: string;
    urlLink: string;
    imageUrl: string;
    time: string;
}

interface DeleteFeedModalProps {
    isRemoveOpen: boolean;
    onRemoveClose: () => void;
    onConfirmDelete: () => void;
    onCancelDelete: () => void;
}

const DeleteFeedModal: React.FC<DeleteFeedModalProps> = ({
    isRemoveOpen,
    onRemoveClose,
    onConfirmDelete,
    onCancelDelete,
}) => {
    return (
        <Modal isOpen={isRemoveOpen} onClose={onRemoveClose}>
            <ModalContent>
                <ModalHeader>Are you sure you want to delete this feed?</ModalHeader>
                <ModalFooter>
                    <Button variant='outlineBlue' mr={3} onClick={onCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant='solidBlue' onClick={onConfirmDelete}>
                        Confirm
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default function Feeds() {
    const { register, formState, getValues, handleSubmit, setValue, reset } = useForm<FeedProps>({
        mode: 'onSubmit',
        defaultValues: {
            postId: '',
            time: '',
            article: '',
            imageUrl: '',
            urlLink: '',
        }
    });


    const { isOpen: isPostOpen, onOpen: onPostOpen, onClose: onPostClose } = useDisclosure();
    const { isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [editId, setEditId] = useState<string | null>(null);
    const [editedArticle, setEditedArticle] = useState('');
    const [editedUrl, setEditedUrl] = useState('');
    console.log('Edited feed: ', editedArticle);
    console.log('Edited url: ', editedUrl);

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
    const [attachment, setAttachment] = useState<string>('')
    console.log('Attachment: ', attachment);
    const [isAttachUrl, setIsAttachUrl] = useState<boolean>(false);
    const [isAttachImg, setIsAttachImg] = useState<boolean>(false);
    const handleIsAttachUrl = () => {
        reset({ urlLink: '' })
        if (isAttachUrl === true) {
            setIsAttachUrl(false);
        } else {
            setIsAttachUrl(true);
        }
    }
    const handleIsAttachImg = () => {
        reset({ imageUrl: '' })
        if (isAttachImg === true) {
            setIsAttachImg(false);
        } else {
            setIsAttachImg(true);
        }
    }
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAttachment(event.target.value)
    }

    // POST FEEDS (TO DO: Submit handlers)
    const submitArticle: SubmitHandler<FeedProps> = (data: FeedProps) => {
        const urlData = attachment
        const newId = Math.random().toString(36).substr(2, 9);
        const currentTime = new Date().toISOString();
        setDataPost([...dataPost, { ...data, postId: newId, time: currentTime, urlLink: urlData }]);
        console.log('submit article', data);
        reset();
        setIsAttachUrl(false);
        setIsAttachImg(false);
        onPostClose();
        onEditClose();
    };


    // EDIT FEEDS (TO DO: Edit handler)
    const handlePostEdit = (id: string) => {
        const postToEdit = dataPost.find(post => post.postId === id);
        if (postToEdit) {
            setEditId(id);
            setEditedArticle(postToEdit.article);
            setEditedUrl(postToEdit.urlLink);
        }
    };

    const handleSaveEdit = () => {
        if (editId !== null) {
            setDataPost(prevData =>
                prevData.map(post =>
                    post.postId === editId
                        ? { ...post, article: editedArticle, urlLink: editedUrl }
                        : post
                )
            );
            setEditId(null);
            setEditedArticle('');
            setEditedUrl('');
        }
        setAttachment('');
        setIsAttachUrl(false);
        setIsAttachImg(false);
        onEditClose();
    };
    const handleCancelEdit = () => {
        reset();
        setEditId(null);
        setEditedArticle('');
        setEditedUrl('');
        setIsAttachUrl(false);
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
                                        void handleSubmit(submitArticle)(e)
                                    }
                                >
                                    <ModalHeader width='100%' mx='auto' borderBottom='1px solid #CBD2E0'>
                                        <ModalCloseButton pos='absolute' left='0' onClick={() => { reset(), handleIsAttachImg(), handleIsAttachUrl() }} />
                                        <Center>
                                            Add New Post
                                        </Center>
                                    </ModalHeader>
                                    <ModalBody>
                                        <FormControl isInvalid={!!formState.errors.article}>
                                            <Textarea
                                                placeholder='Add article here...'
                                                width='100%'
                                                height='400px'
                                                border='1px solid black'
                                                _hover={{ border: '1px solid black' }}
                                                focusBorderColor='none'
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
                                        {
                                            isAttachImg ?
                                                (
                                                    <Tag
                                                        mt='8px'
                                                    >
                                                        <TagLabel
                                                            {...register('imageUrl')}
                                                        >Image.jpg</TagLabel>
                                                        <TagCloseButton onClick={handleIsAttachImg} />
                                                    </Tag>
                                                )
                                                : ''
                                        }
                                        {
                                            isAttachUrl ?
                                                (
                                                    <FadeUpBox
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.2, delay: 0 }}
                                                    >
                                                        <Text
                                                            mt='8px'
                                                        >URL:</Text>
                                                        <HStack>
                                                            <Input
                                                                variant='unstyled'
                                                                px='0.5rem'
                                                                py='0.25rem'
                                                                width='100%'
                                                                bgColor='white'
                                                                border='1px solid black'
                                                                focusBorderColor='none'
                                                                borderRadius='8px'
                                                                placeholder='Input URL...'
                                                                size='sm'
                                                                value={attachment}
                                                                {...register('urlLink')}
                                                                onChange={handleInputChange}
                                                            />
                                                            <CloseButton onClick={handleIsAttachUrl} />
                                                        </HStack>
                                                    </FadeUpBox>
                                                ) : ''
                                        }
                                    </ModalBody>
                                    <ModalFooter borderTop='1px solid #CBD2E0'>
                                        <Flex width='100%' justifyContent='space-between' alignItems='center'>
                                            <HStack width='100px' cursor='pointer'>
                                                <Box onClick={handleIsAttachImg}>
                                                    <Image src='/img/uploadImg.svg' />
                                                </Box>
                                                <Box onClick={handleIsAttachUrl}>
                                                    <Image src='/img/attachment.svg' />
                                                </Box>
                                            </HStack>
                                            <Button variant='solidBlue' type='submit'>Post</Button>
                                        </Flex>
                                    </ModalFooter>
                                </form>
                            </ModalContent>
                        </Modal>
                    </Box>
                    {/* ========== Article List ========== */}
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
                                            <Image src='/img/tripple.svg' />
                                        </PopoverTrigger>
                                        <PopoverContent width='fit-content' borderColor='#000'>
                                            <PopoverHeader onClick={() => { handlePostEdit(item.postId), onEditOpen() }} borderColor='#000'>
                                                <HStack>
                                                    <Image src='/img/edit.svg' width='30px' />
                                                    <Text>Edit</Text>
                                                    {/* ========== Edit Form ========== */}
                                                    <Modal blockScrollOnMount={true} isOpen={isEditOpen} onClose={onEditClose} size='4xl'>
                                                        <ModalContent>
                                                            <form
                                                            // onSubmit={(e: BaseSyntheticEvent) =>
                                                            //     void handleSubmit(submitArticle)(e)
                                                            // }
                                                            >
                                                                <ModalHeader width='100%' mx='auto' borderBottom='1px solid #CBD2E0'>
                                                                    <ModalCloseButton pos='absolute' left='0' onClick={() => { setIsAttachImg(false), setIsAttachUrl(false), handleCancelEdit() }} />
                                                                    <Center>
                                                                        Edit Post
                                                                    </Center>
                                                                </ModalHeader>
                                                                <ModalBody>
                                                                    <FormControl isInvalid={!!formState.errors.article}>
                                                                        <Textarea
                                                                            itemType='text'
                                                                            // value={item.article}
                                                                            width='100%'
                                                                            height='400px'
                                                                            border='1px solid black'
                                                                            _hover={{ border: '1px solid black' }}
                                                                            focusBorderColor='none'
                                                                            {...register('article', {
                                                                                required: {
                                                                                    value: true,
                                                                                    message: 'Artikel tidak boleh kosong'
                                                                                },
                                                                            })}
                                                                            autoFocus={true}
                                                                            value={editedArticle}
                                                                            onChange={e => setEditedArticle(e.target.value)}
                                                                        />
                                                                        {formState.errors.article && (
                                                                            <FormErrorMessage>
                                                                                {' '}
                                                                                {formState.errors.article.message as string}{' '}
                                                                            </FormErrorMessage>
                                                                        )}
                                                                    </FormControl>
                                                                    {item.imageUrl ? (<Tag
                                                                        mt='8px'
                                                                    >
                                                                        <TagLabel
                                                                            {...register('imageUrl')}
                                                                        >{item.imageUrl}</TagLabel>
                                                                        <TagCloseButton onClick={handleIsAttachImg} />
                                                                    </Tag>) : ''}
                                                                    <Text
                                                                        mt='8px'
                                                                    >URL:</Text>
                                                                    <HStack>
                                                                        <Input
                                                                            variant='unstyled'
                                                                            px='0.5rem'
                                                                            py='0.25rem'
                                                                            width='100%'
                                                                            bgColor='white'
                                                                            border='1px solid black'
                                                                            focusBorderColor='none'
                                                                            borderRadius='8px'
                                                                            placeholder='Input URL...'
                                                                            size='sm'
                                                                            value={editedUrl}
                                                                            {...register('urlLink')}
                                                                            onChange={e => setEditedUrl(e.target.value)}
                                                                        />
                                                                        <CloseButton onClick={handleIsAttachUrl} />
                                                                    </HStack>
                                                                </ModalBody>
                                                                <ModalFooter borderTop='1px solid #CBD2E0'>
                                                                    <Flex width='100%' justifyContent='space-between' alignItems='center'>
                                                                        <HStack width='100px' cursor='pointer'>
                                                                            <Box onClick={handleIsAttachImg}>
                                                                                <Image src='/img/uploadImg.svg' />
                                                                            </Box>
                                                                            <Box onClick={handleIsAttachUrl}>
                                                                                <Image src='/img/attachment.svg' />
                                                                            </Box>
                                                                        </HStack>
                                                                        <Button variant='solidBlue' onClick={handleSaveEdit}>Confirm</Button>
                                                                    </Flex>
                                                                </ModalFooter>
                                                            </form>
                                                        </ModalContent>
                                                    </Modal>
                                                </HStack>
                                            </PopoverHeader>
                                            <PopoverFooter >
                                                {/* ========== Delete Form ========== */}
                                                <HStack>
                                                    <Image src='/img/delete.svg' width='30px' />
                                                    <Text onClick={() => {
                                                        setItemToDeleteIndex(item.postId);
                                                        onRemoveOpen();
                                                    }}>Remove</Text>
                                                    <DeleteFeedModal
                                                        isRemoveOpen={isRemoveOpen}
                                                        onRemoveClose={onRemoveClose}
                                                        onConfirmDelete={() => {
                                                            handleDelete(itemToDeleteIndex);
                                                        }}
                                                        onCancelDelete={() => {
                                                            onRemoveClose();
                                                            setItemToDeleteIndex('');
                                                        }}
                                                    />
                                                </HStack>
                                            </PopoverFooter>
                                        </PopoverContent>
                                    </Popover>
                                </Box>
                                <Box py='1rem'>
                                    <Flex justifyContent='space-between' alignItems='center'>
                                        <Text fontSize='2xl' fontWeight='700'>OSKM ITB 2023</Text>
                                        <Text>{getTimeLabel(item.time)}</Text>
                                    </Flex>
                                    <Text>
                                        {item.article}
                                    </Text>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}