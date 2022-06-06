import { StatementTypeNames } from '../Constants';
import {
  AbstractComponentType,
  AbstractStatementType,
} from './AbstractStatement.type';

type BaseType = {
  type: typeof StatementTypeNames.END_OF_LINE[number];
};
export type EndOfLineStatementType = AbstractStatementType & BaseType;
export type EndOfLineComponentType = AbstractComponentType & BaseType;
