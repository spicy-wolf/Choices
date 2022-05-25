import { AnyStatementType } from './Statements';

export type ReadLogType = AnyStatementType & {
  saveDataId?: string;
  order?: number;
  timestamp?: number; // timestamp cannot be used as order due to collision
};
