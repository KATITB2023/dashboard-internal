/* eslint-disable @typescript-eslint/unbound-method */
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { type ComponentStyleConfig } from '@chakra-ui/react';

const variantDark: SystemStyleFunction = () => {
  return {
    field: {
      border: '2px solid',
      borderColor: 'gray.400',
      bg: 'gray.600',
      _hover: {
        borderColor: 'gray.500'
      },
      _invalid: {
        borderColor: 'oranye'
      },
      _focusVisible: {
        boxShadow: '0 0 16px rgba(255,252,131,0.4)'
      }
    }
  };
};

const variantUnstyled: SystemStyleFunction = () => {
  return {
    field: {
      bg: 'transparent',
      px: '0',
      height: 'auto'
    }
  };
};

export const Input: ComponentStyleConfig = {
  variants: {
    filledDark: variantDark,
    unstyled: variantUnstyled
  },
  defaultProps: {
    size: 'md',
    variant: 'filledDark'
  }
};
