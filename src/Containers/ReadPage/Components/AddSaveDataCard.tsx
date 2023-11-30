import React from 'react';
import * as StatementEngine from '@src/StatementEngine';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import * as Database from '@src/Database';
import { useTranslation } from 'react-i18next';
import { LoadingIndicatorModal } from '@src/Containers/components';

type AddSaveDataCardprops = {
  defaultSaveData: Database.Types.SaveDataType;
  createSaveData: (saveDataDescription: string) => Promise<string>;
};

export const AddSaveDataCard = (props: AddSaveDataCardprops) => {
  const [showAddSaveDataCard, setShowAddSaveDataCard] =
    React.useState<boolean>(false);
  const [saveDataDescription, setSaveDataDescription] =
    React.useState<string>();

  const [showSavingModal, setShowSavingModal] = React.useState<boolean>(false);

  const { t } = useTranslation();

  const addManualSaveData = async () => {
    if (!props.defaultSaveData) return;
    try {
      setShowSavingModal(true);
      await props.createSaveData?.(saveDataDescription);
      setShowAddSaveDataCard(false);
      setShowSavingModal(false);
    } catch (ex) {
      console.error(ex);
    }
  };

  const onSaveButtonClick = () => {
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
  };

  return (<>
    {showAddSaveDataCard && <Grid
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
          label={t('saveAndLoad.saveDescriptionInput.label')}
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
          {t('saveAndLoad.saveConfirmBtn.label')}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          fullWidth
          variant="outlined"
          component="a"
          disabled={!props.defaultSaveData} // edge case, if no defaultSaveData, then disable the button
          onClick={() => setShowAddSaveDataCard(false)}
        >
          {t('saveAndLoad.saveCancelBtn.label')}
        </Button>
      </Grid>
    </Grid>}
    {!showAddSaveDataCard && <Button
      variant="contained"
      onClick={onSaveButtonClick}
      disabled={!props.defaultSaveData} // edge case, if no defaultSaveData, then disable the button
      sx={{ my: '0.5rem', mx: '1.5rem' }}
    >
      {t('saveAndLoad.saveNewBtn.label')}
    </Button>}
    <LoadingIndicatorModal
      open={showSavingModal}
      handleClose={() => {
        setShowSavingModal(false);
      }}
      loadingLabel='saveAndLoad.addingSaveDataMsg'
      error='saveAndLoad.addingSaveDataFailedMsg' />
  </>
  );
};