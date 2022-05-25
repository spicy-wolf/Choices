import * as Types from '@src/Types';

export const isSentence = (statement: Types.Statements.AnyStatementType) => {
  return statement?.type === 's' || statement?.type === 'sentence';
};
