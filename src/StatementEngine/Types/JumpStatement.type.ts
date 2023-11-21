import { StatementTypeNames } from '../Constants';
import { BaseStatementType } from './BaseStatement.type';

export type JumpStatementType = {
  type: typeof StatementTypeNames.JUMP[number];
  targetId: string;
} & BaseStatementType;
