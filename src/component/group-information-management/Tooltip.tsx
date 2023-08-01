import { Grid } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import React from 'react';

interface TooltipProps {
  content: ReactNode[];
}

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  return (
    <Grid
      position='absolute'
      zIndex={999}
      bgImage='images/tooltip.png'
      width='max-content'
      height='max-content'
      backgroundSize='100% 100%'
      p={4}
      backgroundRepeat='no-repeat'
      templateColumns='repeat(2, 1fr)'
      gap='5px'
      transform='translateX(-40%) translateY(60%)'
    >
      {content.map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))}
    </Grid>
  );
};

export default Tooltip;
