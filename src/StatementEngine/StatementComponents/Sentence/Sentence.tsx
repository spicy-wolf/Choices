import React from 'react';
import * as Types from '@src/Types';

const Sentence = (props: Types.SentenceStatementType) => {
  // TODO: make sure the pre-spaces are rendered! => &nbsp;
  return <p>{props.text?.toString()}</p>;
};

export default Sentence;
