import { BaseComponentType } from './BaseComponent.type';

export type SaveDataType = {
  scriptCursorPos: string;
  logCursorPos: number;
  context: { [key: string]: any };
  readLogs?: (BaseComponentType & { [key: string]: any })[];
};
