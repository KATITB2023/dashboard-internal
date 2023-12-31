import React from 'react';
import { Box } from '@chakra-ui/react';
import { SidebarContent } from '~/components/sidebar/Content';
import { type SidebarProps } from '~/components/sidebar/Links';

export function Sidebar(props: SidebarProps) {
  const { routes } = props;

  return (
    <Box display='block' position='fixed' minH='100%'>
      <Box
        bg='black'
        bgImage="url('/images/sidebar/bg.png')"
        bgPosition='bottom'
        transition='0.2s linear'
        w='298px'
        h='100vh'
        m={0}
        minH='100%'
        overflowX='hidden'
        bgRepeat='no-repeat'
      >
        <SidebarContent routes={routes} />
      </Box>
    </Box>
  );
}

export default Sidebar;
