import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import ConfimationDialog from './confimation-dialog';
import VideoStream from "../../components/video-stream/video-stream";
import { Certificates, SetUpHeight, TriggerMode, NTEPSupportModes, calibrationMethod, calibrationMode } from "../../constants";
import { useTranslation } from 'react-i18next';
import CalibrationButton from "./calibration-button";
import CalibrationProgressPopup from "./calibration-progress-popup";
import { calibrateCamera, isCalibrationDataQueueFull, getCalibrationData } from "../../services/calibration.service";
import { useDispatch, useSelector } from "react-redux";
import QueueFullPopup from "./queue-full-popup";
import CalibrationHeader from "./calibration-header";
import ultimaIcons from "../../components/ultima-icons";
import { useNavigate } from "react-router-dom";
import appState from '../../redux/reducers/measurement-states'

function CalibrationPage() {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [isScaleEnabled, setIsScaleEnabled] = useState(false);
  const [isCalibrateProgressStart, setIsCalibrateProgressStart] = useState(false);
  const [isEnvelopeMode, setIsEnvelopeMode] = useState(false);
  const [isStreamEnabled, setIsStreamEnabled] = useState(true);
  const [isShowExternalImage, setIsShowExternalImage] = useState(false);
  const [externalImage, setExternalImage] = useState("");
  const [setUpHeight, setSetUpHeight] = useState(0);
  const [calibrationState, setCalibrationState] = useState('completed')
  const [result, setResult] = useState({ status: false })
  const [isAutoCalibration, setIsAutoCalibration] = useState(false);
  const [reCalibrate, setReCalibrate] = useState(false)

  const { weighing_scale_name } = useSelector((state) => state.settings.weighing_scale);
  const { metrological_setting } = useSelector((state) => state.settings.metrological);
  const { workflow } = useSelector((state) => state.workflow);
  const { calibration_info } = useSelector((state) => state.appState)
  const navigate = useNavigate()

  const handleClose = () => {
    setIsStreamEnabled(true);
    setConfirmationDialogOpen(false);
  };

  const startCalibrateTimer = (setup_height) => {
    if (confirmationDialogOpen) {
      setConfirmationDialogOpen(false);
    }
    if (setup_height === SetUpHeight.HT_2_2) {
      setIsEnvelopeMode(false);
    }
    setCalibrationState('ready');
    setIsCalibrateProgressStart(true);
    setIsStreamEnabled(false);
    setSetUpHeight(setup_height);
  }

  const handleEnvelopeModeBtnsClick = (isEnvelopMode, sHeight) => {
    setSetUpHeight(sHeight)
    setIsEnvelopeMode(isEnvelopMode);
    setConfirmationDialogOpen(true);
  }

  const handleCalibrationReadyTimerComplete = async () => {
    setCalibrationState('in_progress');
    const result = await calibrateCamera({
      is_envelop_mode: isEnvelopeMode,
      setup_height: setUpHeight,
      trigger_mode: TriggerMode.MANUAL,
      is_auto_calibration: isAutoCalibration
    });
    setCalibrationState('completed');
    setResult(result)
    checkCalibrationQueueFull();
  }

  const videoRef = useRef();
  const previewRef = useRef();
  const gridRef = useRef();
  const [show, setShow] = useState(false);
  const timeoutRef = useRef();
  const [isQueueFull, setIsQueueFull] = useState(false);

  const setGridWidth = () => {
    timeoutRef.current = setTimeout(() => {
      if (previewRef.current && videoRef.current?.offsetWidth > 100) {
        previewRef.current.style.width = (gridRef.current?.offsetWidth - videoRef.current?.offsetWidth - 5) + 'px';
        timeoutRef.current = null;
        setShow(true);
      } else {
        timeoutRef.current = setTimeout(setGridWidth, 50);
      }
    }, 50);

  }

  const checkCalibrationQueueFull = async () => {
    const result = await isCalibrationDataQueueFull()

    if (result.status && result?.data?.is_queue_full) {
      setIsQueueFull(true);
    } else {
      setIsQueueFull(false);
    }
  }

  useEffect(() => {
    setGridWidth();
    setIsScaleEnabled(weighing_scale_name !== "none");
    checkCalibrationQueueFull();
    setIsAutoCalibration(workflow?.calibration_config?.calibration_method == calibrationMethod.AUTO);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [])

  const handleProgressClose = () => {
    setIsCalibrateProgressStart(false);
    setIsStreamEnabled(true);
  }

  const navigateMeasurePage = () => {
    navigate('/measurement')
  }

  const handleReCalibrate = () => {
    setReCalibrate(!reCalibrate)
    startCalibrateTimer(SetUpHeight.AUTO)
  }

  const isValidSetUpHeight = (setup, calibMode) => {
    if (metrological_setting === Certificates.NTEP) {
      return NTEPSupportModes.includes(setup);
    }
    return !isAutoCalibration && workflow?.calibration_config?.calibration_modes?.includes(calibMode)
  }

  const getCalibData = async () => {
    const result = await getCalibrationData()
    dispatch(appState.actions.updateCalibrationInfo(result))
  }

  useEffect(() => {
    setConfirmationDialogOpen(false);
    setIsCalibrateProgressStart(false);
    setIsEnvelopeMode(false);
    getCalibData();
    setIsAutoCalibration(workflow?.calibration_config?.calibration_method == calibrationMethod.AUTO);
  }, [workflow])

  return (
    <>
      {
        !isQueueFull &&
        <Grid container display="flex" alignItems="center" justifyContent="space-around" rowSpacing={5} visibility={show ? 'visible' : 'hidden'} height={'100%'}>
          <Grid item xs={12} height={'8%'} display={"flex"}>
            <CalibrationHeader time={calibration_info.lastCalibratedTime} lastcalibratedMode={calibration_info.lastCalibratedMode} />
          </Grid>
          <Grid container item xs={12} display="flex" ref={gridRef}>
            <Grid container item width={"60%"} ref={previewRef} sx={{ paddingRight: 4 }} >
              <Paper
                variant="elevation"
                elevation={2}
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'stretch'
                }}
              >
                <Box width={'100%'} height={'10%'}>
                  <Typography paddingY={4} textAlign={'center'} variant="h3" fontWeight="800">
                    {t(!isAutoCalibration || metrological_setting == Certificates.NTEP ? 'calibration_page.please_choose_setup_height' : 'calibration_page.auto_calibration')}
                  </Typography>
                  <Divider sx={{ width: '100%' }} />
                </Box>
                {
                  (!isAutoCalibration || metrological_setting == Certificates.NTEP) ?
                    <Box width={'100%'} height={'90%'}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                      }}
                    >
                      {
                        <CalibrationButton
                          color={'#ef6c00'}
                          bgColor={'#ef6c0011'}
                          title={'calibration_page.small_parcel_mode'}
                          subTitle={'calibration_page.small_parcel_non_envelope_subtitle'}
                          isScaleEnabled={isScaleEnabled}
                          onClick={() => { handleEnvelopeModeBtnsClick(false, SetUpHeight.HT_1_1) }}
                          disabled={!isValidSetUpHeight(SetUpHeight.HT_1_1, calibrationMode.HT_1_1)}
                          Icon={ultimaIcons.Calibration1100}
                        />
                      }
                      {
                        <CalibrationButton
                          color={'#1b5e20'}
                          bgColor={'#1b5e2011'}
                          title={'calibration_page.small_parcel_mode'}
                          subTitle={'calibration_page.small_parcel_envelope_subtitle'}
                          isScaleEnabled={isScaleEnabled}
                          onClick={() => { handleEnvelopeModeBtnsClick(true, SetUpHeight.HT_1_1) }}
                          disabled={!isValidSetUpHeight(`${SetUpHeight.HT_1_1}E`, calibrationMode.HT_1_1_E)}
                          Icon={ultimaIcons.Calibration1100E}
                        />
                      }
                      {
                        <CalibrationButton
                          color={'#1a237e'}
                          bgColor={'#1a237e11'}
                          title={'calibration_page.all_parcel_mode'}
                          subTitle={'calibration_page.all_parcel_non_envelope_subtitle'}
                          isScaleEnabled={isScaleEnabled}
                          onClick={() => { handleEnvelopeModeBtnsClick(false, SetUpHeight.HT_1_5); }}
                          disabled={!isValidSetUpHeight(SetUpHeight.HT_1_5, calibrationMode.HT_1_5)}
                          Icon={ultimaIcons.Calibration1500}
                        />
                      }
                      {
                        <CalibrationButton
                          color={'#795548'}
                          bgColor={'#79554811'}
                          title={'calibration_page.all_parcel_mode'}
                          subTitle={'calibration_page.all_parcel_envelope_subtitle'}
                          isScaleEnabled={isScaleEnabled}
                          onClick={() => { handleEnvelopeModeBtnsClick(true, SetUpHeight.HT_1_5); }}
                          disabled={!isValidSetUpHeight(`${SetUpHeight.HT_1_5}E`, calibrationMode.HT_1_5_E)}
                          Icon={ultimaIcons.Calibration1500}
                        />
                      }
                      {
                        <CalibrationButton
                          color={'#ad1457'}
                          bgColor={'#ad145711'}
                          title={'calibration_page.white_parcel_mode'}
                          subTitle={'calibration_page.white_parcel_mode_subtitle'}
                          isScaleEnabled={isScaleEnabled}
                          onClick={() => { startCalibrateTimer(SetUpHeight.HT_2_2); }}
                          disabled={!isValidSetUpHeight(SetUpHeight.HT_2_2, calibrationMode.HT_2_2)}
                          Icon={ultimaIcons.Calibration2200}
                        />
                      }
                    </Box>
                    :
                    <Box width={'100%'} height={'100%'}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                      }}
                    >
                      <CalibrationButton
                        color={'#037ffc'}
                        bgColor={'#34ebdb11'}
                        title={'calibration_page.Calibrate'}
                        onClick={() => { startCalibrateTimer(SetUpHeight.AUTO); }}
                        Icon={ultimaIcons.Calibration2200}
                      />
                    </Box>
                }
              </Paper>
            </Grid>
            <Grid container item xs={'auto'} ref={videoRef} width={'30%'}>
              <Paper variant="elevation" elevation={2} sx={{ width: '100%', padding: 2, height: '75vh' }}>
                <VideoStream
                  isStreamEnabled={isStreamEnabled}
                  isShowExternalImage={isShowExternalImage}
                  externalImage={externalImage}
                  isWorkareaRect={true}
                  defaultSrc={'/images/white-annotated.jpg'}
                  isShowAnglePoints={true}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      }
      <ConfimationDialog
        open={confirmationDialogOpen}
        isEnvelopeMode={isEnvelopeMode}
        handleClose={handleClose}
        setupHeight={setUpHeight}
        handleConfirm={() => { startCalibrateTimer(setUpHeight); }}
      />
      {
        isCalibrateProgressStart &&
        <CalibrationProgressPopup
          open={isCalibrateProgressStart}
          reCalibrate={reCalibrate}
          onReadyTimerComplete={handleCalibrationReadyTimerComplete}
          isAutoCalibration={isAutoCalibration}
          result={result}
          state={calibrationState}
          timeInSeconds={5}
          handleClose={handleProgressClose}
          goToMeasure={navigateMeasurePage}
          handleReCalibrate={handleReCalibrate}
        />
      }
      {
        isQueueFull &&
        <QueueFullPopup />
      }

    </>
  )
}

export default CalibrationPage;
