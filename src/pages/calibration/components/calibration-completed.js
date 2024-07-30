import {
  Grid,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@emotion/react';
import ProgressButton from '../../../components/button/progress-button';
import PopupButton from '../../../components/button/popup-button'


function CalibrationCompleted({ goToMeasure, handleClose, result = { status: true }, isAutoCalibration = false, handleReCalibrateClick = null }) {

  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Grid container display={'flex'} width={'100%'} height={'100%'}>
      <Grid container item xs={12} height={'75%'} justifyContent={'center'}>
        <Grid item xs={12} margin={'auto'}>
          {
            (result.status)
              ?
              <>
                <Typography variant='h2' color={theme.palette.success.main} textAlign={'center'}>
                  {t('calibration_page.calibration_messages.calibrate_success')}
                </Typography>
                {isAutoCalibration && <Typography variant="h5" textAlign={'center'} marginTop={3}>
                  {`${t('calibration_page.setup_mode')} ${result.data.calibration_data.mode}`}
                </Typography>
                }
                <Typography variant="body2" fontSize={'2.2em'} textAlign={'center'} marginTop={5}>
                  {t('calibration_page.calibration_messages.calibrate_success_msg')}
                </Typography>
              </>
              :
              <>
                <Typography variant='h2' color={theme.palette.error.main} textAlign={'center'}>
                  {t('calibration_page.calibration_messages.calibrate_failed')}
                </Typography>
                <Typography variant="body2" fontSize={'2.2em'} textAlign={'center'} marginTop={5}>
                  {t('calibration_page.calibration_messages.' + result.error.message)}
                </Typography>
              </>
          }
        </Grid>

      </Grid>
      <Grid item xs={12} height={'20%'} display={'flex'} justifyContent={"flex-end"}>

        <PopupButton
          buttonVariant={result.status ? "outlined" : "contained"}
          onClick={handleClose}
          text={result.status ? t('common.button.cancel') : t('common.button.close')}
        />

        {result.status && <Box width={'28%'} height={'100%'}>
          <ProgressButton
            onTimerClose={goToMeasure}
            startTimer={result.status}
            text={t('common.button.goToMeasure')}
            timeInSeconds={5}
            variant="contained"
            color="primary"
            size="large"
            nornalText={t('common.button.goToMeasure')}
            textProps={{ fontSize: '2.5em', color: 'white' }}
            sx={{ width: '28%', height: '100%' }}
            clickable={true}
          />
        </Box>}
        
        {!result.status && isAutoCalibration &&
          <PopupButton
            buttonVariant="contained"
            onClick={handleReCalibrateClick}
            text={t('calibration_page.Recalibrate')}
          />}
      </Grid>
    </Grid>
  )
}

export default CalibrationCompleted;