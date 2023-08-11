import { Button, Flex, Input, Td, Tr } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { RouterOutputs } from '~/utils/api';

type LeaderboardDataOutput =
  RouterOutputs['leaderboard']['mentorGetLeaderboardData']['data'][0];

interface AddPointRowProps {
  data: LeaderboardDataOutput;
  num: number;
  editPoint: (id: string, point: number) => void;
}

export const AddPointRow = ({ data, num, editPoint }: AddPointRowProps) => {
  const [point, setPoint] = useState(data.profile?.point || 0);

  useEffect(() => {
    if (point === data.profile?.point) return;
    const timer = setTimeout(() => {
      editPoint(data.id, point);
    }, 1000);
    return () => clearTimeout(timer);
  }, [point]);

  const decPointHandler = () => {
    if (point > 0) {
      setPoint(point - 1);
    }
  };

  const incPointHandler = () => {
    setPoint(point + 1);
  };

  const pointInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value < 0) {
      setPoint(0);
    } else {
      setPoint(value);
    }
  };

  return (
    <Tr>
      <Td>{num}</Td>
      <Td>{data.nim}</Td>
      <Td>{data.profile?.name || '-'}</Td>
      <Td>
        <Flex
          w='min(95%,15em)'
          justifyContent='space-between'
          alignItems='center'
          mx='auto'
        >
          <Button
            border='3px solid yellow'
            bg='black'
            borderRadius='1rem'
            h='2rem'
            fontSize='3xl'
            onClick={decPointHandler}
          >
            -
          </Button>
          <Input
            value={point}
            onChange={pointInputChangeHandler}
            w='5em'
            textAlign='center'
            bg='white'
            borderColor='yellow'
            color='black'
          />
          <Button
            border='3px solid yellow'
            bg='black'
            borderRadius='1rem'
            h='2rem'
            fontSize='3xl'
            onClick={incPointHandler}
          >
            +
          </Button>
        </Flex>
      </Td>
    </Tr>
  );
};
