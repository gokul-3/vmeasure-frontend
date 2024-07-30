import React from "react";
import {
  Paper,
  Typography
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { MeasurementState, ProcessingState } from "../../../constants";
import { useSelector } from "react-redux";

function MeasurementDuration({ disabled }) {

  const { measurement_result, measurement_state } = useSelector((state) => state.appState);

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        paddingX: 8,
        height: '100%',
        opacity: disabled ? 0.5 : 1,
        visibility: disabled ? 'hidden' : 'visible'
      }}>
      <AccessTimeIcon sx={{ fontSize: "6em", marginRight: 5 }} />
      {
        < Typography pl={2} variant="h3">
          {
            // Show the measurement time only after measurement result.
            (
              (
                measurement_state.currentState > MeasurementState.MEASUREMENT || (
                  measurement_state.currentState === MeasurementState.MEASUREMENT &&
                  measurement_state.processingState > ProcessingState.IN_PROGRESS
                )
              ) &&
              measurement_result?.data?.measurement?.scan_duration
            ) ?
              `${(measurement_result?.data?.measurement?.scan_duration)}s`
              :
              '-- -- -- '
          }
        </Typography>
      }
    </Paper>
  )
}

export default MeasurementDuration;
