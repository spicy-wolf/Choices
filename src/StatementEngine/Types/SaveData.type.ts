import { BaseComponentType } from './BaseComponent.type';

export type SaveDataType = {
  scriptCursorPos: string;
  logCursorPos: number;
  context: { [key: string]: any };
  readingLogs?: (BaseComponentType & { [key: string]: any })[];
};
