import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useDbContext } from '@src/Context/DbContext';
import * as Database from '@src/Database';
import { useDebounce } from '@src/Utils';

const useSaveData = (metadataId: string) => {
  const { dbContext } = useDbContext();

  const [error, setError] = useState<string>('');

  const [saveDataList, setSaveDataList] =
    useState<Database.Types.SaveDataType[]>();

  const [defaultSaveData, setDefaultSaveData] =
    useState<Database.Types.SaveDataType>();

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
              description: '', // default save data does not have description
              createTimestamp: Date.now(),
              saveDataType: 'default',

              scriptCursorPos: '',
              logCursorPos: null,

              context: {},
              readLogs: [],
            };
            const _defaultSaveDataId = await addSaveData(_defaultSaveData);
            _defaultSaveData.id = _defaultSaveDataId;
            _saveDataList.push(_defaultSaveData);
          }

          setDefaultSaveData(_defaultSaveData);
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
    const saveDataId = await dbContext.addSaveData(_saveData);
    await refreshSaveDataList();
    return saveDataId;
  };
  const updateSaveData = async (_saveData: Database.Types.SaveDataType) => {
    await dbContext.putSaveData(_saveData);
    await refreshSaveDataList();
  };
  const deleteSaveData = async (saveDataId: string) => {
    await dbContext.deleteSaveDataFromId(saveDataId);
    await refreshSaveDataList();
  };
  const createSaveData = async (saveDataDescription: string) => {
    if (!defaultSaveData) return;

    const newSaveData = JSON.parse(
      JSON.stringify(defaultSaveData)
    ) as Database.Types.SaveDataType;
    newSaveData.description = saveDataDescription;
    newSaveData.saveDataType = 'manual';
    newSaveData.id = uuid();
    newSaveData.createTimestamp = Date.now();
    const saveDataId = await addSaveData(newSaveData);

    await refreshSaveDataList();
    return saveDataId;
  };
  const loadSaveData = async (saveDataId: string) => {
    const saveData = await dbContext.getSaveDataFromId(saveDataId);
    if (!saveData) return;

    const newSaveData = JSON.parse(
      JSON.stringify(saveData)
    ) as Database.Types.SaveDataType;
    newSaveData.description = '';
    newSaveData.saveDataType = 'default';
    newSaveData.id = defaultSaveData.id ?? uuid();
    newSaveData.createTimestamp = Date.now();
    setDefaultSaveData(defaultSaveData);
  };
  const refreshSaveDataList = async () => {
    let _saveDataList: Database.Types.SaveDataType[] =
      (await dbContext.getAllSaveDataFromMetadataId(metadataId)) ?? [];
    setSaveDataList(_saveDataList);
  };

  return [
    {
      saveDataList,
      createSaveData,
      loadSaveData,
      deleteSaveData,
      defaultSaveData,
      setDefaultSaveData,
    },
    error,
  ] as const;
};

export { useSaveData };
