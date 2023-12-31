/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { StatementTypeNames } from '../Constants';
import { BaseStatementType } from './BaseStatement.type';

export type ParagraphStatementType = {
  type: typeof StatementTypeNames.PARAGRAPH[number];
  data: string;
} & BaseStatementType;

