import {
  Alert as MuiAlert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SetUpHeight } from '../../constants';
import styled from "styled-components/macro";
import PopupButton from '../../components/button/popup-button';

const Alert = styled(MuiAlert)` 
.MuiSvgIcon-root {
    font-size:1.4em;
}
`;

export default function ConfimationDialog({ open, isEnvelopeMode, handleConfirm, handleClose, setupHeight }) {
  
  const { t } = useTranslation();

  return (

    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'md'}
      PaperProps={{
        sx: { padding: '1em' }
      }}
    >
      <DialogTitle >
        <Typography variant="h3" fontWeight="800">
          {t(isEnvelopeMode ? 'calibration_page.envelope_mode_title' : 'calibration_page.non_envelope_mode_title')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body7" >
            {t(isEnvelopeMode ? 'calibration_page.envelope_mode_content' : 'calibration_page.non_envelope_mode_content')}
          </Typography>
        </DialogContentText>
        <Box display="flex" justifyContent="center">
          <img src={isEnvelopeMode ? '/images/envelopeMode.gif' : '/images/nonEnvelopeMode.png'} alt="envelope-mode" />
        </Box>
        {
          isEnvelopeMode &&
          <Alert severity="info">
            <AlertTitle sx={{ fontSize: '1.4em' }}>{t(`calibration_page.calibration_note.note`)}</AlertTitle>
            <Typography variant="body8">
              {setupHeight === SetUpHeight.HT_1_1 ?
                <ul>
                  <li>{t(`calibration_page.calibration_note.note_for_1.1_line1`)}</li>
                  <li>{t(`calibration_page.calibration_note.note_for_1.1_line2`)}</li>
                </ul> :
                <ul>
                  <li>{t(`calibration_page.calibration_note.note_for_1.5_line1`)}</li>
                  <li>{t(`calibration_page.calibration_note.note_for_1.5_line2`)}</li>
                </ul>
              }
            </Typography>
          </Alert>
        }
      </DialogContent>
      <DialogActions p={2}>
        <PopupButton
          onClick={handleClose}
          buttonVariant={"outlined"}
          text={t('common.button.cancel')}
        />

        <PopupButton
          onClick={handleConfirm}
          text={t('common.button.confirm')}
        />
      </DialogActions>
    </Dialog>

  );
}
