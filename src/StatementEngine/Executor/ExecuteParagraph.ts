import * as StatementTypes from '../Types';
import type { ExecuteHelpersType } from './Execute.type';
import { splitLongSentences } from '../Helper';

export const executeParagraph = (
  statement: StatementTypes.ParagraphStatementType,
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
    let lastReadLogOrder = newSaveData.readingLogs.at(-1)?.order ?? -1;
    const shorterSentences: StatementTypes.SentenceComponentType[] =
      splitLongSentences(statement.data)?.map((s, index) => ({
        sourceStatementId: statement.id,
        order: lastReadLogOrder + index + 1,
        type: 's',
        data: s,
      }));
    newSaveData.readingLogs = newSaveData.readingLogs.concat(shorterSentences);

    // add eol
    lastReadLogOrder = newSaveData.readingLogs.at(-1)?.order ?? -1;
    newSaveData.readingLogs.push({
      sourceStatementId: statement.id,
      order: lastReadLogOrder + 1,
      type: 'eol',
    });

    return newSaveData;
  });
};
