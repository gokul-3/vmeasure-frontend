import React, {useState, useEffect} from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Grid,
    Typography,
    TextField,
    IconButton,

} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "react-i18next";
import { openOnboardKeyboard, closeOnboardKeyboard } from "../../services/keyboard.service";
import PopupButton from "../../components/button/popup-button";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthenticationDialog = ({ open, setOpen, proxyInfo, proxyType, setProxyInfo }) => {

    const { t } = useTranslation();
    const placeHolderText = t('network_page.enter_value');

    const selectStyles = {
        textField: {
            width: '50%',
        },
        ipDetails: {
            display: 'flex',
            width: '30%',
            alignItems: 'center',
        },
        ipDetailsGrid: {
            display: 'flex',
            flexDirection: 'row',
            height: 'fit-content',
            justifyContent: 'space-evenly'
        }
    }

    const [showPassword, setShowPassword] = useState(false);
    const [authInfo, setAuthInfo] = useState({ username: "", password: ""})
    const [isFormValid, setIsFormValid] = useState(false)

    const handleClose = (event, status = false) => {
        if(status) {
            setProxyInfo( {
                ...proxyInfo,
                [`${proxyType}_username`]: authInfo?.username,
                [`${proxyType}_password`]: authInfo?.password
            })
        }
        setOpen(false)
        setShowPassword(false)
    }

    const handleChange = (event) => {
        setAuthInfo({
            ...authInfo,
            [event.target.name]: event.target.value
        })
    }

    const handleClear = (name) => {
        setAuthInfo({
            ...authInfo,
            [name]: ''
        })
    }

    const handleKeyboardOpen = async () => {
        await openOnboardKeyboard()
    }

    const handleKeyboardClose = async () => {
        await closeOnboardKeyboard()
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const validateAuthInfo = () => {
        let isValid = true;
        Object.keys(authInfo).forEach((key) => {
            if (authInfo[key]<=0) {
                isValid = false
            }
        })
        setIsFormValid(isValid)
    }

    useEffect(() => {
        setAuthInfo({
            username: proxyInfo[`${proxyType}_username`],
            password: proxyInfo[`${proxyType}_password`]
        })
    },[open])

    useEffect(() => {
        validateAuthInfo();
    }, [authInfo])

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth='md'
        >
            <DialogTitle id="alert-dialog-title" sx={{paddingBottom:'1em', marginX: 'auto'}}>
                {t('network_page.proxy_server.authentication_dialog.title')}
            </DialogTitle>
            <DialogContent id="alert-dialog-description" sx={{ paddingBottom: '3em' }}>
                <Grid container display={'flex'} fontSize='2.7em' rowGap={5} alignItems="center">
                    <Grid item xs={12} sx={selectStyles.ipDetailsGrid}>
                        <Typography variant={'h4'} sx={selectStyles.ipDetails}>
                            {t('network_page.proxy_server.ip_details.username')}
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined"
                            name="username"
                            value={authInfo?.username || ''}
                            onChange={handleChange}
                            onClick={handleKeyboardOpen}
                            onBlur={handleKeyboardClose}
                            error={!authInfo?.username}
                            sx={selectStyles.textField}
                            placeholder={placeHolderText}
                            InputProps={{
                                endAdornment: (
                                    <IconButton size='large' sx={{ padding: 2 }} onClick={() => handleClear('username')}>
                                        <CancelIcon sx={{ fontSize: '1.5em' }} style={{ display: 'flex', alignItems: 'center', height: 'auto' }} />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sx={selectStyles.ipDetailsGrid}>
                        <Typography variant={'h4'} sx={selectStyles.ipDetails}>
                            {t('network_page.proxy_server.ip_details.password')}
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined"
                            name="password"
                            value={authInfo?.password || ''}
                            onChange={handleChange}
                            onClick={handleKeyboardOpen}
                            onBlur={handleKeyboardClose}
                            error={!authInfo?.password}
                            sx={selectStyles.textField}
                            placeholder={placeHolderText}
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <IconButton size='large' sx={{ padding: 2 }} onClick={handleClickShowPassword}>
                                        {showPassword ? <VisibilityOff sx={{ fontSize: '1.5em' }} /> : <Visibility sx={{ fontSize: '1.5em' }} />}
                                    </IconButton>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{paddingY:'1em'}}>
                {
                    <PopupButton
                        buttonVariant='outlined'
                        onClick={handleClose}
                        text={t('common.button.cancel')}
                    />
                }

                <PopupButton
                    onClick={(e) => handleClose(e, true)}
                    text={t('common.button.ok')}
                    mr={'0.2em'}
                    disable={!isFormValid}
                />
            </DialogActions>
        </Dialog>
    )
}

export default AuthenticationDialog;