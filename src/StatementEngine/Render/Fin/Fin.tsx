import React from 'react';
import { HtmlElementAttribute } from '../../Constants';
import { FinComponentType } from '../../Types';

const Fin = (props: FinComponentType): JSX.Element => {
  const elementProps = {
    [HtmlElementAttribute.SOURCE_STATEMENT_ID_ATTRIBUTE]:
      props.sourceStatementId,
  };
  return <div {...elementProps} className="d-none"></div>;
};

export default Fin;
