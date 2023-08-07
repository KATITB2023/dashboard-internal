// import { type ImageProps } from "next/image";
import React, { type ElementType } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

// kenapa tdk bs yh hhh
// import { Image } from "@chakra-ui/react";

// type Renderers = {[nodeType: string]: ElementType}

export const Markdown = ({ body }: { body: string }) => {
  // const ImageRenderer = ({alt,src}: {
  //     alt?: string;
  //     src?: string;}
  //    ) => {
  //     const imageStyle: React.CSSProperties = {
  //       width: '10%'
  //     };
  //     return <Image src={src} alt={alt} style={imageStyle} />;
  //   };

  // const customRenderers: Renderers = {
  //     image: ImageRenderer
  // };

  return <ReactMarkdown>{body}</ReactMarkdown>;
};
