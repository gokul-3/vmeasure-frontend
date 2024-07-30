import React, { useEffect, useState } from "react";
import { TextFieldComponent, ListFieldComponent, ToggleFieldComponent } from "./custom-field-components";
import { Grid, Typography, Paper, useTheme } from '@mui/material'
import appState from "../../redux/reducers/measurement-states";
import { useDispatch, useSelector } from "react-redux";
import { MeasurementState, MeasurementStateInfoReason, ProcessingState } from "../../constants";

function CustomFields({ input, onValueChange, isDefault, barcodeScan, errorMsg, isHighlighted, init, disabled }) {

  const [fieldInput, setFieldInput] = useState(null);
  const dispatch = useDispatch();
  const theme = useTheme()

  const {
    retainable_fields, measurement_state
  } = useSelector((state) => state.appState);

  const { workflow } = useSelector((state) => state.workflow);

  let isUpdateRetainData = true;


  const initialValue = () => {

    const values = input.value.split(',');

    const field = {
      type: input.type,
      key: input.key,
      default: input.default_value,
      isMandatory: input.is_mandatory,
      isRetainData: input.is_retain_data
    };

    if (input.type === 'Text') {
      field.value = input.value;
      field.current_value = input.default_value || input.value;
      // Update with retained data
    } else if (input.type === 'List') {
      field.value = values;
      field.current_value = input.default_value || '';
    } else {
      field.value = values;
      field.current_value = { [values[0]]: true };
      field.default = values[0];
    }

    if (field.isRetainData && retainable_fields[input.key]) {
      field.current_value = retainable_fields[input.key]
    }
    setFieldInput({ ...field });
  };

  useEffect(() => {
    initialValue();
  }, [input]);

  useEffect(() => {
    if (fieldInput) {
      onValueChange(fieldInput.key, fieldInput.current_value);
    }
  }, [fieldInput]);

  useEffect(() => {
    if (isDefault && fieldInput) {
      handleChange(fieldInput.default)
    }
  }, [isDefault])

  useEffect(() => {
    if (barcodeScan && fieldInput) {
      handleChange(barcodeScan.value);
    }
  }, [barcodeScan])

  const handleChange = (value) => {
    setFieldInput({ ...fieldInput, current_value: value });
    if (fieldInput.isRetainData && isUpdateRetainData) {
      dispatch(appState.actions.updateRetainableCustomFields({
        key: fieldInput.key,
        value: value
      }));
    }
  }

  const handleToggleChange = (value) => {
    const key = value ? fieldInput.value[1] : fieldInput.value[0];
    const newValue = {
      [key]: true
    }
    handleChange(newValue)
  }

  const initCustomFieldValue = () => {
    if (fieldInput?.isRetainData === false) {
      setFieldInput({ ...fieldInput, current_value: fieldInput?.default || '' })
    }
  }

  useEffect(() => {
    if (init) {
      initCustomFieldValue()
    }
  }, [init])

  return (
    <Paper
      variant="outlined"
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: 2,
        ...(Boolean(isHighlighted && fieldInput?.type === 'Text') && { backgroundColor: theme.palette.highlightFields.secondary })
      }}>
      {
        fieldInput &&
        <Grid container sx={{ width: '100%', height: '100%' }}>
          <Grid container item xs={12} key={fieldInput.key} direction={'row'}>
            <Grid item xs={5} sx={{ padding: 5 }} display={'flex'} alignItems={'center'} >
              <Typography maxWidth={'90%'} fontSize={'2.5em'} textOverflow={'ellipsis'} overflow={'hidden'} whiteSpace={'nowrap'} >
                {fieldInput?.key}
              </Typography>
              {fieldInput?.isMandatory &&
                <Typography fontSize={'2.5em'}>
                  <span style={{ color: 'red' }}> *</span>
                </Typography>
              }
            </Grid>
            <Grid container item xs={7} display={'flex'} justifyContent={'flex-start'} alignItems={'center'} sx={{ padding: 2 }}>
              {(() => {
                switch (fieldInput.type) {
                  case 'List':
                    return (
                      <ListFieldComponent
                        keyValue={fieldInput.key}
                        valueList={fieldInput.value}
                        value={fieldInput.current_value}
                        onValueChange={handleChange}
                        isMandatory={fieldInput.isMandatory}
                        disabled={disabled}
                      />
                    );
                  case 'Text':
                    return (
                      <TextFieldComponent
                        keyValue={fieldInput.key}
                        value={fieldInput.current_value}
                        onValueChange={handleChange}
                        isMandatory={fieldInput.isMandatory}
                        backgroundColor={isHighlighted ? theme.palette.highlightFields.primary : 'inherit'}
                        disabled={disabled}
                      />
                    );
                  case 'Toggle':
                    return (
                      <>
                        <Grid item xs={4} display={'flex'} justifyContent={'center'} alignItems={'center'} >
                          <Typography sx={{ fontSize: '2.5em' }} width={'10em'} textOverflow={'ellipsis'} overflow={'hidden'} whiteSpace={'nowrap'} >{fieldInput.value[0]}</Typography>
                        </Grid>
                        <Grid item xs={4} display={'flex'} justifyContent={'center'} alignItems={'center'}  >
                          <ToggleFieldComponent
                            keyValue={fieldInput.key}
                            value={Object.keys(fieldInput.current_value)[0] === fieldInput.value[1]}
                            onValueChange={handleToggleChange}
                            isMandatory={fieldInput.isMandatory}
                            disabled={disabled}
                          />
                        </Grid>
                        <Grid item xs={4} display={'flex'} justifyContent={'center'} alignItems={'center'} >
                          <Typography sx={{ fontSize: '2.5em' }} width={'10em'} textOverflow={'ellipsis'} overflow={'hidden'} whiteSpace={'nowrap'}>{fieldInput.value[1]}</Typography>
                        </Grid>
                      </>
                    );
                  default:
                    return null;
                }
              })()}
            </Grid>
          </Grid>

        </Grid>}
    </Paper>
  )

}

export default CustomFields;
