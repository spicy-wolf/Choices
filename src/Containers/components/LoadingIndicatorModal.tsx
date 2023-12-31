/**
 * Choices - An application of digital interactive fiction/novel
 * Copyright (C) 2023 Spicy Wolf
 * 
 * @license SPDX-License-Identifier: GPL-3.0-only
 */

import Button from '@mui/material/Button/Button';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const LoadingIndicatorModal = (props: {
  loadingLabel?: string;
  error?: string;
  open: boolean;
  handleClose: () => void;
}) => {
  const { t } = useTranslation();

  const msgStr = useMemo(() => {
    const msg = props.error || props.loadingLabel;
    if (typeof msg === 'string') {
      return t(msg);
    } else {
      return JSON.stringify(msg);
    }
  }, [props.error, props.loadingLabel]);

  const handleClose = (
    event: object,
    reason: 'backdropClick' | 'escapeKeyDown'
  ) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;

    props.handleClose && props.handleClose();
  };

  return (
    <Dialog open={props.open} onClose={handleClose} disableEscapeKeyDown>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {msgStr}
        </DialogContentText>
      </DialogContent>
      {props.error && (
        <DialogActions>
          <Button
            onClick={() => {
              navigator?.clipboard.writeText(msgStr);
            }}
          >
            {t('loadingIndicatorModal.copyBtn.label')}
          </Button>
          <Button autoFocus onClick={props.handleClose}>
            {t('loadingIndicatorModal.closeBtn.label')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export { LoadingIndicatorModal };

