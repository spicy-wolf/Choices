import React from 'react';
import * as Components from './StatementComponents';
import { Statements } from '@src/Types';

export const RenderContent = (
  props: Statements.AnyStatementType
): JSX.Element => {
  const componentType = props?.type?.toLowerCase() ?? '';
  if (!props || !componentType) {
    // run time error
    return <></>;
  }

  let Component: (props: any) => JSX.Element = null;
  switch (componentType) {
    case 'endofline':
    case 'eol':
      Component = Components.EndOfLine;
      break;
    case 'sentence':
    case 's':
      Component = Components.Sentence;
      break;
    default: // empty component
      Component = () => <></>;
      break;
  }

  //return React.createElement(Component, statement);
  return <Component key={props.id} {...props} />;
};
