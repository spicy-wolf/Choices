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
import * as Types from '@src/Types';
import * as StatementEngine from '@src/StatementEngine';

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
      state: Types.SaveDataType & { groupedReadingLogs: Types.ReadLogType[][] },
      action:
        | { type: 'setAll'; payload: Types.SaveDataType }
        | { type: 'updateScriptCursorPos'; payload: string }
        | { type: 'updateLogCursorPos'; payload: string }
        | { type: 'updateSaveDataContext'; payload: Types.SaveDataContext }
        | { type: 'pushReadingLogs'; payload: Types.ReadLogType[] }
    ) => {
      if (action.type === 'setAll') {
        const groupedReadingLogs = pushGroupedReadingLogs(
          null,
          action.payload.readingLogs
        );
        return { ...action.payload, groupedReadingLogs };
      } else if (action.type === 'updateScriptCursorPos') {
        return { ...state, scriptCursorPos: action.payload };
      } else if (action.type === 'updateLogCursorPos') {
        return { ...state, logCursorPos: action.payload };
      } else if (action.type === 'updateSaveDataContext') {
        return { ...state, context: action.payload };
      } else if (action.type === 'pushReadingLogs') {
        const groupedReadingLogs = pushGroupedReadingLogs(
          state.groupedReadingLogs,
          action.payload
        );
        return {
          ...state,
          readingLogs: state.readingLogs.concat(action.payload),
          groupedReadingLogs: groupedReadingLogs,
        };
      } else {
        return state;
      }
    },
    []
  );
  const [saveData, saveDataDispatch] = useReducer(reducer, null);

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
        let _autoSaveData: Types.SaveDataType =
          await dbContext.getAutoSaveDataFromMetadataId(metadataId);
        // if did not find one, then init one
        if (!_autoSaveData) {
          _autoSaveData = {
            id: uuidv4(),
            metadataId: metadataId, // parent id
            description: '', // a short description for this piece of savedata
            timestamp: Date.now(),

            scriptCursorPos: '',
            logCursorPos: '',

            context: {},
            readingLogs: [],
          };
          // TODO: call DB add
        } else {
          if (!_autoSaveData.readingLogs) _autoSaveData.readingLogs = [];
          // TODO: call DB put to update the date
          // TODO: maybe also update the metadata date? e.g. last read repo
        }
        currentSaveDataId.current = _autoSaveData.id;
        readingLogIndex.current = _autoSaveData.readingLogs.length;

        saveDataDispatch({ type: 'setAll', payload: _autoSaveData });
      } catch (err) {
        setError(err);
      }
    }
  };

  // while update each part, also trigger DB update
  useEffect(() => {
    updateSaveDataDb();
  }, [saveData, dbContext]);

  const updateSaveDataDb = async () => {
    if (!dbContext) return;
    if (!currentSaveDataId.current) {
      setError('unknown save data id');
    }
    // build new save data, remove extra properties
    const _saveDate: Types.SaveDataType = {
      id: currentSaveDataId.current,
      metadataId: metadataId, // parent id
      description: '', // empty string means this is 'auto save data'
      timestamp: Date.now(),

      scriptCursorPos: saveData.scriptCursorPos,
      logCursorPos: saveData.logCursorPos,

      context: saveData.context,
      readingLogs: saveData.readingLogs,
    };

    dbContext.putSaveData(_saveDate);
  };

  //#region update wrapper
  const updateScriptCursorPos = async (_scriptCursorPos: string) => {
    saveDataDispatch({
      type: 'updateScriptCursorPos',
      payload: _scriptCursorPos,
    });
  };

  const updateLogCursorPos = async (_logCursorPos: string) => {
    saveDataDispatch({
      type: 'updateLogCursorPos',
      payload: _logCursorPos,
    });
  };

  const updateSaveDataContext = async (
    _saveDataContext: Types.SaveDataContext
  ) => {
    saveDataDispatch({
      type: 'updateSaveDataContext',
      payload: _saveDataContext,
    });
  };

  const pushReadingLogs = async (newLogs: Types.ReadLogType[]) => {
    if (!currentSaveDataId.current) {
      setError('unknown save data id');
    }
    if (readingLogIndex.current === null) {
      setError('invalid reading log index');
    }

    // decorate before saving
    for (const log of newLogs) {
      log.scriptId = currentSaveDataId.current;
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
      readingLogs: saveData?.groupedReadingLogs,
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
  prevGroupedReadingLogs: Types.ReadLogType[][],
  newReadingLogs: Types.ReadLogType[]
): Types.ReadLogType[][] => {
  let groupedReadingLogs = prevGroupedReadingLogs ?? [];
  groupedReadingLogs = groupedReadingLogs.slice(); // prepare a copy

  for (let log of newReadingLogs) {
    if (!log) continue;

    const prevGrouped =
      prevGroupedReadingLogs[prevGroupedReadingLogs.length - 1];
    if (prevGrouped) {
      const lastLogInPrevGrouped = prevGrouped[prevGrouped.length - 1];
      if (
        StatementEngine.isSentence(log) &&
        StatementEngine.isSentence(lastLogInPrevGrouped)
      ) {
        prevGrouped.push(log);
      } else {
        groupedReadingLogs.push([log]);
      }
    } else {
      groupedReadingLogs.push([log]);
    }
  }

  return groupedReadingLogs;
};
