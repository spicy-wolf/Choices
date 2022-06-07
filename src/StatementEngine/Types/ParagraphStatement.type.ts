import { StatementTypeNames } from '../Constants';
import {
  AbstractComponentType,
  AbstractStatementType,
} from './AbstractStatement.type';

type BaseType = {
  type: typeof StatementTypeNames.PARAGRAPH[number];
  data: string;
};
export type ParagraphStatementType = AbstractStatementType & BaseType;
export type ParagraphComponentType = AbstractComponentType & BaseType;
