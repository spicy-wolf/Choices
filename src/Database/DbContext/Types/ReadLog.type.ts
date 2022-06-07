import { Types } from '@src/StatementEngine';

export type ReadLogType = Types.LogComponentType & {
  saveDataId: string;
  timestamp?: number; // timestamp cannot be used as order due to collision
};
