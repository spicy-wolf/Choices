import { StatementTypeNames } from '../Constants';
import { BaseStatementType } from './BaseStatement.type';

export type SentenceStatementType = {
  type: typeof StatementTypeNames.SENTENCE[number];
  data: string;
} & BaseStatementType;
