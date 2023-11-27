import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Trans } from 'react-i18next';
import * as Database from '@src/Database';
import { SaveDataItem } from './SaveDataItem';
import { AddSaveDataCard } from './AddSaveDataCard';

type SaveAndLoadProps = {
  defaultSaveData: Database.Types.SaveDataType;
  loadSaveData: (saveDataId: string) => Promise<void>;
  createSaveData: (saveDataDescription: string) => Promise<string>;
  deleteSaveData: (saveDataId: string) => Promise<void>;
  saveDataList: Database.Types.SaveDataType[];
  setLoadingMsg: (loadingMsg: string) => void;
};
export const SaveAndLoad = (props: SaveAndLoadProps) => {
  return (
    <>
      <Stack sx={{ height: '100%' }}>
        <Typography variant="h4" sx={{ py: 3, px: 3 }}>
          <Trans i18nKey="saveAndLoad.label" />
        </Typography>
        <List sx={{ overflow: 'auto', flexGrow: 1 }}>
          {props.saveDataList
            ?.sort(
              // sort by creation data desc
              (saveData1, saveData2) =>
                saveData2.createTimestamp - saveData1.createTimestamp
            )
            .filter((saveData) => saveData.saveDataType === 'manual')
            .map((saveData) => (
              <ListItem key={saveData?.id}>
                <SaveDataItem
                  saveData={saveData}
                  deleteSaveData={props.deleteSaveData}
                  loadSaveData={props.loadSaveData}
                />
              </ListItem>
            ))}
        </List>
        <AddSaveDataCard
          defaultSaveData={props.defaultSaveData}
          createSaveData={props.createSaveData}
        />
      </Stack>
    </>
  );
};
