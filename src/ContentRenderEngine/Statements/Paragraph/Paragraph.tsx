import React from 'react';
import { AbstractStatementType } from '../AbstractComponentType.type';

export type ParagraphProps = AbstractStatementType & { text: string };

const Paragraph = (props: ParagraphProps) => {
  // TODO: make sure the pre-spaces are rendered! => &nbsp;
  return (
    <>
      <br />
      <p>{props.text?.toString()}</p>
      {/* allow sentences or values append after */}
    </>
  );
};

export default Paragraph;
