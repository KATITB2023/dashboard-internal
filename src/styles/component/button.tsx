import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import type { ComponentStyleConfig } from '@chakra-ui/react';

const defaultButton: SystemStyleFunction = () => {
  return {
    color: 'purple.2',
    borderRadius: '12',
    bg: `yellow.5`,
    _hover: {
      bg: 'yellow.5',
      shadow: '0 0 24px rgba(255,200,4,0.6)',
      _disabled: {
        bg: 'gray.400',
        shadow: 'none'
      }
    },
    _active: {
      bg: 'yellow.4',
      shadow: 'none'
    },
    _disabled: {
      color: 'white',
      bg: 'gray.400'
    }
  };
};

const outlineButton: SystemStyleFunction = () => {
  return {
    color: 'yellow.5',
    borderWidth: '2px',
    borderColor: 'yellow.5',
    bg: `gray.600`,
    borderRadius: '12',
    _hover: {
      bg: 'gray.600',
      shadow: '0 0 24px rgba(255,200,4,0.6)',
      _disabled: {
        bg: 'transparent',
        shadow: 'none'
      }
    },
    _active: {
      bg: 'rgba(47, 46, 46, 0.6)',
      shadow: 'none'
    },
    _disabled: {
      color: 'gray.500',
      bg: 'transparent',
      borderColor: 'gray.400'
    }
  };
};

const defaultBlueButton: SystemStyleFunction = () => {
  return {
    color: '#ffffff',
    borderRadius: '12',
    bg: '#2D3648',
    _disabled: {
      color: 'white',
      bg: 'gray.400'
    }
  };
};

const outlineBlueButton: SystemStyleFunction = () => {
  return {
    color: '#2D3648',
    borderWidth: '2px',
    borderColor: '#2D3648',
    bg: `#ffffff`,
    borderRadius: '12',
    _disabled: {
      color: 'gray.500',
      bg: 'transparent',
      borderColor: 'gray.400'
    }
  };
};
``;

export const Button: ComponentStyleConfig = {
  variants: {
    solid: defaultButton,
    outline: outlineButton,
    solidBlue: defaultBlueButton,
    outlineBlue: outlineBlueButton
  },
  defaultProps: {
    variant: 'solid'
  }
};
