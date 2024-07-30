import React from "react";
import { Autocomplete, FormControl, IconButton, InputAdornment, Paper, TextField } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import ClearIcon from '@mui/icons-material/Clear';
import { PrimaryColorSwitch } from '../switch'
import { openOnboardKeyboard,closeOnboardKeyboard } from "../../services/keyboard.service";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import appState from '../../redux/reducers/measurement-states'
import { MeasurementState, MeasurementStateInfoReason, ProcessingState } from "../../constants";

const handleKeyboardOpen = async (disabled) => {
  !disabled && await openOnboardKeyboard()
}
const handleKeyboardClose = async () => {
  await closeOnboardKeyboard()
}

export function TextFieldComponent({ keyValue, value, onValueChange, isMandatory, backgroundColor, disabled }) {

  const dispatch = useDispatch();

  const handleClickClearButton = () => {
    onValueChange('');
    dispatch(appState.actions.updateMeasurementState({
      currentState: MeasurementState.INIT,
      processingState: ProcessingState.FAILED,
      additionalInfo: { reason: MeasurementStateInfoReason.CUSTOM_FIELD_REQUIRED }
    }));
  }

  return (
    <TextField
      required={isMandatory}
      id="outlined-required"
      value={value}
      error={false}
      onDoubleClick={()=>handleKeyboardOpen(disabled)}
      onBlur={handleKeyboardClose}
      InputProps={{
        style: {
          fontSize: '3.2em',
          backgroundColor: backgroundColor
        },
        endAdornment: (<InputAdornment position="end">
          <IconButton
            onClick={() => handleClickClearButton()}
            edge="end"
            size="large"
            disabled={disabled}
          >
            <ClearIcon sx={{ fontSize: '40px' }} />
          </IconButton>
        </InputAdornment>)

      }}
      disabled={disabled}
      onChange={(e) => onValueChange(e.target.value)}
      sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}
    />
  )
}

const StyledPaper = styled(Paper)({
  maxWidth: '70em',
  width: 'fit-content',
  minWidth: '100%',
  overflow: 'auto',
  border: '1px solid #ccc'
})

export function ListFieldComponent({ keyValue, value, onValueChange, valueList, isMandatory, disabled, onFocusHandle, onBlurHandle }) {

  return (
    <FormControl variant="outlined" required={isMandatory} fullWidth disabled={disabled}>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={valueList}
        sx={{ width: '100%', fontSize: '4em' }}
        renderInput={(params) => <TextField
          {...params}
          label=""
          inputProps={{ ...params.inputProps, maxLength: 100, }}
        />}
        renderOption={(props, option) => (
          <MenuItem key={option} value={option}  {...props} sx={{ fontSize: '4em', padding: '12px' }}>
            {option}
          </MenuItem>
        )}
        ListboxProps={{ style: { overflow: 'auto', minWidth: 'inherit', width: 'inherit', overflowX: 'auto' } }}
        PaperComponent={StyledPaper}
        disabled={disabled}
        disableClearable
        onChange={(e, value) => onValueChange(value)}
        value={value}
        onBlur={handleKeyboardClose}
        onDoubleClick={()=>handleKeyboardOpen(disabled)}
      />
    </FormControl>

  )
}

export function ToggleFieldComponent({ keyValue, value, onValueChange, isMandatory, disabled }) {
  return (

    <PrimaryColorSwitch
      checked={value}
      onChange={(e) => onValueChange(e.target.checked)}
      inputProps={{ 'aria-label': 'controlled' }}
      required={isMandatory}
      sx={{ marginX: 6, opacity: disabled ? '0.5' : '1' }}
      disabled={disabled}
    />

  );
}
