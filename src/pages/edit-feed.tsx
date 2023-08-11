import { Modal, ModalContent, ModalHeader, ModalCloseButton, Center, ModalBody, FormControl, Text, Input, FormErrorMessage, Textarea, Tag, TagCloseButton, ModalFooter, Flex, Icon, Button, useDisclosure, useToast, HStack } from "@chakra-ui/react"
import { ChangeEvent, MouseEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { SlPencil, SlPicture } from "react-icons/sl"
import { FeedProps } from "./feeds";
import { api } from "~/utils/api";
import { AiOutlineLink } from 'react-icons/ai'
import { sanitizeURL } from "~/utils/file";
import { deleteFile, uploadFile } from "~/utils/file";
import { TRPCError } from "@trpc/server";

interface EditFeedProp extends FeedProps {
    feedChange: () => void;
  }

const EditFeed = ({ id, content, url, feedChange }: EditFeedProp) => {
    const toast = useToast();
    const { register, formState, handleSubmit, reset, setValue, getValues, watch, unregister } = useForm<FeedProps>({
        mode: 'onSubmit',
        defaultValues: {
            id: id,
            content: content,
            url: '',
            filePath: '',
        }
    });

    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [isAttachFile, setIsAttachFile] = useState<boolean>(false);
    const [isAttachUrl, setIsAttachUrl] = useState<boolean>(false);
    const [isUrlTag, setIsUrlTag] = useState<boolean>(false);
    const editFeeds = api.feeds.adminEditFeed.useMutation()

    const handleTag = () => {
        if (url) {
            setIsUrlTag(true);
        }
    }

    const handleIsAttachFile = () => {
        if (isAttachFile === true) {
            setIsAttachFile(false);
        } else {
            reset()
            setIsAttachFile(true);
            setIsAttachUrl(false);
            unregister('filePath');
        }
    }
    const handleIsAttachUrl = () => {
        if (isAttachUrl === true) {
            setIsAttachUrl(false);
        } else {
            reset()
            setIsAttachUrl(true);
            setIsAttachFile(false);
            unregister('url');
        }
    }

    const handleEdit = (idValue: number, urlValue: string, contentValue: string) => {
        setValue('id', idValue);
        setValue('url', urlValue);
        setValue('content', contentValue);
    }

    const handleCancelEdit = () => {
        reset();
        setIsAttachUrl(false);
        setIsAttachFile(false);
    };

    const handleSubmitEdit = async (data: FeedProps) => {
        if (data.filePath) {
            setValue('filePath', data.filePath[0]);
        }
        try {
            if (getValues('url')) {
                const res = editFeeds.mutateAsync({
                    feedId: getValues('id'),
                    body: getValues('content'),
                    attachment: getValues('url')
                });
            } else if (getValues('filePath')) {
                const fileStr: File = getValues('filePath');
                if (fileStr) {
                    const fileName = `${fileStr.name.replace(' ', '-').split('.')[0]}`
                    const extension = fileStr.name.split('.').pop() as string
                    const imagePath = sanitizeURL(
                        `https://cdn.oskmitb.com/attachment-feeds/${fileName}.${extension}`
                    );
                    await uploadFile(imagePath, fileStr);
                    const res = editFeeds.mutateAsync({
                        feedId: getValues('id'),
                        body: getValues('content'),
                        attachment: imagePath,
                    })
                }
            } else {
                const res = editFeeds.mutateAsync({
                    feedId: getValues('id'),
                    body: getValues('content'),
                    attachment: '',
                });
            }
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
        feedChange();
        reset();
        onEditClose();
    };

    const handleRemoveAttach: MouseEventHandler<HTMLButtonElement> = async () => {
        if (url) {
            try {
                await deleteFile(url);
            } catch (err) {
                console.log(err);
            }
        }
        setValue('url', '');
        setValue('filePath', '');
        setIsAttachUrl(false);
        setIsAttachFile(false);
        setIsUrlTag(false);
    }

    const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue('content', e.target.value)
    }

    const isVideoLink = (link: string | null | undefined) => {
        if (!link) {
            return true;
        }
        const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/|.+\/|user\/\S+|[^\/]+)([a-zA-Z0-9_-]{11})|youtu\.be\/([a-zA-Z0-9_-]{11}))(?:\S+)?$/;

        return youtubeRegex.test(link) || 'Invalid YouTube embed link';
    };

    return (
        <>
            <HStack onClick={() => { onEditOpen(), handleEdit(id, url!, content), handleTag() }}>
                <Icon as={SlPencil} boxSize={6} />
                <Text>Edit</Text>
                {/* ========== Edit Form ========== */}
                <Modal blockScrollOnMount={true} isOpen={isEditOpen} onClose={onEditClose} size='4xl'>
                    <ModalContent>
                        <form onSubmit={(e) => void handleSubmit(handleSubmitEdit)(e)}>
                            <ModalHeader width='100%' mx='auto' borderBottom='1px solid #CBD2E0'>
                                <ModalCloseButton pos='absolute' left='0' onClick={handleCancelEdit} />
                                <Center>
                                    Edit Post
                                </Center>
                            </ModalHeader>
                            <ModalBody>
                                {
                                    !isUrlTag && isAttachUrl && (
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
                                    !isUrlTag && isAttachFile && (
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
                                        onChange={handleContentChange}
                                        value={watch('content')}
                                    />
                                    {formState.errors.content && (
                                        <FormErrorMessage>
                                            {' '}
                                            {formState.errors.content.message as string}{' '}
                                        </FormErrorMessage>
                                    )}
                                </FormControl>
                                {isUrlTag && (<Tag
                                    mt='8px'
                                >
                                    {url}
                                    <TagCloseButton onClick={handleRemoveAttach} />
                                </Tag>)}
                            </ModalBody>
                            <ModalFooter borderTop='1px solid #CBD2E0'>
                                <Flex width='100%' justifyContent='space-between' alignItems='center'>
                                    <HStack>
                                        <Icon as={SlPicture} boxSize={8} onClick={handleIsAttachFile} cursor='pointer' />
                                        <Icon as={AiOutlineLink} boxSize={8} onClick={handleIsAttachUrl} cursor='pointer' />
                                    </HStack>
                                    <Button variant='solidBlue' type="submit">Confirm</Button>
                                </Flex>
                            </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>
            </HStack>
        </>
    )
}

export default EditFeed;
