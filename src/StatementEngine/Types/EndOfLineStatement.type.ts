import { StatementTypeNames } from '../Constants';
import { BaseStatementType } from './BaseStatement.type';

export type EndOfLineStatementType = {
  type: typeof StatementTypeNames.END_OF_LINE[number];
} & BaseStatementType;
