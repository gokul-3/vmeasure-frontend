import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DoneIcon from '@mui/icons-material/Done';
import { useRef, useState } from "react";


const TextBox = ({ isNumberField, onChange, defaultValue, getFormData, tableColumnKey, required, isDisabled, label, rowKey, triggerEventAPI, layoutId, tableIndex }) => {

    const textField = useRef(null)

    const sendData = () => {
        try {
            const currentFormData = JSON.parse(JSON.stringify(getFormData()));
            if (onChange && tableColumnKey && rowKey && currentFormData && layoutId && tableColumnKey) {
                currentFormData[tableIndex][tableColumnKey] = textField.current.value;
                triggerEventAPI(onChange, { rowKey: rowKey });
            }
        } catch (err) {
            //consoleerror('Error in TextBox sendData:', err)
        }
    }

    return (
        <Box display={"flex"} width={'100%'} >
            <TextField
                inputRef={textField}
                sx={{ width: '100%' }}
                required={required}
                disable={isDisabled}
                id="outlined-required"
                label={label ?? ""}
                defaultValue={defaultValue ?? ""}
                type={isNumberField ? "number" : "text"}
            />
            <IconButton aria-label="done" disableRipple={true} onClick={sendData}>
                <DoneIcon />
            </IconButton>
        </Box>
    )
}

export default TextBox;