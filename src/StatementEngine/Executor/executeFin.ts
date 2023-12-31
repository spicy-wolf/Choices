/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import * as StatementTypes from '../Types';
import type { ExecuteHelpersType } from './execute.type';

export const executeFin = (
  statement: StatementTypes.FinStatementType,
  helpers: ExecuteHelpersType
) => {
  if (!statement) return;

  helpers?.setPauseComponent?.({
    sourceStatementId: statement?.id,
    order: null, // fin component does not have order because it is always at the bottom
    type: statement.type,
  } as StatementTypes.FinComponentType);
};

