import { StatementTypeNames } from '../Constants';
import { BaseStatementType } from './BaseStatement.type';

export type FinStatementType = {
  type: typeof StatementTypeNames.FIN[number];
} & BaseStatementType;
