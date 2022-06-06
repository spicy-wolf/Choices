import { StatementTypeNames } from '../Constants';
import {
  AbstractComponentType,
  AbstractStatementType,
} from './AbstractStatement.type';

type BaseType = {
  type: typeof StatementTypeNames.SENTENCE[number];
  data: string;
};
export type SentenceStatementType = AbstractStatementType & BaseType;
export type SentenceComponentType = AbstractComponentType & BaseType;
