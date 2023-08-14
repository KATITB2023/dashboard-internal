import React from 'react';
import {
  Flex,
  Icon,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerContent,
  useDisclosure
} from '@chakra-ui/react';
import { SidebarContent } from '~/components/sidebar/Content';
import { type SidebarProps } from '~/components/sidebar/Links';
import { GiHamburgerMenu } from 'react-icons/gi';

export function Navbar(props: SidebarProps) {
  const { routes } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      w='100%'
      position={'sticky'}
      top={0}
      alignItems={'center'}
      p='1rem'
      justifyContent={'space-between'}
    >
      <Image
        src='/images/sidebar/logo.svg'
        width={120}
        height={50}
        alt='logo oskm'
        draggable='false'
        loading='lazy'
      />
      <Icon as={GiHamburgerMenu} color={'white'} w={7} h={7} onClick={onOpen} />
      <Drawer isOpen={isOpen} onClose={onClose} placement='left'>
        <DrawerOverlay />
        <DrawerContent bg={'black'}>
          <DrawerBody>
            <SidebarContent routes={routes} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default Navbar;
