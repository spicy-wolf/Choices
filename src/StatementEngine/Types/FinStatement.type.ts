import { StatementTypeNames } from '../Constants';
import { AbstractStatementType } from './AbstractStatement.type';

export type FinStatementType = AbstractStatementType & {
  type: typeof StatementTypeNames.FIN[number];
};
