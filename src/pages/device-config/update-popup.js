import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { CircularProgress, Grid, Typography, useTheme, Box, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ProgressButton from '../../components/button/progress-button';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import settings from '../../redux/reducers/settings'
import { syncDeviceConfigs } from "../../services/device-config.service";
import { rebootDevice } from "../../services/utils.service";
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Info';

export default function DeviceConfigDownloadDialog() {
  const { t } = useTranslation();
  const theme = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { is_measurement_flow_in_progress } = useSelector((state) => state.appState);
  const { device_config_popup } = useSelector((state) => state.settings);
  const { success: authSuccess } = useSelector((state) => state.userAuth);
  const { status: workflowDownloadStatus, workflow: workflow_state } = useSelector((state) => state.workflow);
  const [showDeviceConfigPopup, setShowDeviceConfigPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceConfigDownloadStatus, setDeviceConfigDownloadStatus] = useState(false);
  const [showRebootMsg, setShowRebootMsg] = useState(false);

  // const data = useRef({})
  const [isWeighingScaleChanged, setIsWeighingScaleChanged] = useState(false);

  const handleDeviceConfigPopup = () => {

    if (!device_config_popup) {
      return
    }

    // If control in measurement page, show the popup only after measurement is completed.
    if (is_measurement_flow_in_progress) {
      return
    }

    if (authSuccess && workflowDownloadStatus) {
      setShowDeviceConfigPopup(true);
    }

    downloadUpdatedDeviceConfigurations();

  }

  useEffect(() => {
    handleDeviceConfigPopup();
  }, [device_config_popup, is_measurement_flow_in_progress, authSuccess, workflowDownloadStatus])


  useEffect(() => {
    if (authSuccess && workflowDownloadStatus && isWeighingScaleChanged) {
      setShowDeviceConfigPopup(true);
    }
  }, [isWeighingScaleChanged, authSuccess, workflowDownloadStatus])


  const downloadUpdatedDeviceConfigurations = async () => {
    try {
      setIsLoading(true);
      setIsWeighingScaleChanged(false);
      setShowRebootMsg(false);
      const result = await syncDeviceConfigs();
      setDeviceConfigDownloadStatus(result.status)
      setIsLoading(false);
      if (!result?.status) {
        return false
      }
      console.error('result : ', JSON.stringify(result))
      if (result.data.is_timezone_changed) {
        setShowDeviceConfigPopup(true);
        setShowRebootMsg(true);
        return;
      }

      if (result.data.is_weighing_scale_changed) {
        setIsWeighingScaleChanged(true);
        return
      }

      setShowDeviceConfigPopup(false)

      dispatch(settings.actions.enableDeviceConfigUpdatePopup(false));

    } catch (error) {
      console.error("Error in configure workflow", error)
    }
  }

  const handleTimerClose = () => {
    setShowDeviceConfigPopup(false)
    dispatch(settings.actions.enableDeviceConfigUpdatePopup(false));
  }

  const handleReboot = () => {
    setShowDeviceConfigPopup(false);
    dispatch(settings.actions.enableDeviceConfigUpdatePopup(false));;
    rebootDevice('timezone');
  }

  const navigateToScaleSettings = () => {
    setShowDeviceConfigPopup(false)
    dispatch(settings.actions.enableDeviceConfigUpdatePopup(false));;
    navigate('/menu/scale');
    setIsWeighingScaleChanged(false);
  }


  return (

    <Dialog
      open={showDeviceConfigPopup}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={'xl'}
    >{
        !isLoading &&
        < DialogTitle variant="h3" color={theme.palette.error.main} alignItems={'center'} display={'flex'} marginY={3} >
          <Typography variant="h3" display={'flex'} alignContent={'center'} color={theme.palette.primary.main} fontWeight={'bold'}>
            <ErrorIcon sx={{ fontSize: '1.4em', marginRight: 2, marginTop: 0.5 }} color="primary" />
            {t('device_config_download.title')}
          </Typography>
        </DialogTitle>
      }
      <DialogContent
        id="alert-dialog-description"
        sx={{ display: 'flex', height: isLoading ? '26vh' : '20vh', width: '50vw', justifyContent: 'center', alignItems: 'center', }}
      >

        {
          isLoading &&
          <Grid container display={'flex'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
            <Grid item sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={70} />
              <Typography variant='h3' marginLeft={5} padding={4}>
                {t('device_config_download.in_progress')}
              </Typography>
            </Grid>
          </Grid>
        }

        {
          Boolean(!isLoading && !deviceConfigDownloadStatus) &&
          <Grid container display={'flex'} width={'100%'} height={'100%'}>
            <Grid container item xs={12} height={'70%'} justifyContent={'center'}>
              <Grid item xs={12} margin={'auto'}>
                {
                  <>
                    <Typography variant='h3' color={theme.palette.error.main} textAlign={'center'}>
                      {t('device_config_download.device_config_download_failed')}
                    </Typography>
                  </>
                }
              </Grid>

            </Grid>
            <Grid item xs={12} height={'30%'}>
              <Box width={'25%'} height={'100%'} marginLeft={'auto'}>
                <ProgressButton
                  onTimerClose={handleTimerClose}
                  startTimer={true}
                  text={t('common.button.close') + ' (%ds)'}
                  timeInSeconds={10}
                  variant="contained"
                  color="primary"
                  size="large"
                  textProps={{ fontSize: '3em' }}
                  sx={{ width: '25%', height: '100%', marginLeft: 'auto' }}
                  clickable={true}
                />
              </Box>
            </Grid>
          </Grid>
        }

        {
          Boolean(!isLoading && deviceConfigDownloadStatus && showRebootMsg) &&
          <Grid container display={'flex'} width={'100%'} height={'100%'} >
            <Grid container item xs={12} height={'65%'} justifyContent={'center'}>
              <Grid item xs={12} margin={'auto'}>
                <Typography variant='body2' fontSize={'3em'} textAlign={'justify'}>
                  {t('device_config_download.timezone_change')}
                </Typography>
              </Grid>

            </Grid>
            <Grid item xs={12} height={'30%'}>
              <Box width={'35%'} height={'100%'} marginLeft={'auto'}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ width: '100%', marginLeft: 'auto' }}
                  onClick={handleReboot}
                >
                  <Typography variant="body8" fontSize={'1.4em'}>
                    {t('device_config_download.proceed')}
                  </Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
        }

        {
          Boolean(authSuccess && workflowDownloadStatus && isWeighingScaleChanged) &&

          <Grid container display={'flex'} width={'100%'} height={'100%'} >
            <Grid container item xs={12} height={'55%'}>
              <Grid item xs={12} margin={'auto'}>
                <Typography variant='body2' fontSize={'3em'} textAlign={'justify'}>
                  {t('device_config_download.weighing_scale_change')}
                </Typography>
              </Grid>

            </Grid>
            <Grid item xs={12} height={'30%'}>
              <Box width={'35%'} height={'100%'} marginLeft={'auto'}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ width: '100%', marginLeft: 'auto' }}
                  onClick={navigateToScaleSettings}

                >
                  <Typography variant="body8" fontSize={'1.4em'}>
                    {t('device_config_download.scale_settings')}
                  </Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
        }

      </DialogContent>
    </Dialog >
  );
}
