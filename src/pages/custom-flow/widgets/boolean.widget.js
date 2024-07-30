import { Switch, Typography, Box, Grid } from '@mui/material'
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFieldStyle, getWrapperStyle, getLabelStyle } from '../../../constants/custom-flow';
import { getWidgetAttributes, getWidgetStyle } from "../utils/wiget.utils";
import MuiSwitch from "@mui/material/Switch";
import styled from "styled-components/macro";


const SwitchComponent = styled(MuiSwitch)(({ theme }) => ({
    width: 96,
    height: 52,
    padding: 8,
    "& .MuiSwitch-switchBase": {
        margin: 1,
        padding: 0,
        transform: "translateX(2px)",
        "&.Mui-checked": {
            transform: "translateX(48px)",
        },
        '&.Mui-checked .MuiSwitch-thumb': {
            color: theme.palette.primary.main
        }
    },
    "& .MuiSwitch-thumb": {
        width: 44,
        height: 45,
        color: theme.palette.grey.secondary
    },
    "& .MuiSwitch-track": {
        borderRadius: 20,
    },
}));

export const PrimaryColorSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-thumb": {
        width: 44,
        height: 45,
        color: theme.palette.primary.main
    },
    "& .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main
    },
}));

const SwitchWidget = (props) => {
    const { t } = useTranslation();
    const { disabled } = getWidgetAttributes(props);
    const { schema, value, onChange, formContext, autofocus } = props
    const [checked, setChecked] = useState(value);
    const isFullWidth = formContext?.isFullWidth
    const switchStyle = getWidgetStyle(props)
    const handleSwitch = (event) => { setChecked(!checked) };

    useEffect(() => {
        const formDatatoUpdate = {
            URL: schema.onChange,
            value: checked
        }
        onChange(formDatatoUpdate)
    }, [checked]);


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
                    <SwitchComponent
                        checked={checked}
                        style={switchStyle}
                        onChange={handleSwitch}
                        inputRef={disabled ? null : formContext.addFormFieldRef}
                        autoFocus={autofocus}
                        disabled={disabled}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

export { SwitchWidget }