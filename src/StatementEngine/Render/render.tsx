/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
import * as Types from '../Types';
import { CheckStatementType } from '../Helper';
import EndOfLine from './EndOfLine';
import Sentence from './Sentence';
import Fin from './Fin';

export const render = (props: Types.AnyComponentType): JSX.Element => {
  if (!props) {
    // run time error
    return <></>;
  }

  let Component: (props: Types.AnyComponentType) => JSX.Element = null;

  const statement = props;
  if (CheckStatementType.isEndOfLine(statement)) {
    Component = EndOfLine;
  } else if (CheckStatementType.isFin(statement)) {
    Component = Fin;
  } else if (CheckStatementType.isSentence(statement)) {
    Component = Sentence;
  } else {
    Component = () => <></>;
  }

  return <Component {...props} />;
};

