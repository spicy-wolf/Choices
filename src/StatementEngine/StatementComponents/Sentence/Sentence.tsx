import React from 'react';
import * as Types from '@src/Types';

const Sentence = (
  props: Types.Statements.SentenceStatementType
): JSX.Element => {
  // Note: no need to worry pre-space &nbsp, it resolved automatically
  let text = props.data?.toString();

  return <p id={props.id}>{text}</p>;
};

export default Sentence;
