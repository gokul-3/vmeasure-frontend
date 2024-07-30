import React, { useEffect, useState } from "react";
import {
    Grid,
    Typography,
    TextField,
    IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { openOnboardKeyboard, closeOnboardKeyboard } from "../../services/keyboard.service";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarRateIcon from '@mui/icons-material/StarRate';

function AutoConfFields({ proxyInfo, setProxyInfo, setIsValid, isProcessing }) {

    const{ t } = useTranslation();
    const [errorValue, setErrorValue] = useState(null);

    const placeHolderText = t('network_page.enter_value')

    const validFormatIcon = (
        <CheckCircleIcon color="success" sx={{ fontSize: '4em', padding: 2 }}
            style={{ display: 'flex', alignItems: 'center', height: 'auto' }}
        />
    );

    const invalidFormatIcon = (
        <ErrorIcon color="error" sx={{ fontSize: '4em', padding: 2 }}
            style={{ display: 'flex', alignItems: 'center', height: 'auto', }}
        />
    );

    const styles = {
        ipDetails: {
            display: 'flex',
            paddingRight: 10,
            fontSize: '2.3em',
          },
          ipDetailsGrid: {
            display: 'flex',
            flexDirection: 'row',
            height: 'fit-content',
            alignItems: 'center'
          }
    }

    const handleKeyboardOpen = async () => {
        await openOnboardKeyboard()
    }

    const handleKeyboardClose = async () => {
        await closeOnboardKeyboard()
    }

    const handleFieldChange = (event) => {
        setProxyInfo({
            ...proxyInfo,
            [event.target.name]: event.target.value
        })
    };

    const handleClear = (name) => {
        setProxyInfo({
            ...proxyInfo,
            [name]: ''
        })
    }

    const validateUrl = (url) => {
        const regex = /^(https?:\/\/)(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[a-zA-Z0-9._'\-=$]+)*$|^(https?:\/\/)[a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})(?:\/[a-zA-Z0-9._'\-=$]+)*$/;
        const result = regex.test(url);
        return result;
    }

    useEffect(() => {
        const valid = validateUrl( proxyInfo?.auto_configuration_url);
        setErrorValue(valid ? null : "Invalid URL")
        setIsValid(valid);
    }, [proxyInfo])

    return (
            <Grid item xs={12} sx={styles.ipDetailsGrid}>
                <Typography sx={styles.ipDetails}>
                    {t('network_page.proxy_server.ip_details.pac_file_url')}
                    <StarRateIcon color='error' sx={{ marginBottom: 5 }}/>
                </Typography>
                <TextField id="outlined-basic" variant="outlined"
                    name="auto_configuration_url"
                    value={proxyInfo?.auto_configuration_url}
                    onChange={handleFieldChange}
                    onClick={handleKeyboardOpen}
                    onBlur={handleKeyboardClose}
                    error={errorValue ? true : false}
                    sx={{width: '80%', fontSize: '3em', position:'relative'}}
                    placeholder={placeHolderText}
                    InputProps={{
                        endAdornment: (proxyInfo?.proxy_mode === 'auto' && proxyInfo?.auto_configuration_url) && (
                            <IconButton size='large' sx={{ padding: 2 }} onClick={() => handleClear('auto_configuration_url')} disabled={isProcessing}>
                                <CancelIcon sx={{ fontSize: '1.5em' }} style={{ display: 'flex', alignItems: 'center', height: 'auto' }} />
                            </IconButton>
                        ),
                    }}
                    disabled={isProcessing}
                    helperText={t('network_page.proxy_server.pac_file_helper_text')}
                    FormHelperTextProps={{
                        sx: {
                            fontSize: '0.6em',
                            position: 'absolute',
                            top: '100%'
                        }
                    }}
                />
                {
                    proxyInfo?.proxy_mode === 'auto' &&
                    (
                        errorValue === null ? validFormatIcon : invalidFormatIcon
                    )
                }
            </Grid>
    )
}

export default AutoConfFields;