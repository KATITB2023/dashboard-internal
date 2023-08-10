import { extendTheme } from '@chakra-ui/react';
import { colors } from './component/colors';
import { Button } from './component/button';
import { Input } from './component/input';
import { Textarea } from './component/textarea';

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
        color: 'black'
      },
      '*': {
        '&::-webkit-scrollbar': {
          w: '2',
          h: '1.5'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'black',
          boxShadow: 'inset 0 0 7px white'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'yellow.1',
          boxShadow: 'inset 0 0 2px black',
          borderRadius: '4'
        }
      }
    }
  },
  components: {
    Button,
    Input,
    Textarea
  }
});

export default theme;
