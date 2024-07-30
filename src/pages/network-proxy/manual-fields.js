import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ProxyInfoObject, ProxyMode } from "../../constants";
import { openOnboardKeyboard, closeOnboardKeyboard } from "../../services/keyboard.service";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from '@mui/icons-material/Edit';
import StarRateIcon from '@mui/icons-material/StarRate';
import AuthenticationDialog from "./auth-dialog";

function ManualFields({ proxyDetails, setProxyDetails, setIsFormValid, isProcessing }) {

  const [currentLabel, setCurrentLabel] = useState('')
  const [isHttpChecked, setIsHttpChecked] = useState(false);
  const [isHttpsChecked, setIsHttpsChecked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [checkboxId, setCheckboxId] = useState('');
  const [error, setError] = useState({
    http_proxy: null,
    https_proxy: null,
    http_proxy_username: null,
    http_proxy_password: null,
    https_proxy_username: null,
    https_proxy_password: null,
  });

  const { t } = useTranslation();
  const requiredKeys = ['http_proxy', 'https_proxy'];
  const HttpAuthKeys = ['http_proxy_username', 'http_proxy_password']
  const HttpsAuthKeys = ['https_proxy_username', 'https_proxy_password']
  const ipAddressWithPortPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}$|^[a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,}:[0-9]{1,5})+$/

  const disableCdn = proxyDetails?.proxy_mode === 'disabled' || isProcessing;
  const placeHolderText = t('network_page.enter_value')

  const validFormatIcon = (
    <CheckCircleIcon color="success" sx={{ fontSize: '1.5em', padding: 2 }}
      style={{ display: 'flex', alignItems: 'center', height: 'auto' }}
    />
  );

  const invalidFormatIcon = (
    <ErrorIcon color="error" sx={{ fontSize: '1.5em', padding: 2 }}
      style={{ display: 'flex', alignItems: 'center', height: 'auto', }}
    />
  );

  const styles = {
    textField: {
      width: '50%',
      position: 'relative'
    },
    error: {
      fontSize: '0.5em'
    },
    ipDetails: {
      display: 'flex',
      width: '30%',
      alignItems: 'center',
      paddingRight: 4,
      color: disableCdn ? 'gray' : 'black'
    },
    ipDetailsGrid: {
      display: 'flex',
      flexDirection: 'row',
      height: 'fit-content',
    },
    authLabel: {
      minWidth: '30%',
      color: disableCdn ? 'gray' : 'black'
    },
    circleButtonStyle: {
      width: '0.8em',
      height: '0.8em',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  }

  const handleKeyboardOpen = async () => {
    await openOnboardKeyboard()
  }

  const handleKeyboardClose = async () => {
    await closeOnboardKeyboard()
  }

  const handleFocus = (event) => {
    setCurrentLabel(event.target.name)
  }

  const handleFieldChange = (event) => {
    setProxyDetails({
      ...proxyDetails,
      [currentLabel]: event.target.value
    })
  };

  const handleEditClick = (event, type) => {
    setCheckboxId(type)
    setIsDialogOpen(true)
  }

  const handleClear = (name) => {
    setCurrentLabel(name)
    setProxyDetails({
      ...proxyDetails,
      [name]: ''
    })

    setError({
      ...error,
      [name]: ''
    });
  }

  const handleCheckboxChange = (event) => {
    setProxyDetails({
      ...proxyDetails,
      [event.target.name]: event.target.checked
    })
    if (event.target.name === ProxyInfoObject.IS_HTTP_PROXY_PROTECTED) {
      setIsHttpChecked(event.target.checked)
    } else {
      setIsHttpsChecked(event.target.checked)
    }
  }

  const handleValidation = () => {

    let allValuesAreValidIPs = true;
    let localError = {}

    requiredKeys.forEach(key => {
      if (key != 'https_proxy' && !proxyDetails[key]) {
        localError[key] = null
      }
      else if (!ipAddressWithPortPattern.test(proxyDetails[key])) {
        allValuesAreValidIPs = false;
        localError[key] = `Invalid ${key} format`
      }
      else {
        localError[key] = null
      }
    });

    if (isHttpChecked) {
      HttpAuthKeys.forEach(key => {
        if (!proxyDetails[key]) {
          allValuesAreValidIPs = false;
          localError[key] = `Invalid ${key} format`
        } else {
          localError[key] = null
        }
      });
    } else {
      localError[ProxyInfoObject.HTTP_PROXY_USERNAME] = null;
      localError[ProxyInfoObject.HTTP_PROXY_PASSWORD] = null
    }

    if (isHttpsChecked) {
      HttpsAuthKeys.forEach(key => {
        if (!proxyDetails[key]) {
          allValuesAreValidIPs = false;
          localError[key] = `Invalid ${key} format`
        } else {
          localError[key] = null
        }
      });
    } else {
      localError[ProxyInfoObject.HTTPS_PROXY_USERNAME] = null;
      localError[ProxyInfoObject.HTTPS_PROXY_PASSWORD] = null
    }

    setError({ ...localError })
    return allValuesAreValidIPs;
  };

  useEffect(() => {

    setIsHttpChecked(proxyDetails?.is_http_proxy_protected);
    setIsHttpsChecked(proxyDetails?.is_https_proxy_protected);

    if (proxyDetails?.proxy_mode === ProxyMode.DISABLED) {
      setIsFormValid(true)
    }
    else {
      handleValidation();
    }
  }, [proxyDetails])

  useEffect(() => {
    const isNoError = Object.values(error).every((errorValue) => errorValue === null);
    setIsFormValid(isNoError);
  }, [error])

  return (
    <>
    <Grid container item display={'flex'} fontSize='2.7em' rowGap={10} alignItems="center" justifyContent='flex-start' pb={10}>
      <Grid item xs={6} sx={styles.ipDetailsGrid}>
        <Typography sx={styles.ipDetails}>
          {t('network_page.proxy_server.ip_details.http_proxy')}
        </Typography>
        <TextField id="outlined-basic" variant="outlined"
          name="http_proxy"
          disabled={disableCdn}
          value={proxyDetails?.http_proxy || ''}
          onChange={handleFieldChange}
          onFocus={handleFocus}
          onClick={handleKeyboardOpen}
          onBlur={handleKeyboardClose}
          error={error?.http_proxy ? true : false}
          sx={styles.textField}
          placeholder={placeHolderText}
          InputProps={{
            endAdornment: (proxyDetails?.proxy_mode === 'manual' && !!proxyDetails?.http_proxy) && (
              <IconButton size='large' sx={{ padding: 2 }} onClick={() => handleClear('http_proxy')} disabled={disableCdn}>
                <CancelIcon sx={{ fontSize: '1.5em' }} style={{ display: 'flex', alignItems: 'center', height: 'auto' }} />
              </IconButton>
            ),
          }}
        />
        {
          (proxyDetails?.proxy_mode === 'manual' && !!proxyDetails?.http_proxy) &&
          (
            error?.http_proxy === null ? validFormatIcon : invalidFormatIcon
          )
        }
      </Grid>
      <Grid item xs={6} display={'flex'} alignItems={'center'} justifyContent={'space-around'}>
        <Grid item display={'flex'} alignItems={'center'}>
          <Checkbox
            name="is_http_proxy_protected"
            checked={isHttpChecked}
            onChange={handleCheckboxChange}
            inputProps={{ 'aria-label': 'controlled' }}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 50 } }}
            disabled={disableCdn || !!error?.http_proxy || !proxyDetails?.http_proxy}
          />
          <Typography sx={styles.authLabel}>
            {t('network_page.proxy_server.ip_details.authentication_required')}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            id="http_proxy"
            variant="contained"
            color="primary"
            startIcon={<EditIcon sx={{ fontSize: 'large', pl: '0.2em' }} style={{ fontSize: '0.6em' }} />}
            sx={{ borderRadius: '50%', height: '0.9em', width: '0.9em' }}
            onClick={(e) => handleEditClick(e, 'http_proxy')}
            disabled={disableCdn || !isHttpChecked || !!error?.http_proxy || !proxyDetails?.http_proxy}
          >
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={6} sx={styles.ipDetailsGrid}>
        <Typography sx={styles.ipDetails}>
          {t('network_page.proxy_server.ip_details.https_proxy')}
          <StarRateIcon color={disableCdn ? '' : 'error'} sx={{ marginBottom: 5 }}/>
        </Typography>
        <TextField id="outlined-basic" variant="outlined"
          name="https_proxy"
          disabled={disableCdn}
          value={proxyDetails?.https_proxy || ''}
          onChange={handleFieldChange}
          onFocus={handleFocus}
          onClick={handleKeyboardOpen}
          onBlur={handleKeyboardClose}
          error={error?.https_proxy ? true : false}
          sx={styles.textField}
          placeholder={placeHolderText}
          InputProps={{
            endAdornment: (proxyDetails?.proxy_mode === 'manual' && !!proxyDetails?.https_proxy) && (
              <IconButton size='large' sx={{ padding: 2 }} onClick={() => handleClear('https_proxy')} disabled={disableCdn}>
                <CancelIcon sx={{ fontSize: '1.5em' }} style={{ display: 'flex', alignItems: 'center', height: 'auto' }} />
              </IconButton>
            ),
          }}
        />
        {
          proxyDetails?.proxy_mode === 'manual' &&
          (
            error?.https_proxy === null ? validFormatIcon : invalidFormatIcon
          )
        }
      </Grid>
      <Grid item xs={6} display={'flex'} alignItems={'center'} justifyContent={'space-around'}>
        <Grid item display={'flex'} alignItems={'center'}>
          <Checkbox
            name="is_https_proxy_protected"
            checked={isHttpsChecked}
            onChange={handleCheckboxChange}
            inputProps={{ 'aria-label': 'controlled' }}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 50 } }}
            disabled={disableCdn || !!error?.https_proxy}
          />
          <Typography sx={styles.authLabel}>
            {t('network_page.proxy_server.ip_details.authentication_required')}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            id="https_proxy"
            variant="contained"
            color="primary"
            startIcon={<EditIcon sx={{ fontSize: 'large', pl: '0.2em' }} style={{ fontSize: '0.6em' }} />}
            sx={{ borderRadius: '50%', height: '0.9em', width: '0.9em' }}
            onClick={(e) => handleEditClick(e, 'https_proxy')}
            disabled={disableCdn || !isHttpsChecked || !!error?.https_proxy}
          >
          </Button>
        </Grid>
      </Grid>
    </Grid>
    <AuthenticationDialog 
      open={isDialogOpen}
      setOpen={setIsDialogOpen}
      proxyInfo={proxyDetails}
      setProxyInfo={setProxyDetails}
      proxyType={checkboxId}
    />
    </>
  )
}

export default ManualFields;