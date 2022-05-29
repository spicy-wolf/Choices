import { StatementTypeNames } from '../Constants';
import { AbstractStatementType } from './AbstractStatement.type';

export type EndOfLineStatementType = AbstractStatementType & {
  type: typeof StatementTypeNames.END_OF_LINE[number];
};
