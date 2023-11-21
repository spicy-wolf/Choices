import { StatementTypeNames } from '../Constants';
import { BaseComponentType } from './BaseComponent.type';

export type JumpComponentType = {
  type: typeof StatementTypeNames.JUMP[number];
  targetId: string;
} & BaseComponentType;
