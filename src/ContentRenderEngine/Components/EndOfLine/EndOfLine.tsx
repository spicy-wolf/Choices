import React from 'react';
import { AbstractComponentType } from '../AbstractComponentType';

type EndOfLineProps = {} & AbstractComponentType;

const EndOfLine = (props: EndOfLineProps): JSX.Element => {
  return <br />;
};

export default EndOfLine;
