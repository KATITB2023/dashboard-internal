import { Box, Text, Flex, Image } from '@chakra-ui/react';
import React from 'react';

interface Mentor {
  picture: string;
  name: string;
  nim: string;
  faculty: string;
}

const MentorBox: React.FC<{ mentor: Mentor }> = ({ mentor }) => {
  return (
    <Box
      maxH='96px'
      width='480px'
      minW='200px'
      bg='#0B0A0A'
      p={4}
      borderRadius='25px'
      boxShadow='0 3px 15px -3px #FFFC83'
      mb={2}
      color='white'
    >
      <Flex>
        <Image src={mentor.picture} alt={mentor.name} boxSize='70px' mr={4} />
        <Flex flexDirection='column'>
          <Text>{mentor.name}</Text>
          <Text>{mentor.nim}</Text>
          <Text>{mentor.faculty}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default MentorBox;
