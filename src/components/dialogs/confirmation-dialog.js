import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import PopupButton from '../button/popup-button';

export default function ConfirmationDialog({
  open,
  title,
  content,
  onClose,
  buttonValue = null,
  cancelBtnValue = null,
  cancelBtnId = 'cancel-btn',
  okBtnId = 'ok-btn',
  isCancellable = true
}) {

  const { t } = useTranslation()

  const handleClose = (event, isConfirmed = false) => {
    onClose(isConfirmed);
  };

  return (
    <Dialog
      open={open}
      maxWidth={'md'}
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ sx: { padding: 4 } }}
    >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {
          isCancellable &&
          <PopupButton
            buttonVariant='outlined'
            onClick={handleClose}
            text={cancelBtnValue || t('common.button.cancel')}
          />
        }

        <PopupButton
          onClick={(e) => handleClose(e, true)}
          text={buttonValue || t('common.button.ok')}
          mr={'0.2em'}
        />
      </DialogActions>
    </Dialog>
  );
}
