import React from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ErrorIcon from '@mui/icons-material/Error';
import PopupButton from "../../components/button/popup-button";

function CalibrationPopup() {

  const navigate = useNavigate();

  const { t } = useTranslation()
  const theme = useTheme()
  const handleSubmit = () => {
    navigate('/menu/calibration')
  }

  return (
    <Dialog
      maxWidth={'md'}
      fullWidth
      open={true}

    >
      <DialogTitle variant="h3">
        <Typography variant="h4" display={'flex'} alignContent={'center'} color={theme.palette.error.main} fontWeight={'bold'}>
          <ErrorIcon sx={{ fontSize: '1.2em', marginRight: 2 }} color="error" />
          {t('measurement_page.calibration_dialog.title')}
        </Typography>
      </DialogTitle>
      <DialogContent
        id="alert-dialog-description"
        sx={{
          display: 'flex',
          // height: '20vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography variant='body2' fontSize={'3em'} textAlign={'justify'}>
              {t('measurement_page.calibration_dialog.content')}
            </Typography>
          </Grid>
          <Grid item xs={12} display={'flex'} justifyContent={'right'}>

          </Grid>
        </Grid>


      </DialogContent>
      <DialogActions sx={{ paddingBottom: 4, paddingRight: 4 }}>
        <PopupButton
          onClick={handleSubmit}
          text={t('measurement_page.calibration_dialog.button')}
          mr={'0.4em'}
        />
      </DialogActions>

    </Dialog>
  )
}

export default CalibrationPopup;
