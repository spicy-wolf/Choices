import React from 'react';
import { HtmlElementAttribute } from '../../Constants';
import { EndOfLineComponentType } from '../../Types';

const EndOfLine = (props: EndOfLineComponentType): JSX.Element => {
  const elementProps = {
    [HtmlElementAttribute.LOG_ORDER_ATTRIBUTE]: props.order,
    [HtmlElementAttribute.SOURCE_STATEMENT_ID_ATTRIBUTE]:
      props.sourceStatementId,
  };
  return <br {...elementProps} />;
};

export default EndOfLine;
