import {
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Box,
  Button,
  LinearProgress
} from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@emotion/react';
import CalibrationCompleted from "./components/calibration-completed"

export default function CalibrationProgressPopup({ open, timeInSeconds, onReadyTimerComplete, state, result, handleClose, goToMeasure, handleReCalibrate, isAutoCalibration, reCalibrate }) {

  const theme = useTheme();
  const { t } = useTranslation();
  const interval = 200;

  const timerRef = useRef(null);
  const timerPropRef = useRef({ callOnce: true, count: 0 });

  const [progress, setProgress] = useState(100);
  const [timerSeconds, setTimerSeconds] = useState(timeInSeconds);

  const startCalibrationReadyTimer = () => {
    if (timerRef) {
      clearInterval(timerRef)
    };

    timerRef.current = setInterval(() => {
      setProgress((oldProgress) => {

        const data = (100 * interval) / (timeInSeconds * 1000);
        timerPropRef.current.count = timerPropRef.current.count + 1
        if ((oldProgress - data) <= 0) {
          clearInterval(timerRef.current);
          onReadyTimerComplete();
          timerPropRef.current.callOnce = false;
        }

        return oldProgress - data;
      });
    }, interval);
  }

  const handleReCalibrateClick = () => {
    setProgress(100)
    handleReCalibrate()
  }

  useEffect(() => {
    setTimerSeconds(Math.ceil(timeInSeconds * progress / 100));
  }, [progress])

  useEffect(() => {
    try {
      if (!open) return;

      setProgress(100);
      setTimerSeconds(timeInSeconds)
      if (state === 'ready') {
        startCalibrationReadyTimer();
      }

    } catch (err) {
      console.error('error : ', err);
    }

    return () => {
      clearInterval(timerRef.current);
    }
  }, [open, reCalibrate])

  return (
    <Dialog
      open={open}
      aria-labelledby="calibrate-dialog"
      aria-describedby="calibrate-desc"
      maxWidth={'xl'}
    >
      <DialogContent
        id="alert-dialog-description"
        sx={{ display: 'flex', height: '35vh', width: '50vw', justifyContent: 'center', alignItems: 'center', }}
      >
        {
          state === 'ready' &&
          <Grid container height={'100%'} >
            <Grid item xs={12} textAlign={'center'} display={'flex'}>
              <Typography variant='h3' color={theme.palette.warning.main} margin={'auto'}>
                {t('calibration_page.keep_ground_clear')}
              </Typography>
            </Grid>
            <Grid item xs={12} textAlign={'center'}>
              <LinearProgress
                variant="determinate"
                color="primary"
                value={progress}
                sx={{ height: '1.4em', width: '75%', margin: 'auto', borderRadius: '0.5em' }}
              />
              <Typography variant='h4' marginTop={5}>
                {t('calibration_page.calibration_will_start_in_xx_seconds').replace("%d", timerSeconds)}
              </Typography>
            </Grid>
          </Grid>
        }

        {
          state === 'in_progress' &&
          <Grid container display={'flex'} height={'100%'} justifyContent={'space-evenly'}>
            <Grid item sx={{ display: 'flex', height: '100%', paddingX: 30, justifyContent: 'center', alignItems: 'center', }}>
              <CircularProgress size={70} />
              <Typography variant='h3' marginLeft={5} padding={3}>
                {t('calibration_page.calibration_in_progress')}
              </Typography>
            </Grid>
          </Grid>

        }

        {
          state === 'completed' &&
          <CalibrationCompleted
            goToMeasure={goToMeasure}
            handleClose={handleClose}
            result={result}
            isAutoCalibration={isAutoCalibration}
            handleReCalibrateClick={handleReCalibrateClick}
          />
        }

      </DialogContent>
    </Dialog >
  );
}
