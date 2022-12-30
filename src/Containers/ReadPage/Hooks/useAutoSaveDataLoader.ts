import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDbContext } from '@src/Context/DbContext';
import * as Database from '@src/Database';
import * as StatementEngine from '@src/StatementEngine';
import { useDebounce } from '@src/Utils';

export const useAutoSaveDataLoader = (metadataId: string) => {
  const { dbContext } = useDbContext();

  const [error, setError] = useState<string>('');
  // const [groupedReadingLogs, setGroupedReadingLogs] =
  //   useState<Types.ReadLogType[][]>();

  // this is like a private value only use in this hook
  const currentSaveDataId = useRef<string>();
  const readingLogIndex = useRef<number>(null);

  const reducer = useCallback(
    (
      state: Database.Types.SaveDataType & {
        groupedReadingLogs: Database.Types.ReadLogType[][];
      },
      action:
        | { type: 'setAll'; payload: Database.Types.SaveDataType }
        | { type: 'updateScriptCursorPos'; payload: string }
        | { type: 'updateLogCursorPos'; payload: number }
        | {
            type: 'updateSaveDataContext';
            payload: Database.Types.SaveDataContext;
          }
        | { type: 'pushReadingLogs'; payload: Database.Types.ReadLogType[] }
    ) => {
      let newState = state;
      if (action.type === 'setAll') {
        if (action.payload === null) {
          newState = null;
        } else {
          const groupedReadingLogs = pushGroupedReadingLogs(
            null,
            action.payload?.readingLogs
          );
          newState = { ...action.payload, groupedReadingLogs };
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
        if (action.payload && action.payload.length > 0) {
          const groupedReadingLogs = pushGroupedReadingLogs(
            state.groupedReadingLogs,
            action.payload
          );
          newState = {
            ...state,
            readingLogs: state.readingLogs.concat(action.payload),
            groupedReadingLogs: groupedReadingLogs,
          };
        }
      }

      return newState;
    },
    []
  );
  const [saveData, saveDataDispatch] = useReducer(reducer, null);
  // since save data changed very frequently, debounced the value to reduce db access
  const debouncedSaveData = useDebounce(saveData, 500);

  useEffect(() => {
    init();

    return () => {
      currentSaveDataId.current = null;
      readingLogIndex.current = null;
      saveDataDispatch({ type: 'setAll', payload: null });
      setError('');
    };
  }, [metadataId, dbContext]);

  const init = async () => {
    if (!dbContext) return;

    if (metadataId) {
      try {
        // load all save data into a list
        let _autoSaveData: Database.Types.SaveDataType =
          await dbContext.getAutoSaveDataFromMetadataId(metadataId);
        // if did not find one, then init one
        if (!_autoSaveData) {
          _autoSaveData = {
            id: uuidv4(),
            metadataId: metadataId, // parent id
            description: '', // a short description for this piece of savedata
            timestamp: Date.now(),

            scriptCursorPos: '',
            logCursorPos: null,

            context: {},
            readingLogs: [],
          };
        } else {
          if (!_autoSaveData.readingLogs) _autoSaveData.readingLogs = [];
          // TODO: maybe also update the metadata date? e.g. last read repo
        }
        currentSaveDataId.current = _autoSaveData.id;
        readingLogIndex.current = _autoSaveData.readingLogs.length;

        saveDataDispatch({ type: 'setAll', payload: _autoSaveData });
        setError('');
      } catch (err) {
        setError(err);
      }
    }
  };

  // while update each part, also trigger DB update
  useEffect(() => {
    updateSaveDataDb();
  }, [debouncedSaveData, dbContext]);

  const updateSaveDataDb = async () => {
    if (!dbContext) return;
    if (!currentSaveDataId.current) return;

    // build new save data, remove extra properties
    const _saveDate: Database.Types.SaveDataType = {
      id: currentSaveDataId.current,
      metadataId: metadataId, // parent id
      description: '', // empty string means this is 'auto save data'
      timestamp: Date.now(),

      scriptCursorPos: debouncedSaveData.scriptCursorPos,
      logCursorPos: debouncedSaveData.logCursorPos,

      context: debouncedSaveData.context,
      readingLogs: debouncedSaveData.readingLogs,
    };

    dbContext.putSaveData(_saveDate);
  };

  //#region update wrapper
  const updateScriptCursorPos = async (
    _scriptCursorPos: string
  ): Promise<void> => {
    saveDataDispatch({
      type: 'updateScriptCursorPos',
      payload: _scriptCursorPos,
    });
  };

  const updateLogCursorPos = async (_logCursorPos: number): Promise<void> => {
    saveDataDispatch({
      type: 'updateLogCursorPos',
      payload: _logCursorPos,
    });
  };

  const updateSaveDataContext = async (
    _saveDataContext: Database.Types.SaveDataContext
  ): Promise<void> => {
    saveDataDispatch({
      type: 'updateSaveDataContext',
      payload: _saveDataContext,
    });
  };

  const pushReadingLogs = async (
    newLogs: Database.Types.ReadLogType[]
  ): Promise<void> => {
    if (!currentSaveDataId.current) {
      setError('unknown save data id');
    }
    if (readingLogIndex.current === null) {
      setError('invalid reading log index');
    }

    // decorate before saving
    for (const log of newLogs) {
      log.saveDataId = currentSaveDataId.current;
      log.order = readingLogIndex.current;
      log.timestamp = Date.now();
      readingLogIndex.current++;
    }

    saveDataDispatch({
      type: 'pushReadingLogs',
      payload: newLogs,
    });
  };
  //#endregion

  const pickedSaveData = useMemo(
    () => ({
      scriptCursorPos: saveData?.scriptCursorPos,
      logCursorPos: saveData?.logCursorPos,
      saveDataContext: saveData?.context,
      groupedReadingLogs: saveData?.groupedReadingLogs,
    }),
    [saveData]
  );
  const saveDataFunc = useMemo(
    () => ({
      updateScriptCursorPos,
      updateLogCursorPos,
      updateSaveDataContext,
      pushReadingLogs,
    }),
    [saveDataDispatch]
  );
  const isLoaded = useMemo(() => !!saveData, [saveData]);

  return [pickedSaveData, saveDataFunc, isLoaded, error] as const;
};

const pushGroupedReadingLogs = (
  prevGroupedReadingLogs: Database.Types.ReadLogType[][],
  newReadingLogs: Database.Types.ReadLogType[]
): Database.Types.ReadLogType[][] => {
  let groupedReadingLogs = prevGroupedReadingLogs ?? [];
  groupedReadingLogs = groupedReadingLogs.slice(); // prepare a copy

  if (newReadingLogs) {
    for (let log of newReadingLogs) {
      if (!log) continue;

      const prevGrouped = groupedReadingLogs[groupedReadingLogs.length - 1];
      if (prevGrouped) {
        const lastLogInPrevGrouped = prevGrouped[prevGrouped.length - 1];
        if (
          StatementEngine.CheckStatementType.isSentence(log) &&
          StatementEngine.CheckStatementType.isSentence(lastLogInPrevGrouped)
        ) {
          prevGrouped.push(log);
        } else {
          groupedReadingLogs.push([log]);
        }
      } else {
        groupedReadingLogs.push([log]);
      }
    }
  }

  return groupedReadingLogs;
};
