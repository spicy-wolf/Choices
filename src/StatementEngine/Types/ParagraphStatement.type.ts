import { StatementTypeNames } from '../Constants';
import { BaseStatementType } from './BaseStatement.type';

export type ParagraphStatementType = {
  type: typeof StatementTypeNames.PARAGRAPH[number];
  data: string;
} & BaseStatementType;
