import { StatementTypeNames } from '../Constants';
import { AbstractStatementType } from './AbstractStatement.type';

export type SentenceStatementType = AbstractStatementType & {
  type: typeof StatementTypeNames.SENTENCE[number];
  data: string;
};
