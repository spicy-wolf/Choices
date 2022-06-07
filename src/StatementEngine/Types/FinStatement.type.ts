import { StatementTypeNames } from '../Constants';
import {
  AbstractComponentType,
  AbstractStatementType,
} from './AbstractStatement.type';

type BaseType = {
  type: typeof StatementTypeNames.FIN[number];
};
export type FinStatementType = AbstractStatementType & BaseType;
export type FinComponentType = AbstractComponentType & BaseType;
