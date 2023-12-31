/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { StatementTypeNames } from '../Constants';
import { BaseStatementType } from './BaseStatement.type';

export type EndOfLineStatementType = {
  type: typeof StatementTypeNames.END_OF_LINE[number];
} & BaseStatementType;

