// buat icon dr gambar
import { Box } from '@chakra-ui/react';
import Image from 'next/image';

interface Props {
  [key: string]: any;
  imagePath: string; // svg, kalo png bakal pecah banget
  alt: string;
  size: number;
}

export function IconFromImage(props: Props) {
  const { imagePath, alt, size, ...rest } = props;
  return (
    <Box {...rest}>
      <Image
        src={imagePath}
        alt={alt}
        width={size}
        height={size}
        draggable='false'
        loading='lazy'
      />
    </Box>
  );
}
