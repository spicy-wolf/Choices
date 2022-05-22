import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDbContext } from '@src/Context/DbContext';
import * as Types from '@src/Types';

type AnyStatementType = Types.Statements.AnyStatementType;
type SaveDataType = Types.SaveDataType;
type ReadLogType = Types.ReadLogType;

export const useSaveData = (metadataId: string) => {
  const { dbContext } = useDbContext();
  const [allSaveData, setAllSaveData] = useState<SaveDataType[]>(null);
  const [selectedSaveData, setSelectedSaveData] = useState<SaveDataType>(null);
  const [selectedReadingLog, setSelectedReadingLog] =
    useState<ReadLogType[]>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    init();

    return () => {
      setAllSaveData(null);
      setSelectedSaveData(null);
      setSelectedReadingLog(null);
      setError('');
    };
  }, [metadataId, dbContext]);

  const init = async () => {
    if (!dbContext) return;

    if (metadataId) {
      try {
        // load all save data into a list
        let _allSaveData =
          (await dbContext.getAllSaveDataFromMetadataId(metadataId)) ?? [];
        let _selectedSaveData: SaveDataType = _allSaveData?.find(
          (item) => !item.description // description is empty means autosave
        );

        // if no autosave data
        if (!_allSaveData || _allSaveData.length === 0 || !_selectedSaveData) {
          const initSaveData: SaveDataType = {
            id: uuidv4(),
            scriptId: metadataId, // parent id
            description: '', // autosave spot description is blank
            timestamp: Date.now(),
            scriptCursorPos: '',
            logCursorPos: '',
            saveData: {},
          };
          // TODO: add default one to DB
          setAllSaveData([..._allSaveData, initSaveData]);
          setSelectedSaveData(initSaveData);
          setSelectedReadingLog([]);
        } else {
          setAllSaveData(_allSaveData);
          setSelectedSaveData(_selectedSaveData);

          // find reading log
          const _selectedReadingLog: ReadLogType[] =
            (await dbContext.getReadLogsFromSaveDataId(_selectedSaveData.id)) ??
            [];

          setSelectedReadingLog(_selectedReadingLog);
        }
      } catch (err) {
        setError(err);
      }
    }
  };

  return [allSaveData, selectedSaveData, selectedReadingLog, error] as const;
};
