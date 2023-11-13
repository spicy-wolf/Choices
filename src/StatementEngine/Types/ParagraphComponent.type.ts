import { StatementTypeNames } from '../Constants';
import { BaseComponentType } from './BaseComponent.type';

export type ParagraphComponentType = {
  type: typeof StatementTypeNames.PARAGRAPH[number];
  data: string;
} & BaseComponentType;
