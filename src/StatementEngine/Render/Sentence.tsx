/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
import { SentenceComponentType } from '../Types';
import { HtmlElementAttribute } from '../Constants';

const Sentence = (props: SentenceComponentType): JSX.Element => {
  // Note: no need to worry pre-space &nbsp, it resolved automatically
  const text = props.data?.toString();
  const elementProps = {
    [HtmlElementAttribute.LOG_ORDER_ATTRIBUTE]: props.order,
    [HtmlElementAttribute.SOURCE_STATEMENT_ID_ATTRIBUTE]:
      props.sourceStatementId,
  };
  return <p {...elementProps}>{text}</p>;
};

export default Sentence;

