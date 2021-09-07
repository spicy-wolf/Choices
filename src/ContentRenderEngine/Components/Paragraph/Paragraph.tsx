import React from 'react';
import { AbstractComponentType } from '../AbstractComponentType';

type ParagraphProps = { text: string } & AbstractComponentType;

const Paragraph = (props: ParagraphProps) => {
  return (
    <>
      <br />
      <p>{props.text?.toString()}</p>
      {/* allow sentences or values append after */}
    </>
  );
};

export default Paragraph;
