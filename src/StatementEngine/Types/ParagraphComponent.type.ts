/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { StatementTypeNames } from '../Constants';
import { BaseComponentType } from './BaseComponent.type';

export type ParagraphComponentType = {
  type: typeof StatementTypeNames.PARAGRAPH[number];
  data: string;
} & BaseComponentType;

