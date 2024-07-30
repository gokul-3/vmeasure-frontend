import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useState } from 'react';

const SelectBox = ({
    defaultValue,
    label,
    data,
    options,
    triggerEventAPI,
    onChange,
    tableColumnKey,
    rowKey,
    layoutId,
    getFormData,
    tableIndex
}) => {
    const selectDefault = defaultValue ?? data;
    const [selectValue, setSelectValue] = useState(selectDefault);

    const sendData = (e) => {
        try {
            setSelectValue(e.target.value);
            const currentFormData = JSON.parse(JSON.stringify(getFormData()));
            if (onChange && tableColumnKey && rowKey && currentFormData && layoutId) {
                currentFormData[tableIndex][tableColumnKey] = e.target.value;
                triggerEventAPI(onChange, { rowKey: rowKey });
            }
        } catch (err) {
            //consoleerror('Error in SelectBox sendData:', err);
        }
    }


    return (
        <FormControl fullWidth>
            {label && <InputLabel>{label}</InputLabel>}
            <Select
                sx={{ minWidth: '10vw' }}
                label={label ?? ""}
                value={selectValue}
                onChange={sendData}
            >
                {options?.map((option, i) => <MenuItem key={i} value={option}>{option}</MenuItem>)}
            </Select>

        </FormControl>
    )
}

export default SelectBox;