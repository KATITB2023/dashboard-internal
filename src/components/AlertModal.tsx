import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button
} from '@chakra-ui/react';
import { useRef } from 'react';

interface Props {
  content: string;
  title: string;
  isOpen: boolean;
  onYes: () => void;
  onNo: () => void;
}

export const AlertModal = ({ content, title, isOpen, onYes, onNo }: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog isOpen={isOpen} onClose={onNo} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{content}</AlertDialogBody>

          <AlertDialogFooter>
            <Button variant='outlineBlue' ref={cancelRef} onClick={onNo}>
              Cancel
            </Button>
            <Button variant='solidBlue' onClick={onYes} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
