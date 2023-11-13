import * as StatementTypes from '../Types';
import type { ExecuteHelpersType } from './Execute.type';
import { splitLongSentences } from '../Helper';

export const executeSentence = (
  statement: StatementTypes.SentenceStatementType,
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

    // add read logs
    const lastReadLogOrder = newSaveData.readingLogs.at(-1)?.order ?? -1;
    const shorterSentences: StatementTypes.SentenceComponentType[] =
      splitLongSentences(statement.data)?.map((s, index) => ({
        sourceStatementId: statement.id,
        order: lastReadLogOrder + index + 1,
        type: statement.type,
        data: s,
      }));
    newSaveData.readingLogs = newSaveData.readingLogs.concat(shorterSentences);

    return newSaveData;
  });
};
