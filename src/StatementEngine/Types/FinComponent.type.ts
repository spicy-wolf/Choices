import { StatementTypeNames } from '../Constants';
import { BaseComponentType } from './BaseComponent.type';

export type FinComponentType = {
  type: typeof StatementTypeNames.FIN[number];
} & BaseComponentType;
