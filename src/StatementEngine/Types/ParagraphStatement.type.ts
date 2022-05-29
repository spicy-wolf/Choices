import { StatementTypeNames } from '../Constants';
import { AbstractStatementType } from './AbstractStatement.type';

export type ParagraphStatementType = AbstractStatementType & {
  type: typeof StatementTypeNames.PARAGRAPH[number];
  data: string;
};
