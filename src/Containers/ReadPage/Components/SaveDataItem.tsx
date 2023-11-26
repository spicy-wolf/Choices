import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CardActionArea from '@mui/material/CardActionArea';
import { Trans } from 'react-i18next';
import * as Database from '@src/Database';
import { LoadingIndicatorModal, YesNoModal } from '@src/Containers/components';

type SaveDataItemProps = {
  saveData: Database.Types.SaveDataType;
  deleteSaveData: (saveDataId: string) => Promise<void>;
  loadSaveData: (saveDataId: string) => Promise<void>;
};
export const SaveDataItem = (props: SaveDataItemProps) => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openLoadConfirmationModal, setOpenLoadConfirmationModal] = React.useState(false);
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] = React.useState(false);
  const [showLoadingModal, setShowLoadingModal] = React.useState<boolean>(false);
  const [loadingLabel, setLoadingLabel] = React.useState('');
  const [loadingError, setLoadingError] = React.useState('');
  const anchorRef = React.useRef<HTMLButtonElement>(null);


  //#region three dot menu
  const onDeleteConfirmationModalClose = () => {
    setOpenDeleteConfirmationModal(false);
  };
  const onDeleteConfirmationModalConfirm = async () => {
    setOpenDeleteConfirmationModal(false);

    if (!props.saveData?.id) return;
    try {
      setShowLoadingModal(true);
      setLoadingLabel('saveAndLoad.deletingSaveDataMsg');
      await props.deleteSaveData?.(props.saveData?.id);
      setShowLoadingModal(false);
    } catch (ex) {
      console.error(ex);
      setLoadingError('saveAndLoad.deletingSaveDataFailedMsg');
    }
  };
  const deleteConfirmationModal = (
    <YesNoModal
      open={openDeleteConfirmationModal}
      title="saveAndLoad.deleteModal.title"
      body="saveAndLoad.deleteModal.body"
      onClose={onDeleteConfirmationModalClose}
      onConfirm={onDeleteConfirmationModalConfirm} />
  );
  //#endregion
  //#region Load Confirmation Modal
  const onLoadConfirmationModalClose = () => setOpenLoadConfirmationModal(false);
  const onLoadConfirmationModalConfirm = async () => {
    setOpenLoadConfirmationModal(false);

    if (!props.saveData?.id) return;
    try {
      setShowLoadingModal(true);
      setLoadingLabel('saveAndLoad.loadingSaveDataMsg');
      await props.loadSaveData?.(props.saveData?.id);
      setShowLoadingModal(false);
    } catch (ex) {
      console.error(ex);
      setLoadingError('saveAndLoad.loadingSaveDataFailedMsg');
    }
  };
  const loadConfirmationModal = (
    <YesNoModal
      open={openLoadConfirmationModal}
      title="saveAndLoad.loadModal.title"
      body="saveAndLoad.loadModal.body"
      onClose={onLoadConfirmationModalClose}
      onConfirm={onLoadConfirmationModalConfirm} />
  );
  //#endregion
  const menu = (
    <Menu
      anchorEl={anchorRef.current}
      open={openMenu}
      onClose={() => setOpenMenu(false)}
    >
      <MenuItem onClick={() => setOpenDeleteConfirmationModal(true)}>
        <Trans i18nKey="saveAndLoad.deleteBtn.label" />
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Card sx={{ width: '100%' }}>
        <CardHeader
          sx={{ paddingBottom: 0, paddingTop: '0.5rem' }}
          action={<>
            <IconButton ref={anchorRef} onClick={() => setOpenMenu(true)}>
              <MoreVertIcon />
            </IconButton>
            {menu}
          </>}
          subheader={new Date(props.saveData?.createTimestamp).toLocaleString(
            undefined,
            {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              hour12: false,
              minute: '2-digit',
              second: '2-digit',
            }
          )} />
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
      {deleteConfirmationModal}
      <LoadingIndicatorModal
        open={showLoadingModal}
        handleClose={() => {
          setLoadingLabel('');
          setShowLoadingModal(false);
        }}
        loadingLabel={loadingLabel}
        error={loadingError} />
    </>
  );
};
