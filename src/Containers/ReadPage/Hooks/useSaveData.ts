import { useEffect, useState } from 'react';
import { useDbContext } from '@src/Context/DbContext';
import * as Database from '@src/Database';
import { useSaveDataReducer } from './useSaveDataReducer';
import { useDebounce } from '@src/Utils';

const useSaveData = (metadataId: string) => {
  const { dbContext } = useDbContext();

  const [error, setError] = useState<string>('');

  const [saveDataList, setSaveDataList] =
    useState<Database.Types.SaveDataType[]>();

  const [defaultSaveData, defaultSaveDataDispatch] = useSaveDataReducer();

  const debouncedDefaultSaveData = useDebounce(defaultSaveData, 500);

  useEffect(() => {
    const init = async () => {
      if (!dbContext) return;

      if (metadataId) {
        try {
          // load all save data into a list
          let _saveDataList: Database.Types.SaveDataType[] =
            (await dbContext.getAllSaveDataFromMetadataId(metadataId)) ?? [];

          let _defaultSaveData = _saveDataList?.find(
            (item) => item.saveDataType === 'default'
          );
          if (_defaultSaveData) {
            _defaultSaveData = await dbContext.getSaveDataFromId(
              _defaultSaveData?.id
            );
          } else {
            _defaultSaveData = {
              id: null,
              metadataId: metadataId, // parent id
              description: '', // a short description for this piece of savedata
              createTimestamp: Date.now(),
              saveDataType: 'default',

              scriptCursorPos: '',
              logCursorPos: null,

              context: {},
              readingLogs: [],
            };
            const _defaultSaveDataId = await dbContext.addSaveData(
              _defaultSaveData
            );
            _defaultSaveData.id = _defaultSaveDataId;
            _saveDataList.push(_defaultSaveData);
          }

          defaultSaveDataDispatch({
            type: 'setValue',
            payload: _defaultSaveData,
          });
          setSaveDataList(_saveDataList);
          setError('');
        } catch (err) {
          setError(err);
        }
      }
    };

    init();
  }, [metadataId]);

  useEffect(() => {
    if (debouncedDefaultSaveData) {
      updateSaveData(debouncedDefaultSaveData);
    }
  }, [debouncedDefaultSaveData]);

  const addSaveData = async (_saveData: Database.Types.SaveDataType) => {
    await dbContext.addSaveData(_saveData);
    await refreshSaveDataList();
  };
  const updateSaveData = async (_saveData: Database.Types.SaveDataType) => {
    await dbContext.putSaveData(_saveData);
    await refreshSaveDataList();
  };
  const deleteSaveData = async (saveDataId: string) => {
    await dbContext.deleteSaveDataFromId(saveDataId);
    await refreshSaveDataList();
  };
  const refreshSaveDataList = async () => {
    let _saveDataList: Database.Types.SaveDataType[] =
      (await dbContext.getAllSaveDataFromMetadataId(metadataId)) ?? [];
    setSaveDataList(_saveDataList);
  };

  return [
    {
      saveDataList,
      addSaveData,
      deleteSaveData,
      defaultSaveData,
      defaultSaveDataDispatch,
    },
    error,
  ] as const;
};

export { useSaveData };
