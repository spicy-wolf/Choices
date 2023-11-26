import React from 'react';
import { Trans } from 'react-i18next';
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
  return (<Dialog
    open={props.open}
    onClose={props.onClose}
  >
    <DialogTitle>
      <Trans i18nKey={props.title} />
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        <Trans i18nKey={props.body} />
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={async () => await props.onConfirm()}>
        <Trans i18nKey="yesNoModal.confirmBtn.label" />
      </Button>
      <Button onClick={async () => await props.onClose()}>
        <Trans i18nKey="yesNoModal.cancelBtn.label" />
      </Button>
    </DialogActions>
  </Dialog>);
};