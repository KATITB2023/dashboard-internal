import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, Center, ModalBody, FormControl, Input, FormErrorMessage, Textarea, ModalFooter, Flex, Icon, useDisclosure, Box, Text, useToast, HStack } from "@chakra-ui/react";
import { BaseSyntheticEvent, useState } from "react";
import { SlPicture } from "react-icons/sl";
import { FeedProps } from "./feeds";
import { SubmitHandler, useForm } from "react-hook-form";
import { TRPCError } from "@trpc/server";
import { api } from "~/utils/api";
import { AiOutlineLink } from 'react-icons/ai'
import { sanitizeURL, uploadFile } from "~/utils/file";

const AddFeed = ({feedChange}: {feedChange: () => void}) => {
    const toast = useToast();
    const { isOpen: isPostOpen, onOpen: onPostOpen, onClose: onPostClose } = useDisclosure();
    const { register, formState, handleSubmit, reset, setValue, getValues, watch, unregister } = useForm<FeedProps>({
        mode: 'onSubmit',
        defaultValues: {
            id: undefined,
            content: '',
            url: '',
            filePath: undefined,
        }
    });
    const [isAttachFile, setIsAttachFile] = useState<boolean>(false);
    const [isAttachUrl, setIsAttachUrl] = useState<boolean>(false);
    const createFeed = api.feeds.adminPostFeed.useMutation();

    const handleIsAttachFile = () => {
        if (isAttachFile === true) {
            setIsAttachFile(false);
        } else {
            setIsAttachFile(true);
            setIsAttachUrl(false);
            unregister('filePath');
        }
    }
    const handleIsAttachUrl = () => {
        if (isAttachUrl === true) {
            setIsAttachUrl(false);
        } else {
            setIsAttachUrl(true);
            setIsAttachFile(false);
            unregister('url');
        }
    }
    const submitContent: SubmitHandler<FeedProps> = async (data: FeedProps) => {
        if (data.filePath) {
            setValue('filePath', data.filePath[0]);
        }
        const fileStr: File = getValues('filePath');
        try {
            if (fileStr) {
                const fileName = `${fileStr.name.replace(' ', '-').split('.')[0]}`
                const extension = fileStr.name.split('.').pop() as string
                const imagePath = sanitizeURL(
                    `https://cdn.oskmitb.com/attachment-feeds/${fileName}.${extension}`
                );
                await uploadFile(imagePath, fileStr);
                console.log('file cdn: ', imagePath)
                const res = createFeed.mutateAsync({
                    body: data.content,
                    attachment: imagePath,
                })
            } else {
                if (data.url) {
                    const res = createFeed.mutateAsync({
                        body: data.content,
                        attachment: data.url
                    })
                } else {
                    const res = createFeed.mutateAsync({
                        body: data.content,
                    })
                }
            }
            toast({
                title: 'Success',
                status: 'success',
                description: 'Feed uploaded successfully',
                duration: 2000,
                isClosable: true,
                position: 'top'
            });
        } catch (error) {
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
        feedChange()
        reset();
        setIsAttachFile(false);
        setIsAttachUrl(false);
        onPostClose();
    };

    const isVideoLink = (link: string | null | undefined) => {
        if (!link) {
            return true;
        }
        const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/|.+\/|user\/\S+|[^\/]+)([a-zA-Z0-9_-]{11})|youtu\.be\/([a-zA-Z0-9_-]{11}))(?:\S+)?$/;

        return youtubeRegex.test(link) || 'Invalid YouTube embed link';
    };

    return (
        <>
            {/* ========== Post Form ========== */}
            <Box px='1.5rem' py='1rem' borderBottom='1px solid #CBD2E0'>
                <Button variant='solidBlue' onClick={onPostOpen}>
                    Add Post
                </Button>
                <Modal blockScrollOnMount={true} isOpen={isPostOpen} onClose={onPostClose} size='4xl'>
                    <ModalOverlay />
                    <ModalContent>
                        <form onSubmit={(e: BaseSyntheticEvent) => void handleSubmit(submitContent)(e)}>
                            <ModalHeader width='100%' mx='auto' borderBottom='1px solid #CBD2E0'>
                                <ModalCloseButton pos='absolute' left='0' onClick={() => { reset(), handleIsAttachFile(), handleIsAttachUrl()}} />
                                <Center>
                                    Add New Post
                                </Center>
                            </ModalHeader>
                            <ModalBody>
                                {
                                    isAttachUrl && (
                                        <FormControl isInvalid={!!formState.errors.url}>
                                            <Text>Attachment URL:</Text>
                                            <Input
                                                variant='solidLight'
                                                border={formState.errors.url ? '1px solid red' : '1px solid black'}
                                                {...register('url', {
                                                    validate: (value) => isVideoLink(value)
                                                })}
                                            />
                                            {formState.errors.url && (
                                                <FormErrorMessage>
                                                    {' '}
                                                    {formState.errors.url.message as string}{' '}
                                                </FormErrorMessage>
                                            )}
                                        </FormControl>
                                    )
                                }
                                {
                                    isAttachFile && (
                                        <FormControl isInvalid={!!formState.errors.url}>
                                            <Text>Attachment File:</Text>
                                            <Input
                                                variant='solidLight'
                                                type="file"
                                                accept="image/png, image/jpeg"
                                                border={formState.errors.url ? '1px solid red' : '1px solid black'}
                                                {...register('filePath')}
                                            />
                                        </FormControl>
                                    )
                                }
                                <FormControl isInvalid={!!formState.errors.content} mt='1rem'>
                                    <Text>Content:</Text>
                                    <Textarea
                                        variant='unstyled'
                                        border={formState.errors.content ? '1px solid red' : '1px solid black'}
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
                            </ModalBody>
                            <ModalFooter borderTop='1px solid #CBD2E0'>
                                <Flex width='100%' justifyContent='space-between' alignItems='center'>
                                    <HStack>
                                        <Icon as={SlPicture} boxSize={8} onClick={handleIsAttachFile} cursor='pointer' />
                                        <Icon as={AiOutlineLink} boxSize={8} onClick={handleIsAttachUrl} cursor='pointer' />
                                    </HStack>
                                    <Button variant='solidBlue' type='submit'>Post</Button>
                                </Flex>
                            </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>
            </Box>
        </>
    )
}

export default AddFeed;
