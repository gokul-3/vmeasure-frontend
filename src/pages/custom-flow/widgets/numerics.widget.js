
import getIcon from './icons'
import { Box, IconButton, TextField, Slider, Typography, Grid } from '@mui/material'
import { getWidgetAttributes, getWidgetStyle } from "../utils/wiget.utils";
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { getFieldStyle, getWrapperStyle, getLabelStyle } from '../../../constants/custom-flow';

//SLIDER
const SliderWidget = (props) => {
    const { schema, value, onChange } = props
    const widgetStyle = { width: "50%", ...getWidgetStyle(props) }

    return (
        <Box sx={widgetStyle}>
            <Slider
                defaultValue={value}
                aria-label="Default"
                valueLabelDisplay="auto"
                onChange={(event) => {
                    const formData = {
                        value: Number(event.target.value),
                        URL: schema.onChange
                    }
                    onChange(formData)
                }}
            />
        </Box>
    );
}

//COUNTER WIDGET
const CounterWidget = (props) => {
    const { t } = useTranslation()
    const { schema, value, onChange, formContext, autofocus } = props;
    const { disabled } = getWidgetAttributes(props);
    const isFullWidth = formContext?.isFullWidth;
    const [count, setCount] = useState(isNaN(Number(value)) ? 0 : Number(value));


    const handleIncrement = () => {
        setCount(Number(count) + 1);
    };

    const handleDecrement = () => {
        if (count > 0) {
            setCount(Number(count) - 1);
        }
    };
    const handleChange = (event) => {
        setCount(event.target.value);
    }
    useEffect(() => {
        const formData = {
            value: count,
            URL: schema.onChange
        }
        onChange(formData)
    }, [count])

    const RemoveCircleIcon = getIcon("RemoveCircle");
    const AddCircleIcon = getIcon("AddCircle")

    return (
        <Grid container xs={12} sx={getWrapperStyle(isFullWidth)}>
            <Grid item xs={6} >
                <Box sx={getLabelStyle(isFullWidth)}>
                    <Typography variant="h3">
                        {t(schema.title)}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box sx={getFieldStyle(isFullWidth)}>
                    <IconButton aria-label="delete" fontSize={"3.5rem"} onClick={handleDecrement}>
                        <RemoveCircleIcon color="primary" sx={{ width: "6vh", height: "6vh", }} />
                    </IconButton>
                    <TextField
                        id="outlined-required"
                        value={count}
                        error={false}
                        type='number'
                        onChange={handleChange}
                        sx={{ width: "100%", fontSize: "3rem", }}
                        disabled={disabled ?? false}
                        inputRef={disabled ? null : formContext.addFormFieldRef}
                        autoFocus={autofocus}
                    />
                    <IconButton aria-label="delete" fontSize={"2.5rem"} onClick={handleIncrement}>
                        <AddCircleIcon color="primary" sx={{ width: "6vh", height: "6vh", }} />
                    </IconButton>
                </Box>
            </Grid>
        </Grid>



    )
}


export { SliderWidget, CounterWidget }