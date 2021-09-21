import React from 'react';
import { AbstractStatementType } from '../AbstractComponentType.type';

export type SentenceProps = { text: string } & AbstractStatementType;

const Sentence = (props: SentenceProps) => {
  // TODO: make sure the pre-spaces are rendered! => &nbsp;
  return <p>{props.text?.toString()}</p>;
};

export default Sentence;
