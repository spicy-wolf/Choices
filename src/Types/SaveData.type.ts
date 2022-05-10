export type SaveDataType = {
  id?: string;
  description: string; // a short description for this piece of savedata
  timestamp: number;
  scriptCursorPos: string;
  logCursorPos: string;
  [key: string]: any;
};
