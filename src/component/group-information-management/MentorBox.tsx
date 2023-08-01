import { Text, Flex, Image } from '@chakra-ui/react';
import React from 'react';

interface Mentor {
  picture: string;
  name: string;
  nim: string;
  faculty: string;
}

const MentorBox: React.FC<{ mentor: Mentor }> = ({ mentor }) => {
  return (
    <Flex
      maxH='96px'
      width='480px'
      minW='200px'
      bg='#0B0A0A'
      p={4}
      borderRadius='25px'
      boxShadow='0 3px 15px -3px #FFFC83'
      color='white'
      alignItems='center'
    >
      <Image src={mentor.picture} alt={mentor.name} boxSize='70px' mr={4} />
      <Flex flexDirection='column' height='74px' justifyContent='center'>
        <Text fontSize='16px' fontWeight='700'>
          {mentor.name}
        </Text>
        <Text fontSize='14px' fontWeight='400'>
          {mentor.nim}
        </Text>
        <Text fontSize='14px' fontWeight='400'>
          {mentor.faculty}
        </Text>
      </Flex>
    </Flex>
  );
};

export default MentorBox;
