import React, { forwardRef } from "react"
import {
  Grid,
  Typography,
  Radio,
  FormControl,
  FormControlLabel
} from "@mui/material";

function DynamicPageRadioButton({ element, radioValue, setRadioValue, optionValue, index, focus }, ref) {
  const handleChange = (event) => {
    element.content.props.onChange(event.target.value)
    const prevValue = { ...radioValue }
    const targetValue = event.target.value

    Object.entries(prevValue).forEach(([key, value]) => {
      if (key === targetValue) setRadioValue(targetValue, true)
      else setRadioValue(key, "")
    });
  }

  const elementStyle = {
    width: focus ? '45px' : "",
    height: focus ? '45px' : "",
    border: focus ? '2px solid transparent' : "",
    borderRadius: focus ? '50%' : "",
    backgroundColor: focus ? '#cbd4cd' : ""
  }

  return (
    <Grid container xs={4} sx={{ padding: 5, marginBottom: 2 }} direction={'row'}>
      <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <FormControlLabel
          key={optionValue}
          value={optionValue}
          sx={{ width: '100%' }}
          control={
            <Radio size='medium'
              id={optionValue}
              onChange={handleChange}
              checked={radioValue[optionValue] === true}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 48 } }}
              style={index === 0 ? elementStyle : {}}
              inputRef={ref}
            />
          }

          label={
            <Typography
              variant={'body6'}
              textOverflow={'ellipsis'}
              overflow={'hidden'}
              width={'100%'}
            >
              {optionValue}
            </Typography>
          }
        />
      </FormControl>
    </Grid>
  )
}
export default forwardRef(DynamicPageRadioButton)