import React, { forwardRef } from "react"
import { Grid, Typography, Checkbox, FormControl, FormControlLabel } from "@mui/material";

function DynamicPageCheckboxField({ element, checkboxValue, setCheckboxValue, index, focus }, ref) {

  const label = element.name
  const handleChange = (event) => {
    element.content.props.onChange(event.target.checked)
    setCheckboxValue(label,event.target.checked)
  }

  const elementStyle = {
    width: focus ? '45px' : "",
    height: focus ? '45px' : "",
    border: focus ? '2px solid transparent' : "",
    borderRadius: focus ? '50%' : "",
    backgroundColor: focus ? '#c5d1c7' : ""
  }

  return (
    <Grid container xs={4} sx={{ padding: 5, marginBottom: 2 }} direction={'row'}>
      <FormControl fullWidth>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkboxValue[label]}
              onChange={handleChange}
              name={element.name}
              size="medium"
              sx={{ '& .MuiSvgIcon-root': { fontSize: 48 } }}
              inputRef={ref}
              style={index === 0 ? elementStyle : {}}
            />
          }
          label={
            <Typography
              variant={'body6'}
              textOverflow={'ellipsis'}
              overflow={'hidden'}
              width={'100%'}
            >
              {element.name}
            </Typography>
          }
          sx={{ width: '100%' }}
        />
      </FormControl>
    </Grid>
  )
}

export default forwardRef(DynamicPageCheckboxField)
