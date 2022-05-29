import React from 'react';
import { SentenceStatementType } from '../../Types';

const Sentence = (props: SentenceStatementType): JSX.Element => {
  // Note: no need to worry pre-space &nbsp, it resolved automatically
  let text = props.data?.toString();

  return <p id={props.id}>{text}</p>;
};

export default Sentence;
