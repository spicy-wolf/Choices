import { BaseComponentType } from './BaseComponent.type';

export type SaveDataType = {
  scriptCursorPos: string;
  logCursorPos: number;
  context: { [key: string]: unknown };
  readLogs?: (BaseComponentType & { [key: string]: unknown })[];
};
