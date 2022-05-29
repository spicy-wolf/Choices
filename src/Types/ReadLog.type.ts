import { Types } from '@src/StatementEngine';

export type ReadLogType = Types.AnyStatementType & {
  saveDataId?: string;
  order?: number;
  timestamp?: number; // timestamp cannot be used as order due to collision
};
