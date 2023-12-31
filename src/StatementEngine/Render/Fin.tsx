/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import React from 'react';
import { HtmlElementAttribute } from '../Constants';
import { FinComponentType } from '../Types';

const Fin = (props: FinComponentType): JSX.Element => {
  const elementProps = {
    [HtmlElementAttribute.SOURCE_STATEMENT_ID_ATTRIBUTE]:
      props.sourceStatementId,
  };
  return <div {...elementProps} className="d-none"></div>;
};

export default Fin;

