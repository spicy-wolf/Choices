import { ReadLogType } from './ReadLog.type';
import { SaveDataContext } from './SaveDataContext.type';

export type SaveDataType = {
  id?: string;
  metadataId?: string; // parent id
  description: string; // a short description for this piece of savedata
  timestamp: number;

  scriptCursorPos: string;
  logCursorPos: number;

  context: SaveDataContext;
  readingLogs?: ReadLogType[];
};
