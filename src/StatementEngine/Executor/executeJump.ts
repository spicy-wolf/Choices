import * as StatementTypes from '../Types';
import type { ExecuteHelpersType } from './execute.type';

export const executeJump = (
  statement: StatementTypes.JumpStatementType,
  helpers: ExecuteHelpersType
) => {
  if (!statement) return;

  helpers?.setSaveData?.((_saveData) => {
    const newSaveData = { ..._saveData };

    if (!statement?.targetId) {
      // console.error // or log exception
    } else {
      // move to given statement
      newSaveData.scriptCursorPos = statement.targetId;
    }

    return newSaveData;
  });
};
