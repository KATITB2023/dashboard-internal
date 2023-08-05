// chakra imports
import { Box, Flex, Stack, Button } from '@chakra-ui/react';
import Links from './Links';
import Image from 'next/image';
import { type SidebarProps } from '~/components/sidebar/Links';

export function SidebarContent(props: SidebarProps) {
  const { routes } = props;

  return (
    <Flex direction='column' height='100%' pt='25px' borderRadius='30px'>
      <Flex
        alignItems='start'
        flexDirection='column'
        marginStart={30}
        marginTop={50}
        marginBottom={50}
      >
        <Image
          src='/images/sidebar/logo.svg'
          width={223}
          height={97}
          alt='logo oskm'
          draggable='false'
          loading='lazy'
        />
      </Flex>
      <Stack direction='column' mb='auto'>
        <Box ps='20px'>
          <Links routes={routes} />
        </Box>
      </Stack>
      <Flex
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        my={20}
      >
        <Button>
          <Box mr={2}>
            <Image
              src='/images/sidebar/exit-icon.svg'
              alt='exit icon'
              width={20}
              height={20}
              draggable='false'
              loading='lazy'
            />
          </Box>
          Keluar
        </Button>
      </Flex>
    </Flex>
  );
}
