import React from 'react';
import * as Types from '@src/Types';

const EndOfLine = (
  props: Types.Statements.EndOfLineStatementType
): JSX.Element => {
  return <br id={props.id} />;
};

export default EndOfLine;
