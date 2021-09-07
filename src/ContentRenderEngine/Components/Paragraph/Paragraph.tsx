import React from 'react';
import { AbstractComponentType } from '../AbstractComponentType';

type ParagraphProps = { text: string } & AbstractComponentType;

const Paragraph = (props: ParagraphProps) => {
  return (
    <>
      <p>{props.text?.toString()}</p>
      <br />
    </>
  );
};

export default Paragraph;
