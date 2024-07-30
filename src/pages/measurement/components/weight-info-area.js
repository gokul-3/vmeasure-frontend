import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import Icons from '../../../components/ultima-icons'
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { useTheme } from "styled-components";
import { getFormattedWeight } from "../../../utils/unit-conversion";
import { MeasurementState, ProcessingState, WeighingScaleTriggerState } from "../../../constants";

function WeightInfoArea({ }) {

  const theme = useTheme();
  const { t } = useTranslation();
  const { measurement_result, measurement_state, weighing_scale_trigger } = useSelector((state) => state.appState);
  const { workflow } = useSelector((state) => state.workflow);
  const { unit } = useSelector((state) => state.settings);
  const { weighing_scale_name } = useSelector((state) => state.settings.weighing_scale)

  const [actualWeight, setActualWeight] = useState([]);

  const [backgroundColor, setBackgroundColor] = useState();

  const handleWeighingScaleTriggerChange = () => {
    if (weighing_scale_trigger?.state == WeighingScaleTriggerState.WAIT_FOR_TRIGGER) {
      setBackgroundColor('#ffa000');
    } else if (weighing_scale_trigger?.state == WeighingScaleTriggerState.WEIGHT_TRIGGERED) {
      setBackgroundColor('#66bb6a');
    } else {
      setBackgroundColor(null);
    }
  }

  useEffect(() => {
    const data = getFormattedWeight(measurement_result?.data?.measurement?.actual_weight || 0, unit.weight_unit);
    setActualWeight(data);

  }, [measurement_result, unit]);

  useEffect(() => {
    if (workflow?.support_trigger?.is_weighing_scale_trigger_enabled) {
      handleWeighingScaleTriggerChange()
    } else {
      setBackgroundColor(null);
    }

  }, [workflow?.support_trigger?.is_weighing_scale_trigger_enabled, weighing_scale_trigger])

  return (

    <Paper variant="outlined"
      sx={{
        alignItems: "center",
        borderRadius: 2,
        display: "flex",
        height: "100%",
        width: "100%",
        backgroundColor: backgroundColor,
        opacity: (weighing_scale_name?.toLowerCase() === 'none' || !weighing_scale_name) ? 0.7 : 1
      }}
    >
      <Box sx={{ width: '35%', display: 'flex', justifyContent: 'center', textAlign: 'center', height: '100%', }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: '70%',
            height: '70%',
            margin: 'auto',
            padding: 4
          }}
        >
          <Icons.ScaleWhiteIcon />
        </Avatar>
      </Box>
      <Box sx={{ width: '60%', textAlign: 'center' }}>
        <Stack alignItems="center">
          <Typography variant="body6" marginBottom={3}>
            {t('measurement_page.measurement_data.actual_weight')}
          </Typography>
          {
            (((
              measurement_state.currentState === MeasurementState.MEASUREMENT &&
              measurement_state.processingState > ProcessingState.IN_PROGRESS
            ) || measurement_state.currentState > MeasurementState.MEASUREMENT) &&
              measurement_result?.status === false &&
              measurement_result?.data?.measurement?.status_code < 600
            ) ?
              <div style={{ width: '100%', textAlign: 'center', display: 'flex', alignContent: 'center', alignItems: 'baseline', justifyContent: 'center' }}>
                <Typography variant="body2" fontSize={'5em'} fontWeight={'bold'}>
                  {'NA'}
                </Typography>
              </div>

              :

              <div style={{ width: '100%', textAlign: 'center', display: 'flex', alignContent: 'center', alignItems: 'baseline', justifyContent: 'center' }}>
                {
                  actualWeight.map((weightData, index) => {
                    return <div key={index} style={{ display: 'flex', justifyContent: 'end', alignItems: 'baseline', }}>
                      <Typography variant="body2" fontSize={'5em'} fontWeight={'bold'}>
                        {weightData.weight}
                      </Typography>
                      <Typography variant="body2" fontSize={'3em'} fontWeight={'bold'} marginX={3} >
                        {weightData.unit}
                      </Typography>
                    </div>
                  })
                }
              </div>
          }
        </Stack>
      </Box>
    </Paper >

  )
}

export default WeightInfoArea;
