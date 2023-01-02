import { useReducer } from 'react';
import * as Database from '@src/Database';

type SaveDataDispatchType =
  | { type: 'setValue'; payload: Database.Types.SaveDataType }
  | { type: 'updateScriptCursorPos'; payload: string }
  | { type: 'updateLogCursorPos'; payload: number }
  | {
      type: 'updateSaveDataContext';
      payload: Database.Types.SaveDataContext;
    }
  | { type: 'pushReadingLogs'; payload: Database.Types.ReadLogType[] };

const useSaveDataReducer = () => {
  const reducer = (
    state: Database.Types.SaveDataType,
    action: SaveDataDispatchType
  ) => {
    let newState = state;
    if (action.type === 'setValue') {
      if (action.payload === null) {
        newState = null;
      } else {
        newState = { ...action.payload };
      }
    } else if (action.type === 'updateScriptCursorPos') {
      if (action.payload !== state.scriptCursorPos) {
        newState = { ...state, scriptCursorPos: action.payload };
      }
    } else if (action.type === 'updateLogCursorPos') {
      if (action.payload !== state.logCursorPos) {
        newState = { ...state, logCursorPos: action.payload };
      }
    } else if (action.type === 'updateSaveDataContext') {
      newState = { ...state, context: action.payload };
    } else if (action.type === 'pushReadingLogs') {
      const newLogs = action.payload;
      if (newLogs && newLogs.length > 0) {
        if (!state?.id) {
          throw 'unknown save data id';
        }

        // decorate before saving
        let readingLogIndex = state?.readingLogs?.length ?? 0;
        for (const log of newLogs) {
          log.saveDataId = state?.id;
          log.order = readingLogIndex;
          log.timestamp = Date.now();
          readingLogIndex++;
        }

        newState = {
          ...state,
          readingLogs: state.readingLogs.concat(newLogs),
        };
      }
    }

    return newState;
  };

  return useReducer(reducer, null);
};

export { useSaveDataReducer, SaveDataDispatchType };
