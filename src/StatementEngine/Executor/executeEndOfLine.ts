/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import * as StatementTypes from '../Types';
import type { ExecuteHelpersType } from './execute.type';

export const executeEndOfLine = (
  statement: StatementTypes.EndOfLineStatementType,
  helpers: ExecuteHelpersType
) => {
  if (!statement) return;

  const setSaveData = helpers?.setSaveData;
  if (!setSaveData) return;

  setSaveData((_saveData) => {
    const newSaveData = { ..._saveData };
    newSaveData.readLogs = _saveData.readLogs ? [..._saveData.readLogs] : [];
    // move to next statement
    newSaveData.scriptCursorPos = helpers?.defaultNextStatementId;

    const lastReadLogOrder = newSaveData.readLogs.at(-1)?.order ?? -1;
    // update reading log
    newSaveData.readLogs.push({
      sourceStatementId: statement.id,
      order: lastReadLogOrder + 1,
      type: statement.type,
    });

    return newSaveData;
  });
};

