import React, { Fragment } from 'react';
import type { AbstractStatementType } from '.';
import * as Components from './Components';

type RenderContentProps = {
  statement: AbstractStatementType;
};

export const RenderContent = (props: RenderContentProps) => {
  if (!props?.statement || !props?.statement?.type) {
    // run time error
    return <></>;
  }

  const componentType = props?.statement?.type?.toLowerCase() ?? '';
  const statement = props?.statement;

  let Component: (props: object) => JSX.Element = null;
  switch (componentType) {
    case 'endofline':
    case 'eol':
      Component = Components.EndOfLine;
      break;
    case 'paragraph':
    case 'p':
      Component = Components.Paragraph;
      break;
    case 'sentence':
    case 's':
      Component = Components.Sentence;
      break;
    default:
      Component = Fragment; // empty component
      break;
  }

  return React.createElement(Component, statement);
};
