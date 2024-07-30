import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import appState from "../../../redux/reducers/measurement-states";
import ProgressButton from "../../../components/button/progress-button";
import navigationController from "../../../redux/reducers/nav-bar-controller";
import { useTranslation } from "react-i18next";
import { MeasurementState, MeasurementStateInfoReason, MeasurementTriggerSrc, ProcessingState, SmartMeasurementTriggerState, WeighingScaleTriggerState } from "../../../constants";
import {
  Button,
  Typography,
} from "@mui/material";
import { displayScaleReconnectPopup } from "../../../services/measurement.service";
function MeasurementTriggerTimer({ onMeasurementTiggerTimerComplete, onWaitTriggerTimeout }) {

  const { start_measurement_timer, weighing_scale_trigger, measurement_state, smart_measurement_trigger } = useSelector((state) => state.appState);
  const { customServiceInfo } = useSelector((state) => state.customFlow);
  const { name: weighing_scale } = useSelector((state) => state.settings.weighing_scale);
  const [showWaitingButton, setShowWaitingButton] = useState(false);
  const [showMeasureButton, setShowMeasureButton] = useState(false);

  const { workflow } = useSelector((state) => state.workflow);
  const dispatch = useDispatch();
  const [startTimer, setStartTimer] = useState(false);

  const { t } = useTranslation();

  const isTriggerStart = useRef(false);

  const handleMeasurementTrigger = () => {

    if (isTriggerStart.current) {
      return;
    }

    // It will be reset to false once the timer is completed
    // So No need to proceed if measurement timer is set to false
    if (!start_measurement_timer) {

      // In manual mode if smart measurement trigger is enabled then enable the trigger.
      // If trigger is started then check the trigger state(TRIGGERED or WAIT_FOR_SMART_MEASUREMENT_TRIGGER) based on that enable the measure button.
      if (workflow.measurement_trigger.source === MeasurementTriggerSrc.MANUAL && workflow?.support_trigger?.is_measurement_trigger_enabled) {
        if (smart_measurement_trigger?.state != SmartMeasurementTriggerState.TRIGGERED) {
          setShowWaitingButton(true);
        } else {
          setShowWaitingButton(false);
          setShowMeasureButton(true);
        }
      }
      // In manual mode if smart measurement is not enabled in forge then show the measure button
      else if (workflow.measurement_trigger.source === MeasurementTriggerSrc.MANUAL && !workflow?.support_trigger?.is_measurement_trigger_enabled) {
        setShowMeasureButton(true);
      }
      return;
    }


    if (workflow?.support_trigger?.is_weighing_scale_trigger_enabled) {

      if (weighing_scale_trigger?.state != WeighingScaleTriggerState.WEIGHT_TRIGGERED) {
        dispatch(appState.actions.updateMeasurementState({
          ...measurement_state,
          additionalInfo: {
            reason: MeasurementStateInfoReason.WAITING_FOR_WEIGHING_SCALE_TRIGGER,
            status_code: weighing_scale_trigger?.status_code,
            error_msg: weighing_scale_trigger?.error_msg

          }
        }));

        setShowWaitingButton(true);
        return;
      }
      dispatch(appState.actions.updateMeasurementState({
        ...measurement_state,
        additionalInfo: {}
      }));

      // Once weight got triggered in measurement ready state, disable the trigger
      dispatch(appState.actions.disableWeighingScaleTrigger());

      dispatch(appState.actions.updateMeasurementState({
        ...measurement_state,
        additionalInfo: { reason: null }
      }));

    }

    if (workflow?.support_trigger?.is_measurement_trigger_enabled) {
      if (smart_measurement_trigger?.state != SmartMeasurementTriggerState.TRIGGERED) {
        setShowWaitingButton(true);
        return;
      }

      dispatch(appState.actions.disableSmartMeasurementTrigger());

      dispatch(appState.actions.updateMeasurementState({
        ...measurement_state,
        additionalInfo: { reason: null }
      }));

    }


    dispatch(navigationController.actions.disableNavigation());
    isTriggerStart.current = true;

    setShowWaitingButton(false);

    // If there is no delay after trigger, then no need to show the timer in UI
    // Otherwise we need to show the timer in UI
    if (workflow?.measurement_trigger?.delay_after_trigger) {
      setStartTimer(true);
    } else {
      handleTimerClose();
    }
  }
  useEffect(() => {
    if (!customServiceInfo.isAvailable) {
      //dont check for scale events if custom service enable
      displayScaleReconnectPopup(true)
    }
  }, [])

  useEffect(() => {
    handleMeasurementTrigger();
  }, [start_measurement_timer, weighing_scale_trigger, smart_measurement_trigger])

  const handleTimerClose = () => {
    if (!customServiceInfo.isAvailable) {
      //dont check for scale events if custom service enable
      displayScaleReconnectPopup(false)
    }
    setShowMeasureButton(false);
    setStartTimer(false);
    onMeasurementTiggerTimerComplete();

    if (workflow?.support_trigger?.is_weighing_scale_trigger_enabled && weighing_scale !== 'none') {
      dispatch(appState.actions.disableWeighingScaleTrigger());
    }

    if (workflow?.support_trigger?.is_measurement_trigger_enabled) {
      dispatch(appState.actions.disableSmartMeasurementTrigger());
    }
    dispatch(appState.actions.resetMeasurementTimer())
  }

  const handleWaitTriggerTimeout = () => {
    onWaitTriggerTimeout();
  }

  return (
    <>

      {
        // Smart measurement trigger enabled and the measure trigger mode either MANUAL or BARCODE
        // and trigger state is waiting for object then show the wait for object button.
        Boolean(showWaitingButton && workflow?.support_trigger?.is_measurement_trigger_enabled && (workflow.measurement_trigger?.source === MeasurementTriggerSrc.BARCODE || workflow.measurement_trigger?.source === MeasurementTriggerSrc.MANUAL)) &&

        <ProgressButton
          variant="standard"
          width={'100%'}
          text={t('measurement_page.button.waiting_for_object')}
          textProps={{ fontSize: '3.6em' }}
          clickable={false}
        />

      }

      {
        Boolean(showWaitingButton && workflow.measurement_trigger?.source === MeasurementTriggerSrc.REMOTE) &&

        <ProgressButton
          variant="standard"
          timeInSeconds={workflow?.support_trigger?.wait_timeout}
          onTimerClose={handleWaitTriggerTimeout}
          startTimer={workflow?.support_trigger?.wait_timeout != null}
          width={'100%'}
          text={t('measurement_page.button.timing_out') + (workflow?.support_trigger?.wait_timeout ? ' (%ds)' : 'aa')}
          textProps={{ fontSize: '3.6em' }}
          clickable={false}
        />

      }

      {
        Boolean(!showWaitingButton && showMeasureButton) &&
        <Button
          variant="contained"
          color="primary"
          sx={{ width: '100%', }}
          onClick={handleTimerClose}
        >
          <Typography variant="body4">
            {t('measurement_page.button.measure')}
          </Typography>
        </Button>
      }

      {
        Boolean(!showWaitingButton && start_measurement_timer && workflow?.measurement_trigger?.delay_after_trigger && workflow.measurement_trigger.source !== MeasurementTriggerSrc.MANUAL) &&
        <ProgressButton
          variant="contained"
          timeInSeconds={workflow?.measurement_trigger?.delay_after_trigger}
          onTimerClose={handleTimerClose}
          startTimer={startTimer}
          width={'100%'}
          text={t('measurement_page.button.measuring_in') + ' %ds'}
          textProps={{ fontSize: '3.6em' }}
        />
      }
    </>
  )
}

export default MeasurementTriggerTimer;
