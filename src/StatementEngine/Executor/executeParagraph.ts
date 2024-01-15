/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import * as StatementTypes from '../Types';
import type { ExecuteHelpersType } from './execute.type';
import { splitLongSentences } from '../Helper';

export const executeParagraph = (
  statement: StatementTypes.ParagraphStatementType,
  helpers: ExecuteHelpersType
) => {
  if (!statement) return;

  helpers?.setSaveData?.((_saveData) => {
    const newSaveData = { ..._saveData };
    newSaveData.readLogs = _saveData.readLogs ? [..._saveData.readLogs] : [];
    // move to next statement
    newSaveData.statementCursorPos = helpers?.defaultNextStatementId;

    // add read logs
    let lastReadLogOrder = newSaveData.readLogs.at(-1)?.order ?? -1;
    const shorterSentences: StatementTypes.SentenceComponentType[] =
      splitLongSentences(statement.data)?.map((s, index) => ({
        sourceStatementId: statement.id,
        order: lastReadLogOrder + index + 1,
        type: 's',
        data: s,
      }));
    newSaveData.readLogs = newSaveData.readLogs.concat(shorterSentences);

    // add eol
    lastReadLogOrder = newSaveData.readLogs.at(-1)?.order ?? -1;
    newSaveData.readLogs.push({
      sourceStatementId: statement.id,
      order: lastReadLogOrder + 1,
      type: 'eol',
    });

    return newSaveData;
  });
};

