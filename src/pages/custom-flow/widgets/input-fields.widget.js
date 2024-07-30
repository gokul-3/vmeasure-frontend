import getIcon from "./icons";
import { useState } from "react";
import { Box, TextField, Typography, InputAdornment, IconButton, Grid } from "@mui/material";
import { getWidgetStyle, getWidgetAttributes } from "../utils/wiget.utils";
import { useTranslation } from 'react-i18next';
import { getWrapperStyle, getFieldStyle, getLabelStyle } from '../../../constants/custom-flow'
import { closeOnboardKeyboard, openOnboardKeyboard } from "../../../services/keyboard.service"
import { styled } from '@mui/material/styles';

const CustomTextField = styled(TextField)(() => ({
    '& legend': {
        fontSize: "1.47rem",
    }
}));

//BASIC TEXTFIELD

const handleKeyboardOpen = async () => {
    await openOnboardKeyboard()
}
const handleKeyboardClose = async () => {
    await closeOnboardKeyboard()
}

function FullTextWidget(props) {

    const { value, onChange, schema, formContext, autofocus } = props;
    const { isFullWidth } = formContext
    const { isNumeric, disabled } = getWidgetAttributes(props);
    const textFieldStyle = { ...getWidgetStyle(props) };
    const { t } = useTranslation();

    return (
        <Grid container style={{ width: '100%', height: '100%' }} sx={getWrapperStyle(isFullWidth)}>
            <Grid item xs={12}>
                <Box sx={{ ...getFieldStyle(isFullWidth), width: "85%", paddingLeft: isFullWidth ? 0 : 30 }}>
                    <CustomTextField
                        fullWidth
                        value={value}
                        label={t(`${schema.title}`)}
                        placeholder={props.placeholder ?? ""}
                        onDoubleClick={handleKeyboardOpen}
                        onBlur={handleKeyboardClose}
                        InputLabelProps={{ sx: { fontSize: "2rem" } }}
                        InputProps={{
                            sx: { ...textFieldStyle, fontSize: "3rem" }
                        }}
                        type={isNumeric ? "number" : "text"}
                        onChange={(e) => {
                            const formDatatoUpdate = {
                                URL: schema?.onChange,
                                value: e.target.value
                            };
                            onChange(formDatatoUpdate);
                        }}
                        disabled={disabled ?? false}
                        inputRef={disabled ? null : formContext.addFormFieldRef}
                        autoFocus={autofocus}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

function FullTextAreaWidget(props) {
    const { t } = useTranslation();
    const { value, onChange, schema, formContext, autofocus } = props;
    const { isNumeric, disabled } = getWidgetAttributes(props);
    const { isFullWidth } = formContext
    const textFieldStyle = { ...getWidgetStyle(props) };

    return (
        <Grid container style={{ width: '100%', height: '100%' }} sx={getWrapperStyle(isFullWidth)}>
            <Grid item xs={12}>
                <Box sx={{ ...getFieldStyle(isFullWidth), width: "85%", paddingLeft: isFullWidth ? 0 : 30 }}>
                    <CustomTextField
                        fullWidth
                        multiline
                        rows={3}
                        value={value}
                        label={t(`${schema.title}`)}
                        placeholder={props.placeholder ?? ""}
                        onDoubleClick={handleKeyboardOpen}
                        onBlur={handleKeyboardClose}
                        InputLabelProps={{ sx: { fontSize: "2rem" } }}
                        InputProps={{
                            sx: { ...textFieldStyle, fontSize: "3rem" }
                        }}
                        type={isNumeric ? "number" : "text"}
                        onChange={(e) => {
                            const formDatatoUpdate = {
                                URL: schema?.onChange,
                                value: e.target.value
                            };
                            onChange(formDatatoUpdate);
                        }}
                        disabled={disabled ?? false}
                        inputRef={disabled ? null : formContext.addFormFieldRef}
                        autoFocus={autofocus}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

function TextAreaWidget(props) {
    const { t } = useTranslation();
    const { value, onChange, schema, formContext, autofocus } = props;
    const { isNumeric, disabled } = getWidgetAttributes(props);
    const { isFullWidth } = formContext
    const textFieldStyle = getWidgetStyle(props);

    return (
        <Grid container xs={12} sx={getWrapperStyle(isFullWidth)}>
            <Grid item xs={6} >
                <Box sx={getLabelStyle(isFullWidth)}>
                    <Typography variant="h3">
                        {t(`${schema.title}`)}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box sx={getFieldStyle(isFullWidth)}>
                    <TextField
                        fullWidth
                        value={value}
                        placeholder={props.placeholder ?? ""}
                        multiline
                        rows={3}
                        onDoubleClick={handleKeyboardOpen}
                        onBlur={handleKeyboardClose}
                        type={isNumeric ? "number" : "text"}
                        onChange={(e) => {
                            const formDatatoUpdate = {
                                URL: schema?.onChange,
                                value: e.target.value
                            }
                            onChange(formDatatoUpdate)
                        }}
                        InputLabelProps={{ sx: { fontSize: "2rem" } }}
                        InputProps={{ sx: { ...textFieldStyle, fontSize: "3rem" } }}
                        disabled={disabled ?? false}
                        inputRef={disabled ? null : formContext.addFormFieldRef}
                        autoFocus={autofocus}
                    />
                </Box>
            </Grid>
        </Grid>
    )
}


function TextWidget(props) {
    const { t } = useTranslation();
    const { value, onChange, schema, formContext, autofocus } = props;
    const { isNumeric, disabled } = getWidgetAttributes(props);
    const isFullWidth = formContext?.isFullWidth
    const textFieldStyle = { width: "100%", height: "4vh", ...getWidgetStyle(props) }

    return (
        <Grid container xs={12} sx={getWrapperStyle(isFullWidth)}>
            <Grid item xs={6} >
                <Box sx={getLabelStyle(isFullWidth)}>
                    <Typography variant="h3">
                        {t(`${schema.title}`)}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box sx={getFieldStyle(isFullWidth)}>
                    <TextField
                        fullWidth
                        value={value}
                        onDoubleClick={handleKeyboardOpen}
                        onBlur={handleKeyboardClose}
                        inputProps={{ sx: { ...textFieldStyle, width: "100%", fontSize: "3rem" }, ...(isNumeric ? { min: 0 } : {}) }}
                        size='medium'
                        type={isNumeric ? "number" : "text"}
                        onChange={(e) => {
                            const formDatatoUpdate = {
                                URL: schema?.onChange,
                                value: e.target.value
                            }
                            onChange(formDatatoUpdate)
                        }}
                        disabled={disabled ?? false}
                        inputRef={disabled ? null : formContext.addFormFieldRef}
                        autoFocus={autofocus}
                    />
                </Box>
            </Grid>
        </Grid>
    )
}


//TEXTFIELD WITH DONE BUTTON
function TextWithButtonWidget(props) {
    const { t } = useTranslation();
    const { value, onChange, schema, formContext, autofocus } = props;
    const { triggerEventAPI, isFullWidth } = formContext
    const { isNumeric, disabled } = getWidgetAttributes(props);
    const textFieldStyle = { width: "100%", height: "4.5vh", ...getWidgetStyle(props) }
    const buttonSize = "7vh";

    const handleClick = () => {
        triggerEventAPI(schema.onClick)
    }

    const IconComponent = getIcon("Done")
    return (
        <Grid container xs={12} sx={getWrapperStyle(isFullWidth)}>
            <Grid item xs={6} >
                <Box sx={getLabelStyle(isFullWidth)}>
                    <Typography variant="h3">
                        {t(`${schema.title}`)}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box sx={getFieldStyle(isFullWidth)}>
                    <TextField
                        fullWidth
                        value={value}
                        inputProps={{ sx: { ...textFieldStyle, width: "100%", fontSize: "3rem" }, ...(isNumeric ? { min: 0 } : {}) }}
                        size='medium'
                        type={isNumeric ? "number" : "text"}
                        onDoubleClick={handleKeyboardOpen}
                        onBlur={handleKeyboardClose}
                        onChange={(e) => {
                            const formDatatoUpdate = {
                                URL: schema?.onChange,
                                value: e.target.value
                            }
                            onChange(formDatatoUpdate)
                        }}
                        inputRef={formContext.addFormFieldRef}
                        autofocus={autofocus}
                        disabled={disabled ?? false}
                    />
                    <IconButton onClick={handleClick} sx={{ width: `${buttonSize}`, height: `${buttonSize}`, background: "lightgray", borderRadius: "0px" }}>
                        <IconComponent style={{ color: "green" }} />
                    </IconButton>
                </Box>
            </Grid>
        </Grid>

    );
}


//PASSWORD
const PasswordWidget = (props) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const toggleVisibility = () => { setShowPassword((prevState) => !prevState); };
    const { schema, onChange, value, formContext, autofocus } = props
    const { disabled } = getWidgetAttributes(props);
    const { isFullWidth } = formContext
    const textFieldStyle = { width: "100%", height: "4vh", ...getWidgetStyle(props) }

    const VisibilityIcon = getIcon("Visibility");
    const VisibilityOffIcon = getIcon("VisibilityOff");


    return (
        <Grid container xs={12} sx={getWrapperStyle(isFullWidth)}>
            <Grid item xs={6} >
                <Box sx={getLabelStyle(isFullWidth)}>
                    <Typography variant="h3">
                        {t(`${schema.title}`)}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box sx={getFieldStyle(isFullWidth)}>
                    <TextField fullWidth
                        type={showPassword ? 'text' : 'password'}
                        label=""
                        variant="outlined"
                        inputProps={{ sx: { ...textFieldStyle, width: "100%", fontSize: "3rem" } }}
                        value={value}
                        onDoubleClick={handleKeyboardOpen}
                        onBlur={handleKeyboardClose}
                        onChange={(e) => {
                            const formDatatoUpdate = {
                                URL: schema?.onChange,
                                value: e.target.value
                            }
                            onChange(formDatatoUpdate)
                        }
                        }
                        InputProps={{
                            sx: { "width": "100%", "height": "7vh" },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleVisibility} edge="end" >
                                        {showPassword ? <VisibilityIcon sx={{ fontSize: "2.5rem" }} /> : <VisibilityOffIcon sx={{ fontSize: "2.5rem" }} />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        inputRef={formContext.addFormFieldRef}
                        autoFocus={autofocus}
                        disabled={disabled ?? false}
                    />
                </Box>
            </Grid>
        </Grid>

    );
};

export { FullTextAreaWidget, FullTextWidget, TextAreaWidget, TextWidget, TextWithButtonWidget, PasswordWidget }