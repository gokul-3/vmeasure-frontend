import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const CheckBox = ({ label, defaultValue, isDisabled, styles, icon, onChange, tableColumnKey, rowKey, layoutId, getFormData, tableIndex, triggerEventAPI }) => {

    const sendData = (e) => {
        try {
            const currentFormData = JSON.parse(JSON.stringify(getFormData()));
            if (onChange && tableColumnKey && rowKey && currentFormData && layoutId) {
                currentFormData[tableIndex][tableColumnKey] = e.target.checked;
                triggerEventAPI(onChange, { rowKey: rowKey });
            }
        } catch (err) {
            //consoleerror('Error in CheckBox sendData:', err);
        }
    }

    return (
        <FormControlLabel
            control={
                <Checkbox
                    label={label ?? null}
                    defaultChecked={defaultValue ?? false}
                    // icon={icon ?? <></>}
                    // checkedIcon={icon ?? <></>}
                    onChange={sendData}
                    sx={styles}
                />
            }
            label={label}
            disabled={isDisabled}
        />

    )
}

export default CheckBox;
