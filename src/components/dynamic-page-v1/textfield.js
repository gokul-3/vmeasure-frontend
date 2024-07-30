import React, { forwardRef } from "react";
import { Grid, Typography, TextField } from "@mui/material";
import { useSelector } from "react-redux";

function DynamicPageTextField({ element, textValue, setTextValue, handleTextFieldFocus }, ref) {

  const { font_size: fontSize } = useSelector(state => state.applicationState);
  const label = element.name

  const handleChange = (event) => {
    element.content.props.onChange(event.target.value)
    setTextValue(label, event.target.value)
  }

  return (
    <Grid item xs={6} sx={{ padding: 5, marginBottom: 2 }}>
      <TextField 
        id="standard-basic"
        value={textValue[label]}
        onChange={handleChange}
        label={
          <Typography fontSize={(fontSize?.toUpperCase() === "DEFAULT") ? '3em' : '4em'}> {element.content.key}</Typography>
        }
        inputProps={{
          style: { fontSize: (fontSize?.toUpperCase() === "DEFAULT") ? '3em' : '4em' }
        }}
        variant="standard"
        fullWidth
        name={element.name}
        inputRef={ref}
        onKeyDown={(e) => {
          // Check for Tab (keyCode 9), Page Up (keyCode 33), or Page Down (keyCode 34)
          if (e.keyCode === 9 || e.keyCode === 33 || e.keyCode === 34) {
            e.preventDefault();
          }
        }}
        onFocus={() => handleTextFieldFocus(ref)}
      />
    </Grid>
  )
}

export default forwardRef(DynamicPageTextField);
