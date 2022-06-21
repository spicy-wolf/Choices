import Button from '@mui/material/Button/Button';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import React from 'react';

const LoadingIndicatorModal = (props: {
  loadingLabel?: string;
  error?: string;
  open: boolean;
  handleClose: () => void;
}) => {
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle id="alert-dialog-title">Loading...</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.error ?? props.loadingLabel}
        </DialogContentText>
      </DialogContent>
      {props.error && (
        <DialogActions>
          <Button>Copy</Button>
          <Button autoFocus onClick={props.handleClose}>
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default LoadingIndicatorModal;
