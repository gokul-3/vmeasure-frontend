import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  Paper,
  Popper,
  Fade,
  Alert,
  useTheme,
  Avatar,
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux'
import Icons from '../../../components/ultima-icons'
import appState from "../../../redux/reducers/measurement-states";
import { useTranslation } from "react-i18next";

function VolumetricDivisor({ onVolumetricChange, volumetricDivisor, error, disabled }) {

  const { workflow } = useSelector((state) => state.workflow);
  const { volumetric_divisor_name } = useSelector((state) => state.appState);
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const [volumetricDivisorValue, setVolumetricDivisorValue] = useState('');

  useEffect(() => {

    if (workflow?.volumetric_config?.is_standard_divisor) {
      onVolumetricChange({ name: 'Default', volumetric_divisor: workflow?.volumetric_config?.volumetric_divisor });
    } else {
      // Set the retained dynamic volumetric divisor value
      if (volumetric_divisor_name) {
        const divisor = workflow?.volumetric_config?.dynamic_divisors?.find((divisor) => divisor.name === volumetric_divisor_name);
        onVolumetricChange(divisor);
      }
    }

  }, [workflow, volumetric_divisor_name])

  const handleVolumetricChange = (event) => {
    const divisor = workflow?.volumetric_config?.dynamic_divisors?.find((divisor) => divisor.name === event.target.value)

    if (divisor.is_retain) {
      dispatch(appState.actions.updateVolumetricDivisor({ volumetric_divisor_name: divisor.name }))
    } else {
      dispatch(appState.actions.updateVolumetricDivisor({ volumetric_divisor_name: null }))
    }
    // Send the full divisor value
    onVolumetricChange(divisor);
  }

  useEffect(() => {

    setAnchorEl(volumetricRef.current)
  }, [])

  useEffect(() => {
    setVolumetricDivisorValue(workflow?.volumetric_config?.is_standard_divisor ? 'default' : volumetricDivisor?.name)
  }, [volumetricDivisor])

  const theme = useTheme();
  const volumetricRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          opacity: disabled ? 0.8 : 1
        }}>

        <Box sx={{ width: '35%', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
          {/* <img src={Icons.VolumetricWeightWhiteIcon} style={{ width: '11em', height: '11em' }} /> */}
          <Avatar
            sx={{ bgcolor: theme.palette.primary.main, width: '70%', height: '70%', padding: 7 }}
          >
            {<Icons.VolumetricWeightWhiteIcon />}
          </Avatar>
        </Box>

        <Box sx={{ width: '60%', margin: 'auto', }}>
          <Box display={'flex'} marginBottom={3}>
            <Typography fontSize={'2.6em'}>
              {t('measurement_page.measurement_data.volumetric_divisor')}
            </Typography>
            <Typography fontSize={'2.5em'} marginLeft={2}>
              <span style={{ color: 'red' }}> *</span>
            </Typography>
          </Box>
          <FormControl variant="outlined" fullWidth ref={volumetricRef}>
            <Select
              labelId="demo-simple-select-label"
              id="volumetric-divisor"
              value={volumetricDivisorValue}
              // {workflow?.volumetric_config?.is_standard_divisor ? 'default' : volumetricDivisor?.name}
              label=""
              disabled={disabled}
              onChange={handleVolumetricChange}
            >
              {
                workflow?.volumetric_config?.is_standard_divisor
                  ?
                  <MenuItem value={'default'}>{workflow?.volumetric_config?.volumetric_divisor}</MenuItem>
                  :
                  workflow?.volumetric_config?.dynamic_divisors.map((divisor) => (
                    <MenuItem key={divisor.name} value={divisor.name}>{divisor.name}</MenuItem>
                  ))
              }
            </Select>
          </FormControl>

        </Box>
        <Popper
          open={error}
          anchorEl={anchorEl}
          placement={'bottom-start'}
          transition
          sx={{ marginTop: 5 }}
        // modifiers={}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <Alert variant="filled" severity="error" sx={{ fontSize: '2em' }}>
                  {'Choose volumetric divisor'}
                </Alert>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Paper>
    </>
  )
}

export default VolumetricDivisor;
