import React from 'react';
import { AbstractStatementType } from '../AbstractComponentType.type';

export type ErrorProps = AbstractStatementType & {
  context: any;
  errormsg: string;
};

const Error = (props: ErrorProps) => {
  return <></>;
};

export default Error;
