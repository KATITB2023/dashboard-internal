/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Tr,
  Td,
  Button,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import { type RouterOutputs } from '~/utils/api';
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import EditMerchModal from './editMerchModal';
import React from 'react';
import { api } from '~/utils/api';

interface Props {
  data: RouterOutputs['merch']['getAllMerch'][0];
  index: number;
  loading: boolean;
  emit: () => void;
}

export default function MerchCatalogRow({ data, index, loading, emit }: Props) {
  const deleteAlert = useDisclosure();
  const publishAlert = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  const deleteMerchMutation = api.merch.deleteMerch.useMutation();
  const publishMerchMutation = api.merch.publishMerch.useMutation();

  const deleteMerch = async () => {
    await deleteMerchMutation.mutateAsync({ merchId: data.id });
    toast({
      title: 'Merch deleted successfully',
      status: 'success',
      duration: 3000,
      isClosable: true
    });

    location.reload();
  };

  const publishMerch = async () => {
    await publishMerchMutation.mutateAsync({ merchId: data.id });
    toast({
      title: 'Merch published successfully',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
    location.reload();
  };

  return (
    <Tr>
      <Td w='5%'>{index}</Td>
      <Td w='20%'>{data.name}</Td>
      <Td w='15%'>{data.stock}</Td>
      <Td w='15%'>{data.price}</Td>
      <Td w='15%'>{data.image ? data.image.substring(74) : ''}</Td>
      <EditMerchModal props={data} emit={() => emit()} loading={loading} />
      <Td w='10%'>
        <Button variant='outline' onClick={deleteAlert.onOpen}>
          <FaTrash fontSize='1rem' />
        </Button>
        <AlertDialog
          isOpen={deleteAlert.isOpen}
          leastDestructiveRef={cancelRef}
          onClose={deleteAlert.onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete {data.name}
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  onClick={deleteAlert.onClose}
                  ref={cancelRef}
                  color={'white'}
                  backgroundColor={'gray.500'}
                  _hover={{ backgroundColor: 'gray.700' }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    void deleteMerch();
                    deleteAlert.onClose();
                  }}
                  color={'white'}
                  backgroundColor={'red.500'}
                  _hover={{ backgroundColor: 'red.800' }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Td>
      <Td w='10%'>
        {data.isPublished ? (
          'Published'
        ) : (
          <>
            <Button
              onClick={publishAlert.onOpen}
              color={'white'}
              backgroundColor={'gray.500'}
              _hover={{ backgroundColor: 'gray.700' }}
            >
              Publish
            </Button>
            <AlertDialog
              isOpen={publishAlert.isOpen}
              leastDestructiveRef={cancelRef}
              onClose={publishAlert.onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Publish {data.name}
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button
                      onClick={publishAlert.onClose}
                      ref={cancelRef}
                      color={'white'}
                      backgroundColor={'gray.500'}
                      _hover={{ backgroundColor: 'gray.700' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        void publishMerch();
                        publishAlert.onClose();
                      }}
                      color={'white'}
                      backgroundColor={'green.500'}
                      _hover={{ backgroundColor: 'green.700' }}
                      ml={3}
                    >
                      Publish
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )}
      </Td>
    </Tr>
  );
}
