import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Trans } from 'react-i18next';
import * as Database from '@src/Database';
import * as StatementEngine from '@src/StatementEngine';
import { SaveDataItem } from './SaveDataItem';

type SaveAndLoadProps = {
  defaultSaveData: Database.Types.SaveDataType;
  loadSaveData: (saveDataId: string) => Promise<void>;
  createSaveData: (saveDataDescription: string) => Promise<string>;
  deleteSaveData: (saveDataId: string) => Promise<void>;
  saveDataList: Database.Types.SaveDataType[];
  setLoadingMsg: (loadingMsg: string) => void;
};
const SaveAndLoad = (props: SaveAndLoadProps) => {

  const [showAddSaveDataCard, setShowAddSaveDataCard] =
    React.useState<boolean>(false);
  const [saveDataDescription, setSaveDataDescription] =
    React.useState<string>();

  const addManualSaveData = async () => {
    if (!props.defaultSaveData) return;
    try {
      props.createSaveData(saveDataDescription);
    } catch (ex) {
      console.error(ex);
    } finally {
      setShowAddSaveDataCard(false);
    }
  };

  const loadSaveData = async (saveDataId: string) => {
    if (!saveDataId || !props.defaultSaveData?.id) return;
    try {
      props.loadSaveData(saveDataId);
    } catch (ex) {
      console.error(ex);
    } finally {
      props.setLoadingMsg('');
    }
  };

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
                  loadSaveData={loadSaveData}
                />
              </ListItem>
            ))}
        </List>
        {showAddSaveDataCard ? (
          <>
            <Grid
              container
              spacing={2}
              padding={1}
              onBlur={(event) => {
                // if the blur was because of outside focus
                // currentTarget is the parent element, relatedTarget is the clicked element
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  // when blur, e.g. side bar close, close the auto save
                  setShowAddSaveDataCard(false);
                }
              }}
            >
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  fullWidth
                  label={
                    <Trans i18nKey="saveAndLoad.saveDescriptionInput.label" />
                  }
                  multiline
                  rows={3}
                  value={saveDataDescription}
                  onChange={(event) => {
                    setSaveDataDescription(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  disabled={!saveDataDescription}
                  variant="contained"
                  component="a"
                  onClick={addManualSaveData}
                >
                  <Trans i18nKey="saveAndLoad.saveConfirmBtn.label" />
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  component="a"
                  onClick={() => setShowAddSaveDataCard(false)}
                >
                  <Trans i18nKey="saveAndLoad.saveCancelBtn.label" />
                </Button>
              </Grid>
            </Grid>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              setShowAddSaveDataCard(true);

              // generate default save data description
              let defaultSaveDataDescription: string = '';
              const readLogs = props.defaultSaveData?.readLogs as StatementEngine.Types.AnyComponentType[];
              if (!readLogs || readLogs.length === 0) {
                setSaveDataDescription('');
                return;
              }

              for (
                let i = readLogs.length - 1;
                i >= 0 && defaultSaveDataDescription.length <= 200;
                i--
              ) {
                const readLog = readLogs[i];
                if (
                  !StatementEngine.CheckStatementType.isParagraph(readLog) &&
                  !StatementEngine.CheckStatementType.isSentence(readLog)
                )
                  continue;

                const piece =
                  (
                    readLog as
                    | StatementEngine.Types.ParagraphComponentType
                    | StatementEngine.Types.SentenceComponentType
                  )?.data ?? '';
                defaultSaveDataDescription = `${piece
                  .replace(/(\r\n|\n|\r)/gm, '')
                  .trim()}${defaultSaveDataDescription}`;

              }
              setSaveDataDescription(defaultSaveDataDescription);
            }}
            sx={{ my: '0.5rem', mx: '1.5rem' }}
          >
            <Trans i18nKey="saveAndLoad.saveNewBtn.label" />
          </Button>
        )}
      </Stack>
    </>
  );
};

export { SaveAndLoad };
