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
    Divider,
    Text,
    FormErrorMessage,
    FormControl,
    Textarea,
    Center,
    HStack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverHeader,
    PopoverFooter,
} from '@chakra-ui/react';
import Layout from '~/layout/index';
import { type SubmitHandler, useForm, Controller } from 'react-hook-form';
import { BaseSyntheticEvent, useState } from 'react';

interface FeedProps {
    postId: string;
    article: string;
    imageUrl: string;
    time: string;
}


export default function Feeds() {
    const { isOpen: isPostOpen, onOpen: onPostOpen, onClose: onPostClose } = useDisclosure();
    const { isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    const [dataPost, setDataPost] = useState<FeedProps[]>([]);
    const [itemToDeleteIndex, setItemToDeleteIndex] = useState('');

    const { register, formState, getValues, handleSubmit, setValue, reset, control } = useForm<FeedProps>({
        mode: 'onSubmit',
        defaultValues: {
            article: '',
            imageUrl: ''
        }
    });

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

    const submitArticle: SubmitHandler<FeedProps> = (data: FeedProps) => {
        // TO DO : submit article
        const newId = Math.random().toString(36).substr(2, 9);
        const currentTime = new Date().toISOString();
        setDataPost([...dataPost, { ...data, time: currentTime, postId: newId }]);
        console.log('submit article', data);
        setValue('article', '');
        onPostClose();
    };

    const handleEdit = () => {
        // TO DO: Edit article
    }

    const handleDelete = (itemId: string) => {
        const newDataPost = dataPost.filter(item => item.postId !== itemId);
        setDataPost(newDataPost);
        onRemoveClose();
    };

    console.log(dataPost)

    return (
        <Layout type='admin' title='Feeds' fullBg={true}>
            <Box width='100%'>
                <Image src='/img/feeds.svg' />
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
                                        <ModalCloseButton pos='absolute' left='0' onClick={() => reset()} />
                                        <Center>
                                            Add New Post
                                        </Center>
                                    </ModalHeader>
                                    <Divider colorScheme="red" size="20px" />
                                    <ModalBody>
                                        <FormControl isInvalid={!!formState.errors.article}>
                                            <Textarea
                                                placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
                                                width='100%'
                                                height='400px'
                                                border='none'
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
                                    </ModalBody>
                                    <ModalFooter borderTop='1px solid #CBD2E0'>
                                        <Flex width='100%' justifyContent='space-between' alignItems='center'>
                                            <HStack width='120px'>
                                                <Box>
                                                    <Image src='/img/uploadImg.svg' />
                                                </Box>
                                                <Box>
                                                    <Image src='/img/uploadTripple.svg' />
                                                </Box>
                                                <Box>
                                                    <Image src='/img/uploadEmot.svg' />
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
                    <Box overflowY='auto' width='100%' maxHeight='600px'>
                        {dataPost && dataPost.slice(0).reverse().map((item, index) => (
                            <Box key={index} px='1.5rem' borderTop='1px solid #CBD2E0'>
                                <Box float='right' my='1rem' cursor='pointer'>
                                    <Popover placement='bottom-end' autoFocus={false}>
                                        <PopoverTrigger>
                                            <Image src='/img/tripple.svg' />
                                        </PopoverTrigger>
                                        <PopoverContent width='fit-content' borderColor='#000'>
                                            <PopoverHeader onClick={onEditOpen} borderColor='#000'>
                                                <HStack>
                                                    <Image src='/img/edit.svg' width='30px' />
                                                    <Text>Edit</Text>
                                                    {/* ========== Edit Form ========== */}
                                                    <Modal blockScrollOnMount={true} isOpen={isEditOpen} onClose={onEditClose} size='4xl'>
                                                        <ModalOverlay />
                                                        <ModalContent>
                                                            <form
                                                                onSubmit={(e: BaseSyntheticEvent) =>
                                                                    void handleSubmit(submitArticle)(e)
                                                                }
                                                            >
                                                                <ModalHeader width='100%' mx='auto' borderBottom='1px solid #CBD2E0'>
                                                                    <ModalCloseButton pos='absolute' left='0' onClick={() => reset()} />
                                                                    <Center>
                                                                        Add New Post
                                                                    </Center>
                                                                </ModalHeader>
                                                                <Divider colorScheme="red" size="20px" />
                                                                <ModalBody>
                                                                    <FormControl isInvalid={!!formState.errors.article}>
                                                                        <Textarea
                                                                            placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
                                                                            width='100%'
                                                                            height='400px'
                                                                            border='none'
                                                                            {...register('article', {
                                                                                required: {
                                                                                    value: true,
                                                                                    message: 'Artikel tidak boleh kosong'
                                                                                }
                                                                            })}
                                                                        >{item.article}</Textarea>
                                                                        {formState.errors.article && (
                                                                            <FormErrorMessage>
                                                                                {' '}
                                                                                {formState.errors.article.message as string}{' '}
                                                                            </FormErrorMessage>
                                                                        )}
                                                                    </FormControl>
                                                                </ModalBody>
                                                                <ModalFooter borderTop='1px solid #CBD2E0'>
                                                                    <Flex width='100%' justifyContent='space-between' alignItems='center'>
                                                                        <HStack width='120px'>
                                                                            <Box>
                                                                                <Image src='/img/uploadImg.svg' />
                                                                            </Box>
                                                                            <Box>
                                                                                <Image src='/img/uploadTripple.svg' />
                                                                            </Box>
                                                                            <Box>
                                                                                <Image src='/img/uploadEmot.svg' />
                                                                            </Box>
                                                                        </HStack>
                                                                        <Button variant='solidBlue' type='submit'>Confirm</Button>
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
            {/* Biar background ga ketutup */}
            <Modal isOpen={isRemoveOpen} onClose={onRemoveClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Are you want to delete this feed?</ModalHeader>
                    <ModalFooter>
                        <Button variant='outlineBlue' mr={3} onClick={() => {
                            onRemoveClose();
                            setItemToDeleteIndex('');
                        }}>Cancel</Button>
                        <Button variant='solidBlue' onClick={() => handleDelete(itemToDeleteIndex)}>Confirm</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Layout>
    );
}

