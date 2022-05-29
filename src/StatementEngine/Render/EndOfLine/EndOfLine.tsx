import React from 'react';
import { EndOfLineStatementType } from '../../Types';

const EndOfLine = (props: EndOfLineStatementType): JSX.Element => {
  return <br id={props.id} />;
};

export default EndOfLine;
