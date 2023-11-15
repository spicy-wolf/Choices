export type ReadLogType = {
  saveDataId?: string; // TODO: remove me
  timestamp?: number; // timestamp cannot be used as order due to collision
  sourceStatementId: string;
  order: number;
  type: string;
  [key: string]: unknown; // extra data
};
