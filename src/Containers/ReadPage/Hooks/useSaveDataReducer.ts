/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import { useReducer } from 'react';
import * as Database from '@src/Database';

type SaveDataDispatchType =
  | { type: 'setValue'; payload: Database.Types.SaveDataType }
  | { type: 'updateStatementCursorPos'; payload: string }
  | { type: 'updateLogCursorPos'; payload: number }
  | {
    type: 'updateSaveDataContext';
    payload: Database.Types.SaveDataContext;
  }
  | { type: 'pushReadLogs'; payload: Database.Types.ReadLogType[] };

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
    } else if (action.type === 'updateStatementCursorPos') {
      if (action.payload !== state.statementCursorPos) {
        newState = { ...state, statementCursorPos: action.payload };
      }
    } else if (action.type === 'updateLogCursorPos') {
      if (action.payload !== state.logCursorPos) {
        newState = { ...state, logCursorPos: action.payload };
      }
    } else if (action.type === 'updateSaveDataContext') {
      newState = { ...state, context: action.payload };
    } else if (action.type === 'pushReadLogs') {
      const newLogs = action.payload;
      if (newLogs && newLogs.length > 0) {
        if (!state?.id) {
          throw 'unknown save data id';
        }

        // decorate before saving
        let readLogIndex = state?.readLogs?.length ?? 0;
        for (const log of newLogs) {
          log.saveDataId = state?.id;
          log.order = readLogIndex;
          log.timestamp = Date.now();
          readLogIndex++;
        }

        newState = {
          ...state,
          readLogs: state.readLogs.concat(newLogs),
        };
      }
    }

    return newState;
  };

  return useReducer(reducer, null);
};

export { useSaveDataReducer, SaveDataDispatchType };

