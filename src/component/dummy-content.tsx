// buat generate dummy content aja, nanti dihapus
// nulis di sini biar kecontoh aja

import { Box, Heading } from '@chakra-ui/react';

export const DummyContent = (props: { title: string }) => {
  return (
    <Box
      mr={7}
      mt={7}
      mb={7}
      ml={0}
      bg='white'
      borderRadius={25}
      height='94vh'
      padding={10}
    >
      <Heading color='#340C8F'>{props.title}</Heading>
    </Box>
  );
};
