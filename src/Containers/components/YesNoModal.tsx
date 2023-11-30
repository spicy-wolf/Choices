import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

type YesNoModalProps = {
  open: boolean;
  title: string;
  body: string;
  onClose: () => void | Promise<void>;
  onConfirm: () => void | Promise<void>;
};

export const YesNoModal = (props: YesNoModalProps) => {
  const { t } = useTranslation();

  return (<Dialog
    open={props.open}
    onClose={props.onClose}
  >
    <DialogTitle>
      {t(props.title)}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        {t(props.body)}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={async () => await props.onConfirm()}>
        {t('yesNoModal.confirmBtn.label')}
      </Button>
      <Button onClick={async () => await props.onClose()}>
        {t('yesNoModal.cancelBtn.label')}
      </Button>
    </DialogActions>
  </Dialog>);
};