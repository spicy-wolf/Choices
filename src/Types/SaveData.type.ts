export type SaveDataType = {
  id?: string;
  scriptId?: string; // parent id
  description: string; // a short description for this piece of savedata
  timestamp: number;
  scriptCursorPos: string;
  logCursorPos: string;
  saveData: {
    [key: string]: any;
  };
};
