import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import { useSelector } from 'react-redux'
import CustomFields from "../../../components/custom-fields/custom-fields";
import ResetIcon from '@mui/icons-material/Replay';

// Need to send custom field props here
function MeasurementPageCustomField({ onValuesChange, highlightedField, barcodeScan, disabled, init }) {

  const [isDefault, setIsDefault] = useState(false);

  const { workflow } = useSelector((state) => state.workflow);
  const workflowFieldsRef = useRef({});

  const handleCustomFieldValueChange = (key, value) => {
    workflowFieldsRef.current[key] = value;
    onValuesChange({ ...workflowFieldsRef.current });
    setIsDefault(false);
  }

  const handleBarcodeScan = () => {
    if (!barcodeScan) {
      return
    }

    for (let field of workflow.ui_config?.custom_fields.fields) {
      if (
        field.is_mandatory && field.type === 'Text' &&
        highlightedField === field.key
      ) {
        setBarcodeInput({ [field.key]: { ...barcodeScan } });
        break;
      }
    }
  }

  const handleResetClick = () => {
    setIsDefault(true);
  }

  useEffect(() => {
    handleBarcodeScan();
  }, [barcodeScan])

  const [barcodeInput, setBarcodeInput] = useState({});

  return (

    <Grid container item xs={12} columnSpacing={5} >
      {/* <h3>{msg}</h3> */}
      <Grid container item xs={workflow.ui_config?.custom_fields?.is_reset_enabled ? 11 : 12} columnSpacing={5} >
        {
          workflow.ui_config?.custom_fields.fields.map((custom_field, index) =>
            <Grid item xs={12 / workflow.ui_config?.custom_fields.fields.length} key={index}>
              <CustomFields
                input={custom_field}
                onValueChange={handleCustomFieldValueChange}
                isDefault={isDefault}
                barcodeScan={barcodeInput[custom_field.key]}
                isHighlighted={highlightedField === custom_field.key}
                disabled={disabled || custom_field?.disabled}
                init={init}
              />

            </Grid>
          )
        }
      </Grid>
      {
        workflow.ui_config?.custom_fields?.is_reset_enabled &&
        <Grid item xs={1}>
          <Paper variant="outlined" sx={{ width: '100%', height: '100%' }}>
            <IconButton aria-label="reset" size="large" sx={{ width: '100%', height: '100%' }} onClick={handleResetClick} disabled={disabled}>
              <ResetIcon sx={{ width: '70%', height: '70%' }} />
            </IconButton>
          </Paper>
        </Grid>
      }
    </Grid>
  )
}

export default MeasurementPageCustomField;
