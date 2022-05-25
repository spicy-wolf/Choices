import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDbContext } from '@src/Context/DbContext';
import * as Types from '@src/Types';

export const useAutoSaveDataLoader = (metadataId: string) => {
  const { dbContext } = useDbContext();

  const [error, setError] = useState<string>('');
  const [scriptCursorPos, setScriptCursorPos] = useState<string>('');
  const [logCursorPos, setLogCursorPos] = useState<string>('');
  const [saveDataContext, setSaveDataContext] =
    useState<Types.SaveDataContext>();
  const [readingLogs, setReadingLogs] = useState<Types.ReadLogType[]>();

  // this is like a private value only use in this hook
  const currentSaveDataId = useRef<string>();
  const readingLogIndex = useRef<number>(null);

  useEffect(() => {
    init();

    return () => {
      currentSaveDataId.current = null;
      readingLogIndex.current = null;
      setScriptCursorPos('');
      setLogCursorPos('');
      setSaveDataContext(null);
      setReadingLogs(null);
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

        setScriptCursorPos(_autoSaveData.scriptCursorPos);
        setLogCursorPos(_autoSaveData.logCursorPos);
        setSaveDataContext(_autoSaveData.context);

        // TODO: convert to group
        setReadingLogs(_autoSaveData.readingLogs);
      } catch (err) {
        setError(err);
      }
    }
  };

  // while update each part, also trigger DB update
  useEffect(() => {
    updateSaveData();
  }, [scriptCursorPos, logCursorPos, saveDataContext, readingLogs, dbContext]);

  const updateSaveData = async () => {
    if (!dbContext) return;
    if (!currentSaveDataId.current) {
      setError('unknown save data id');
    }
    // build new save data
    const _saveDate: Types.SaveDataType = {
      id: currentSaveDataId.current,
      metadataId: metadataId, // parent id
      description: '', // empty string means this is 'auto save data'
      timestamp: Date.now(),

      scriptCursorPos: scriptCursorPos,
      logCursorPos: logCursorPos,

      context: saveDataContext,
      readingLogs: readingLogs,
    };

    dbContext.putSaveData(_saveDate);
  };

  //#region update wrapper
  const updateScriptCursorPos = async (_scriptCursorPos: string) => {
    setScriptCursorPos(_scriptCursorPos);
  };

  const updateLogCursorPos = async (_logCursorPos: string) => {
    setLogCursorPos(_logCursorPos);
  };

  const updateSaveDataContext = async (
    _saveDataContext: Types.SaveDataContext
  ) => {
    setSaveDataContext(_saveDataContext);
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

    setReadingLogs(readingLogs.concat(newLogs));
  };
  //#endregion

  return [
    { scriptCursorPos, logCursorPos, saveDataContext, readingLogs },
    {
      updateScriptCursorPos,
      updateLogCursorPos,
      updateSaveDataContext,
      pushReadingLogs,
    },
    error,
  ] as const;
};
