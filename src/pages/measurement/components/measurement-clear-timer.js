import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import ProgressButton from "../../../components/button/progress-button";
import { Button, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

function MeasurementClearTimer({ isReferenceBoxMeasurement, onMeasurementClearComplete, measurementResultStatus }) {

  const { workflow } = useSelector((state) => state.workflow);
  const { font_size: fontSize } = useSelector(state => state.applicationState);

  const [startTimer, setStartTimer] = useState(false);

  const { t } = useTranslation()

  const initTimer = () => {
    // Show the clear timer for reference box even it is skippable
    if (!isReferenceBoxMeasurement && (
      (
        measurementResultStatus && workflow.ui_config.result_timeout.is_skip_enabled
      ) || (
        !measurementResultStatus && workflow.ui_config.result_timeout.is_skip_on_failure_measurement
      )
    )) {
      handleTimerClose()
      return;
    }

    // If measurement reject is not enabled, call the function immediately to save the measurement
    // Otherwise open the model dialog for rejection
    if (workflow?.ui_config?.result_timeout?.is_enabled) {
      setStartTimer(true);
    }
  }

  useEffect(() => {
    initTimer()
  }, [workflow])

  const handleTimerClose = () => {
    setStartTimer(false);
    onMeasurementClearComplete();
  }
  // Add timer module on timer ends call onMeasurementTimerComplete


  return (

    Boolean(workflow.ui_config.result_timeout.is_enabled)
      ?
      Boolean(startTimer) &&
      <Box sx={{ height: (fontSize?.toUpperCase() === "DEFAULT") ? '80%' : '100%' }}>
        <ProgressButton
          variant="contained"
          timeInSeconds={Number(workflow?.ui_config?.result_timeout?.timeout)}
          onTimerClose={handleTimerClose}
          startTimer={startTimer}
          width={'100%'}
          textProps={{ fontSize: (fontSize?.toUpperCase() === "DEFAULT") ? '3.6em' : '5em' }}
          text={t('measurement_page.button.clearing_in') + ' %ds'}
        >
        </ProgressButton>
      </Box>
      :
      <Button
        variant="contained"
        color="primary"
        sx={{ width: '100%', }}
        onClick={onMeasurementClearComplete}

      >
        <Typography variant="body4">{t('measurement_page.button.clear')}</Typography>
      </Button>

  )
}

export default MeasurementClearTimer;
