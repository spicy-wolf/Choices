import React from 'react';
import { AbstractStatementType } from '../AbstractComponentType.type';

export type EndOfLineProps = {} & AbstractStatementType;

const EndOfLine = (props: EndOfLineProps): JSX.Element => {
  return <br />;
};

export default EndOfLine;
