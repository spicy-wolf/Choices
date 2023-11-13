import * as StatementTypes from '../Types';
import type { ExecuteHelpersType } from './Execute.type';

export const executeEndOfLine = (
  statement: StatementTypes.EndOfLineStatementType,
  helpers: ExecuteHelpersType
) => {
  if (!statement) return;

  const setSaveData = helpers?.setSaveData;
  if (!setSaveData) return;

  setSaveData((_saveData) => {
    const newSaveData = { ..._saveData };
    newSaveData.readingLogs = [..._saveData.readingLogs];
    // move to next statement
    newSaveData.scriptCursorPos = helpers?.defaultNextStatementId;

    const lastReadLogOrder = newSaveData.readingLogs.at(-1)?.order ?? -1;
    // update reading log
    newSaveData.readingLogs.push({
      sourceStatementId: statement.id,
      order: lastReadLogOrder + 1,
      type: statement.type,
    });

    return newSaveData;
  });
};
