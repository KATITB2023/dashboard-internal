// chakra imports
import { Box, Flex, Stack, Button } from '@chakra-ui/react';
import Links from './Links';
import Image from 'next/image';
import { IconFromImage } from '~/component/icon-from-image';
import { SidebarProps } from '~/component/sidebar/component/Links';

export function SidebarContent(props: SidebarProps) {
  const { routes } = props;

  return (
    <Flex direction='column' height='100%' pt='25px' borderRadius='30px'>
      <Flex
        alignItems='start'
        flexDirection='column'
        marginStart={30}
        marginTop={50}
        marginBottom={25}
      >
        <Image
          src='/img/sidebar/logo.svg'
          width={223}
          height={97}
          alt='logo oskm'
        />
      </Flex>
      <Flex
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        my={8}
      >
        <Button colorScheme='#ABB3C2' variant='solid'>
          Profile
        </Button>
      </Flex>
      <Stack direction='column' mt='8px' mb='auto'>
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
          <IconFromImage
            mr={2}
            imagePath='/img/sidebar/exit-icon.svg'
            size={20}
            alt='exit icon'
          />
          Keluar
        </Button>
      </Flex>
    </Flex>
  );
}
