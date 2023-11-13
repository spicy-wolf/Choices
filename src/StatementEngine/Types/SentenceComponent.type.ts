import { StatementTypeNames } from '../Constants';
import { BaseComponentType } from './BaseComponent.type';

export type SentenceComponentType = {
  type: typeof StatementTypeNames.SENTENCE[number];
  data: string;
} & BaseComponentType;
