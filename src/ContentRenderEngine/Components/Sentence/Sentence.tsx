import React from 'react';
import { AbstractComponentType } from '../AbstractComponentType';

type SentenceProps = { text: string } & AbstractComponentType;

const Sentence = (props: SentenceProps) => {
  return <p>{props.text?.toString()}</p>;
};

export default Sentence;
