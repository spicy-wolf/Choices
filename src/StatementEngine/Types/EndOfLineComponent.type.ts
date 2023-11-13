import { StatementTypeNames } from '../Constants';
import { BaseComponentType } from './BaseComponent.type';

export type EndOfLineComponentType = {
  type: typeof StatementTypeNames.END_OF_LINE[number];
} & BaseComponentType;
