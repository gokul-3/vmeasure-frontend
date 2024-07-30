import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
} from "@mui/material";
import { useSelector } from 'react-redux'

import ProgressButton from "../../../components/button/progress-button";
import { useTranslation } from "react-i18next";
import { ExternalInputs, MeasurementTriggerSrc } from "../../../constants";

function MeasurementDiscardTimer({ annotatedImg, onMeasurementDiscardTimerComplete }) {

  const { workflow } = useSelector((state) => state.workflow);
  const [startTimer, setStartTimer] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const { value: externalInputValue, counter: externalInputCounter } = useSelector((state) => state.externalInput);

  const { t } = useTranslation()


  useEffect(() => {
    // If measurement reject is not enabled, call the function immediately to save the measurement
    // Otherwise open the model dialog for rejection
    if (!workflow?.ui_config?.measurement_reject.is_enabled) {
      onMeasurementDiscardTimerComplete(false);
    } else {
      setShowTimer(true);
      setStartTimer(true);
    }
  }, [workflow])


  // Add timer module on timer ends call onMeasurementTimerComplete

  const handleDiscardClick = () => {
    setShowTimer(false);
    onMeasurementDiscardTimerComplete(true);
  }

  const handleTimerClose = () => {
    setShowTimer(false);
    onMeasurementDiscardTimerComplete(false);
  }

  const isFirst = useRef(true)
  const handleExternalInput = () => {
    if (isFirst.current) {
      isFirst.current = false
      return;
    }

    if (showTimer) {
      if (externalInputValue === ExternalInputs.NEXT) {
        handleTimerClose();
      }

      if (externalInputValue === ExternalInputs.SKIP) {
        handleDiscardClick();
      }
    }
  }

  useEffect(() => {
    if (workflow.measurement_trigger.source === MeasurementTriggerSrc.MANUAL) {
      handleExternalInput();
    }
  }, [externalInputValue, externalInputCounter])

  return (
    <Dialog
      maxWidth={'md'}      
      open={showTimer}
    >
      <DialogTitle>{t('measurement_page.dialog_titles.measurement_result')}</DialogTitle>
      <DialogContent sx={{ height: '70vh', paddingX: 10, display: 'flex', justifyContent: 'center' }}>
        <Box margin={'auto'} width={'100%'} height={'100%'} > 
          <img src={'data:image/jpeg;base64,' + annotatedImg} height={'100%'} style={{ objectFit: 'contain' }} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ paddingX: 10, paddingBottom: 5, height: '8em' }}>
        <Box sx={{ height: '100%', width: '50%', marginLeft: 'auto', paddingRight:'1em' }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ height: '100%', fontSize: '2.4em' }}
            onClick={handleDiscardClick}
          >
            {t('common.button.discard')}
          </Button>
        </Box>
        <Box sx={{ height: '100%', width: '50%', paddingLeft:'1em' }}>
          <ProgressButton
            variant="contained"
            name={'measurement_discard_counter'}
            timeInSeconds={workflow?.ui_config?.result_timeout?.timeout}
            onTimerClose={handleTimerClose}
            startTimer={startTimer}
            text={t('measurement_page.button.accept')+' (%ds)'}
            onClick={handleTimerClose}
            textProps={{ fontSize: '2.4em' }}
            clickable={true}
          >
          </ProgressButton>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default MeasurementDiscardTimer;
