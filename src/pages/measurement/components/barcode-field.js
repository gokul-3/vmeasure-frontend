import { Alert, Fade, Paper, Popper, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MeasurementTriggerSrc, MeasurementState, ProcessingState } from "../../../constants";
import { closeOnboardKeyboard, openOnboardKeyboard } from "../../../services/keyboard.service";

const handleKeyboardOpen = async (disabled) => {
  !disabled && await openOnboardKeyboard()
}
const handleKeyboardClose = async () => {
  await closeOnboardKeyboard()
}


export default function BarcodeField({ label, value, error, showError, isHighlighted, onBarcodeChange, disabled, editable, onBarcodeCompleted }) {

  const barcodeRef = useRef();
  const spanref = useRef();
  const theme = useTheme();

  const { workflow } = useSelector((state) => state.workflow);

  const [anchorEl, setAnchorEl] = useState(null);
  const [arrowRef, setArrowref] = useState();

  const [backgroundColor, setBackgroundColor] = useState({
    paper: '#ffffff',
    textfield: '#ffffff',
  });

  const { measurement_state } = useSelector((state) => state.appState);

  const handleBarcodeValueChange = (e) => {
    onBarcodeChange(e.target.value)
  }

  const handleBarcodeFieldKeyDown = (e) => {
    if (workflow.measurement_trigger?.source === MeasurementTriggerSrc.BARCODE &&
      value?.length &&
      e.code === 'Enter') {
      onBarcodeCompleted();
    }
  }

  useEffect(() => {
    setAnchorEl(barcodeRef.current)
    setArrowref(spanref.current)
  }, [])


  const changeBarcodeBGColor = () => {

    if (disabled || measurement_state.currentState > MeasurementState.MEASUREMENT) {
      setBackgroundColor({
        paper: '#ffffff',
        textfield: '#ffffff',
      })
      return
    }

    if (measurement_state.currentState < MeasurementState.BARCODE_VALIDATE) {
      if (isHighlighted) {
        setBackgroundColor({
          paper: theme.palette.highlightFields.secondary,
          textfield: theme.palette.highlightFields.primary,
        })
      } else {
        setBackgroundColor({
          paper: '#ffffff',
          textfield: '#ffffff',
        })

      }
      return
    }

    if (measurement_state.currentState == MeasurementState.BARCODE_VALIDATE) {
      if (measurement_state.processingState == ProcessingState.SUCCEED) {
        setBackgroundColor({
          paper: '#66bb6a',
          textfield: '#e8f5e9',
        })

        return;
      } else if (measurement_state.processingState == ProcessingState.FAILED) {
        setBackgroundColor({
          paper: '#ef5350',
          textfield: '#ffcdd2',
        })

        return;
      }
    }


  }

  useEffect(() => {

    changeBarcodeBGColor();

  }, [disabled, isHighlighted, measurement_state])

  return (

    <Paper variant="outlined" sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 5,
      borderRadius: 2,
      opacity: (disabled) ? 0.7 : 1,
      backgroundColor: backgroundColor.paper
    }}>

      <Typography variant="h3" width={'30%'} color={disabled ? '#aaa' : 'inherit'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'} marginLeft={4}>
        {label}
      </Typography>
      <TextField
        ref={barcodeRef}
        value={value}
        onDoubleClick={()=>handleKeyboardOpen(disabled)}
        onBlur={handleKeyboardClose}
        InputProps={{
          readOnly: (!editable || workflow.measurement_trigger?.source === MeasurementTriggerSrc.REMOTE),
          style: {
            height: 70,
            fontSize: '4em',
            fontWeight: 'bold',
            backgroundColor: backgroundColor.textfield,
            border: '0px solid transparent'
          },
        }}
        fullWidth
        onChange={handleBarcodeValueChange}
        onKeyDown={handleBarcodeFieldKeyDown}
        id={'barcode_field'}
        disabled={disabled}
      />

      <Popper
        open={showError}
        anchorEl={anchorEl}
        placement={'bottom-start'}
        transition
        modifiers={[
          arrowRef ?
            {
              name: 'arrow',
              enabled: true,
              options: {
                element: arrowRef,
              },
            }
            : {},
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Alert variant="filled" severity="error" sx={{ fontSize: '2em' }}>
                {error}
              </Alert>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Paper>
  )
}