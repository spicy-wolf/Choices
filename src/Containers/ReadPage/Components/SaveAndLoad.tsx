import React, { Dispatch } from 'react';
import { v4 as uuid } from 'uuid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Trans } from 'react-i18next';
import * as Database from '@src/Database';
import * as StatementEngine from '@src/StatementEngine';
import { SaveDataDispatchType } from '../Hooks/useSaveDataReducer';
import { useDbContext } from '@src/Context/DbContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

type SaveAndLoadProps = {
  defaultSaveData: Database.Types.SaveDataType;
  defaultSaveDataDispatch: Dispatch<SaveDataDispatchType>;
  addSaveData: (_saveData: Database.Types.SaveDataType) => Promise<void>;
  deleteSaveData: (saveDataId: string) => Promise<void>;
  saveDataList: Database.Types.SaveDataType[];
  setLoadingMsg: (loadingMsg: string) => void;
};
const SaveAndLoad = (props: SaveAndLoadProps) => {
  const { dbContext } = useDbContext();

  const [showAddSaveDataCard, setShowAddSaveDataCard] =
    React.useState<boolean>(false);
  const [saveDataDescription, setSaveDataDescription] =
    React.useState<string>();

  const addManualSaveData = async () => {
    if (!props.defaultSaveData) return;
    try {
      const newSaveData = JSON.parse(
        JSON.stringify(props.defaultSaveData)
      ) as Database.Types.SaveDataType;
      newSaveData.description = saveDataDescription;
      newSaveData.saveDataType = 'manual';
      // set new save data id
      const newSaveDataId = uuid();
      newSaveData.id = newSaveDataId;
      newSaveData.readingLogs?.forEach(
        (item) => (item.saveDataId = newSaveDataId)
      );

      props.addSaveData && (await props.addSaveData(newSaveData));
    } catch (ex) {
      console.error(ex);
    } finally {
      setShowAddSaveDataCard(false);
    }
  };

  const loadSaveData = async (saveDataId: string) => {
    if (!saveDataId || !props.defaultSaveData?.id) return;
    try {
      // load save data + reading log
      const newSaveData = await dbContext.getSaveDataFromId(saveDataId);

      const newDefaultSaveData = JSON.parse(
        JSON.stringify(newSaveData)
      ) as Database.Types.SaveDataType;
      newDefaultSaveData.description = ''; // clear description
      newDefaultSaveData.saveDataType = 'default';
      const newDefaultSaveDataId = uuid();
      newDefaultSaveData.id = newDefaultSaveDataId;
      newDefaultSaveData.readingLogs?.forEach(
        (item) => (item.saveDataId = newDefaultSaveDataId)
      );

      props.setLoadingMsg('saveAndLoad.loadingSaveDataMsg');
      // delete old default
      props.deleteSaveData &&
        (await props.deleteSaveData(props.defaultSaveData?.id));
      // add new default
      props.addSaveData && (await props.addSaveData(newDefaultSaveData));
      // dispatch new
      props.defaultSaveDataDispatch({
        type: 'setValue',
        payload: newDefaultSaveData,
      });
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
                  onClick={addManualSaveData}
                >
                  <Trans i18nKey="saveAndLoad.saveConfirmBtn.label" />
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
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
              const readingLogs = props.defaultSaveData?.readingLogs;
              if (readingLogs && readingLogs.length > 0) {
                for (
                  let i = readingLogs.length - 1;
                  i >= 0 && defaultSaveDataDescription.length <= 200;
                  i--
                ) {
                  const piece =
                    (
                      readingLogs[i] as
                        | StatementEngine.Types.ParagraphComponentType
                        | StatementEngine.Types.SentenceComponentType
                    )?.data ?? '';
                  defaultSaveDataDescription = `${piece
                    .replace(/(\r\n|\n|\r)/gm, '')
                    .trim()}${defaultSaveDataDescription}`;
                }
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

type SaveDataItemProps = {
  saveData: Database.Types.SaveDataType;
  deleteSaveData: (saveDataId: string) => Promise<void>;
  loadSaveData: (saveDataId: string) => Promise<void>;
};
const SaveDataItem = (props: SaveDataItemProps) => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openLoadConfirmationModal, setOpenLoadConfirmationModal] =
    React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  //#region three dot menu
  const onDelete = async () => {
    if (!props.saveData?.id) return;
    props.deleteSaveData && (await props.deleteSaveData(props.saveData?.id));
  };
  const menu = (
    <Menu
      anchorEl={anchorRef.current}
      open={openMenu}
      onClose={() => setOpenMenu(false)}
    >
      <MenuItem onClick={onDelete}>
        <Trans i18nKey="saveAndLoad.deleteBtn.label" />
      </MenuItem>
    </Menu>
  );
  //#endregion

  //#region Load Confirmation Modal
  const onLoadConfirmationModalClose = () =>
    setOpenLoadConfirmationModal(false);
  const onLoadConfirmationModalConfirm = async () => {
    setOpenLoadConfirmationModal(false);
    await props.loadSaveData(props.saveData?.id);
  };
  const loadConfirmationModal = (
    <Dialog
      open={openLoadConfirmationModal}
      onClose={onLoadConfirmationModalClose}
    >
      <DialogTitle>
        <Trans i18nKey="saveAndLoad.loadModal.title" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Trans i18nKey="saveAndLoad.loadModal.body" />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onLoadConfirmationModalConfirm}>
          <Trans i18nKey="saveAndLoad.loadModal.loadConfirmBtn.label" />
        </Button>
        <Button onClick={onLoadConfirmationModalClose}>
          <Trans i18nKey="saveAndLoad.loadModal.loadCancelBtn.label" />
        </Button>
      </DialogActions>
    </Dialog>
  );
  //#endregion

  return (
    <>
      <Card>
        <CardHeader
          sx={{ paddingBottom: 0, paddingTop: '0.5rem' }}
          action={
            <>
              <IconButton ref={anchorRef} onClick={() => setOpenMenu(true)}>
                <MoreVertIcon />
              </IconButton>
              {menu}
            </>
          }
          subheader={new Date(props.saveData?.createTimestamp).toLocaleString(
            undefined, // TODO: use i18n?
            {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              hour12: false,
              minute: '2-digit',
              second: '2-digit',
            }
          )}
        />
        <CardActionArea onClick={() => setOpenLoadConfirmationModal(true)}>
          <CardContent sx={{ paddingY: '0.5rem' }}>
            <Typography
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
              }}
            >
              {props.saveData?.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      {loadConfirmationModal}
    </>
  );
};

export { SaveAndLoad };
