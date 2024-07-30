import { Select, Checkbox, MenuItem, TextField, Autocomplete, Box, Typography, Grid, FormControl } from '@mui/material'
import { useState } from 'react'
import { getWidgetStyle, getWidgetAttributes } from "../utils/wiget.utils";
import { getFieldStyle, getWrapperStyle, getLabelStyle } from '../../../constants/custom-flow';
import { useTranslation } from 'react-i18next';


function Dropdown(props) {

    const { t } = useTranslation();
    const { schema, formContext, onChange, value, autofocus } = props
    const isFullWidth = formContext?.isFullWidth;
    const widgetStyle = getWidgetStyle(props);
    const { disabled } = getWidgetAttributes(props);
    const translatedOptions = schema.options.map(option => t(`${option}`));

    const handleChange = (event) => {
        const formDatatoUpdate = {
            URL: schema.onChange,
            value: event.target.value
        }
        onChange(formDatatoUpdate)
    };

    return (
        <Grid container xs={12} sx={getWrapperStyle(isFullWidth)}>
            <Grid item xs={6} >
                <Box sx={getLabelStyle(isFullWidth)}>
                    <Typography variant="h3" component="div">
                        {t(schema.title)}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box sx={getFieldStyle(isFullWidth)}>
                    <FormControl fullWidth >
                        <Select
                            sx={{ width: '100%', ...widgetStyle }}
                            label=""
                            value={value}
                            onChange={handleChange}
                            disabled={disabled}
                            inputRef={disabled ? null : formContext.addFormFieldRef}
                            autoFocus={autofocus}
                        >
                            {
                                translatedOptions?.map((option, i) => (
                                    <MenuItem key={i} value={option}>
                                        {option}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl >
                </Box>
            </Grid>
        </Grid>



    )
}
//MULTISELECT DROPDOWN

function MultipleSelectChip(props) {
    const { t } = useTranslation();

    const { schema, formContext, onChange, autofocus } = props;
    const widgetStyle = getWidgetStyle(props);
    const { disabled } = getWidgetAttributes(props);
    const options = schema.options;
    const isFullWidth = formContext?.isFullWidth;
    const [list, setList] = useState([]);


    const handleChange = (event) => {
        const formDatatoUpdate = {
            URL: schema.onChange,
            value: event.target.value
        }
        onChange(formDatatoUpdate)
        //to perform checked action
        setList(event.target.value)
    };

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
                    <Select
                        sx={{ width: '100%', widgetStyle }}
                        label=""
                        id="multiselect"
                        multiple
                        value={list}
                        onChange={handleChange}
                        renderValue={(selected) => selected.join(", ")}
                        disabled={disabled ?? false}
                        inputRef={disabled ? null : formContext.addFormFieldRef}
                        autoFocus={autofocus}
                    >
                        {options.map((option) => (
                            <MenuItem key={option} value={option}>
                                <Checkbox checked={list.indexOf(option) > -1} size="large" />
                                <Typography variant='body8'>{option}</Typography>
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Grid>
        </Grid>

    );
}

//AUTOCOMPLETE SEARCHABLE DROPDOWN (BOTH SINGLE AND MULTISELECT)

const AutocompleteWidget = (props) => {
    const { t } = useTranslation();
    const { schema, onChange, formContext, autofocus } = props;
    const isFullWidth = formContext?.isFullWidth;
    const options = schema.options;
    const translatedOptions = options.map(option => t(`${option}`));
    const widgetStyle = getWidgetStyle(props)
    const { isMultiSelect, disabled } = getWidgetAttributes(props);

    return (
        <Grid container xs={12} sx={getWrapperStyle(isFullWidth)}>
            <Grid item xs={6} >
                <Box sx={getLabelStyle(isFullWidth)}>
                    <Typography variant="h3" component="div">
                        {t(schema.title)}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box sx={getFieldStyle(isFullWidth)}>
                    <Autocomplete
                        freeSolo
                        disablePortal
                        options={translatedOptions}
                        sx={widgetStyle}
                        label=""
                        multiple={isMultiSelect}
                        onChange={(e, val) => {
                            const formDatatoUpdateonChange = {
                                URL: schema.onChange,
                                value: val
                            }
                            onChange(formDatatoUpdateonChange)
                        }
                        }
                        onInputChange={(event, newInputValue) => {
                            const formDatatoUpdateonSearch = {
                                URL: schema.onSearch,
                                value: newInputValue
                            }
                            onChange(formDatatoUpdateonSearch)
                        }}

                        renderInput={(params) => <TextField {...params} />}
                        renderOption={(props, option) => {
                            return <MenuItem {...props} key={option} value={option}>
                                {option}
                            </MenuItem>

                        }}
                        disabled={disabled ?? false}
                        inputRef={disabled ? null : formContext.addFormFieldRef}
                        autoFocus={autofocus}
                    />
                </Box>
            </Grid>
        </Grid>



    );
};
export { Dropdown, AutocompleteWidget, MultipleSelectChip };
