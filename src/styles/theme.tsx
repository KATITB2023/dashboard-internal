import { extendTheme } from '@chakra-ui/react';
import { colors } from './component/colors';
import { Button } from './component/button';

const theme = extendTheme({
  fonts: {
    heading: 'Bodwars',
    body: 'SomarRounded-Regular'
  },
  colors,
  styles: {
    global: {
      body: {
        bg: 'black',
        color: 'oranye'
      },
      '*': {
        '&::-webkit-scrollbar': {
          w: '2',
          h: '1.5'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'purple.1',
          borderRadius: '4'
        }
      }
    }
  },
  components: {
    Button
  }
});

export default theme;
