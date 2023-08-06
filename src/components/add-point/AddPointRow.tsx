import { Td, Tr } from '@chakra-ui/react';
import { RouterOutputs } from '~/utils/api';

type LeaderboardDataOutput =
  RouterOutputs['leaderboard']['mentorGetLeaderboardData']['data'][0];

interface AddPointRowProps {
  data: LeaderboardDataOutput;
  num: number;
}

export const AddPointRow = ({ data, num }: AddPointRowProps) => {
  return (
    <Tr>
      <Td>{num}</Td>
      <Td></Td>
      <Td></Td>
      <Td></Td>
    </Tr>
  );
};
