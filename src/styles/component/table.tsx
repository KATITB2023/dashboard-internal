import { ComponentStyleConfig, SystemStyleFunction } from '@chakra-ui/react';

const blackTableStyle: SystemStyleFunction = () => {
  return {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      w: '100vw',
      thead: {
        bg: 'black',
        color: 'white',
        border: '1px solid',
        borderColor: 'gray.400',
        td: {
          textAlign: 'center'
        }
      },
      tbody: {
        tr: {
          td: {
            textAlign: 'center',
            padding: '0.5rem',
            border: '1px solid',

            borderColor: 'gray.400',
            color: 'black'
          }
        }
      }
    }
  };
};

export const Table: ComponentStyleConfig = {
  variants: {
    black: blackTableStyle
  },
  defaultProps: {
    variant: 'default'
  }
};
