import React, { useEffect, useState } from "react";
import {
  Grid,
  useTheme,
  Typography,
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Alert,
  IconButton,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from '@mui/icons-material/Error';

import EthernetKeyboard from "../../components/keyboards/ethernet-keyboard";
import navBarController from "../../redux/reducers/nav-bar-controller"

function CommonIPSettings({
  settings,
  isEditMode,
  setIsEditMode,
  result,
  connected,
  handleSave,
  ipDetails,
  setIPDetails,
  errorMsg,
  showMsg,
  setShowMsg,
  networkType
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [error, setError] = useState('')
  // to get the field name
  const [currentLabel, setCurrentLabel] = useState('')
  const [processing, setProcessing] = useState(false)
  const requiredKeys = ['static_ip', 'subnet', 'preferred_dns', 'alternate_dns', 'gateway'];

  const [isFormValid, setIsFormValid] = useState(true)

  const ipSegmentPattern = "(25[0-5]|2[0-4][0-9]|[01]?[0-9]{1,2})";
  const ipAddressPattern = new RegExp(`^${ipSegmentPattern}\\.${ipSegmentPattern}\\.${ipSegmentPattern}\\.${ipSegmentPattern}$`);

  const disableCdn = !connected || ipDetails?.mode === 'dhcp'

  const selectStyles = {
    textField: {
      width: '50%',
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
      height: 'fit-content'
    },
  }


  const validFormatIcon = (
    <CheckCircleIcon color="success" sx={{ fontSize: '1.5em', padding: 2 }}
      style={{ display: 'flex', alignItems: 'center', height: 'auto' }}
    />
  );

  const invalidFormatIcon = (
    <ErrorIcon color="error" sx={{ fontSize: '1.5em', padding: 2 }}
      style={{ display: 'flex', alignItems: 'center', height: 'auto', }}
    />
  )

  const handleToggleChange = (event) => {
    if (showMsg) {
      setShowMsg(false);
    }
    if (event.target.value === 'dhcp') {
      setIsFormValid(true)
    } else {
      initialIPValidation(ipDetails)
    }
    setIPDetails({
      ...ipDetails,
      mode: event.target.value,
    })
  }

  const createFieldSchema = (label) => {
    return Yup.string()
      .required(`${label} is required`)
      .matches(
        ipAddressPattern, `Invalid ${label} format`,
      );
  };

  const validationSchema = Yup.object().shape({
    static_ip: createFieldSchema('IP address'),
    subnet: createFieldSchema('Subnet'),
    preferred_dns: createFieldSchema('Preferred DNS'),
    alternate_dns: createFieldSchema('Alternate DNS'),
    gateway: createFieldSchema('Gateway'),
  });

  const handleFieldChange = (value) => {
    if (ipDetails.mode === 'static') {
      let updatedErrors = { ...error }; // Create a copy of the current error state
      validationSchema
        .validateAt(currentLabel, { [currentLabel]: value })
        .then(() => {
          updatedErrors = { ...updatedErrors, [currentLabel]: null };
          setError(updatedErrors);
          const isFormValid = Object.values(updatedErrors).every((errorValue) => errorValue === null);
          setIsFormValid(isFormValid);
        })
        .catch((error) => {
          updatedErrors = { ...updatedErrors, [currentLabel]: error.message };
          setError(updatedErrors);
          setIsFormValid(false)
        })
    }
  };


  const handleFocus = (event) => {
    setCurrentLabel(event.target.name)
  }

  const handleChange = (event) => {
    setIPDetails({
      ...ipDetails,
      static_ip_details: {
        ...ipDetails.static_ip_details,
        [currentLabel]: event.target.value,
      },
    })
    handleFieldChange(event.target.value);
  };

  const handleClear = (name) => {
    setCurrentLabel(name)
    setIPDetails({
      ...ipDetails,
      static_ip_details: {
        ...ipDetails.static_ip_details,
        [name]: ''
      },
    });
    setError({
      ...error,
      [name]: ''
    });
    setIsFormValid(false)
  }


  //handle keyboard onKeyPress
  const handleKeyboardPress = (btn) => {
    if (btn === "{enter}") {
      setIsEditMode(false);
    } else if (btn === "{bksp}") {
      handleBackspace();
    } else {
      handleCharacterInput(btn);
    }
  };

  const handleBackspace = () => {
    let newValue;
    newValue = ipDetails?.static_ip_details?.[currentLabel];
    if (newValue) {
      newValue = newValue.slice(0, -1);
      setIPDetails({
        ...ipDetails,
        static_ip_details: {
          ...ipDetails.static_ip_details,
          [currentLabel]: newValue,
        },
      });
      handleFieldChange(newValue);
    }
  };


  const handleCharacterInput = (btn) => {
    let newValue;
    newValue = ipDetails?.static_ip_details?.[currentLabel];
    setIPDetails({
      ...ipDetails,
      static_ip_details: {
        ...ipDetails.static_ip_details,
        [currentLabel]: (newValue || '') + btn,
      },
    });
    handleFieldChange(newValue + btn);
  };

  const disabledNavBar = () => {
    dispatch(navBarController.actions.disableNavigation())
  }

  const enabledNavBar = () => {
    dispatch(navBarController.actions.enaleNavigation())
  }

  const handleLocalSave = async () => {
    try {
      setProcessing(true)
      disabledNavBar()
      await handleSave()
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setProcessing(false)
      enabledNavBar()
    }
  }
  const placeHolderText = t('network_page.enter_value')
  const handleInteraction = () => {
    setShowMsg(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  const defaultErrors = {
    static_ip: null,
    subnet: null,
    preferred_dns: null,
    alternate_dns: null,
    gateway: null,
  };

  const handleValidation = (settings) => {
    let allValuesHaveLength = false;
    let allValuesAreValidIPs = true;

    const ipSegmentPattern = "(25[0-5]|2[0-4][0-9]|[01]?[0-9]{1,2})";
    const ipAddressPattern = new RegExp(`^${ipSegmentPattern}\\.${ipSegmentPattern}\\.${ipSegmentPattern}\\.${ipSegmentPattern}$`);

    if (settings?.static_ip_details) {
      allValuesHaveLength = requiredKeys.every(key =>
        settings?.static_ip_details.hasOwnProperty(key) && settings?.static_ip_details[key]?.length > 0
      );

      if (allValuesHaveLength) {
        requiredKeys.forEach(key => {
          if (!ipAddressPattern.test(settings.static_ip_details[key])) {
            allValuesAreValidIPs = false;
          } else {
            setError({
              ...error,
              [key]: null,
            });
          }
        });
      }
    }
    return allValuesHaveLength && allValuesAreValidIPs;
  };
  //for validation ip settings data from ipc Call
  const initialIPValidation = (settings) => {
    const initValidation = handleValidation(settings)
    setIsFormValid(handleValidation(settings))

    if (initValidation) {
      setError(defaultErrors)
    }
  }
  useEffect(() => {
    setIPDetails(settings)
    //first time validation
    setError({
      static_ip: '',
      subnet: '',
      preferred_dns: '',
      alternate_dns: '',
      gateway: ''
    })
    if (settings.mode === 'static') {
      initialIPValidation(settings)
    }
  }, [])

  return (
    <>
      <Grid container rowSpacing={3} >
        <Grid container display={'flex'} alignContent={'center'} height={'fit-content'}>
          <Grid item>
            <IconButton size="large" onClick={() => setIsEditMode(false)} disabled={processing}>
              <ArrowBackIcon color="primary" sx={{ fontSize: '3em' }} />
            </IconButton>
          </Grid>
          <Grid item display={'flex'} alignItems={'center'}>
            <Typography variant="h3">
              {t('network_page.edit_ip_configuration', { networkType: networkType })}
            </Typography>
          </Grid>
        </Grid >
        <Grid container item xs={12} >
          <Box variant="outlined" sx={{ width: '100%', height: 'fit-content' }}>
            <Grid
              container
              item
              xs={12}
              padding={5}
              sx={{ backgroundColor: '#fff', height: 'auto' }}
              gap={2}
              display={'flex'}
            >
              <Grid container item xs={6} alignItems={'center'} fontSize='2.8em' pb={3}>
                <Typography variant="h4" minWidth={'30%'} paddingRight = {3}>
                  {t('network_page.ip_details.ip_settings')}
                </Typography>
                <ToggleButtonGroup
                  value={ipDetails?.mode}
                  exclusive
                  onChange={handleToggleChange}
                  disabled={!connected}
                  aria-label="Platform"
                >
                  <ToggleButton sx={{ paddingX: 10, fontSize: '0.8em' }} value="dhcp">
                    {t('network_page.ip_details.dhcp')}
                  </ToggleButton>
                  <ToggleButton value="static" sx={{ fontSize: '0.8em' }}>
                    {t('network_page.ip_details.static')}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid container item rowGap={5} display={'flex'} alignItems="center" fontSize='2.7em' justifyContent='flex-start'>
                <Grid item xs={6} sx={selectStyles.ipDetailsGrid}>
                  <Typography sx={selectStyles.ipDetails}>
                    {t('network_page.ip_details.ip_address')}
                  </Typography>
                  <TextField id="outlined-basic" variant="outlined"
                    name="static_ip"
                    disabled={disableCdn}
                    value={ipDetails?.static_ip_details?.static_ip || ''}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    error={error?.static_ip}
                    sx={selectStyles.textField}
                    placeholder={placeHolderText}
                    InputProps={{
                      endAdornment: ipDetails?.mode === 'static' && (
                        <IconButton size='large' sx={{ padding: 2 }} onClick={() => handleClear('static_ip')}>
                          <CancelIcon sx={{ fontSize: '1.5em' }} style={{ display: 'flex', alignItems: 'center', height: 'auto' }} />
                        </IconButton>
                      ),
                    }}
                  />
                  {
                    ipDetails?.mode === 'static' &&
                    (
                      error?.static_ip === null ? validFormatIcon : invalidFormatIcon
                    )
                  }
                </Grid>
                <Grid item xs={6} sx={selectStyles.ipDetailsGrid}>
                  <Typography sx={selectStyles.ipDetails}>
                    {t('network_page.ip_details.subnet')}
                  </Typography>
                  <TextField id="outlined-basic" variant="outlined"
                    name="subnet"
                    disabled={disableCdn}
                    value={ipDetails?.static_ip_details?.subnet || ''}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    error={error?.subnet}
                    sx={selectStyles.textField}
                    placeholder={placeHolderText}
                    InputProps={{
                      endAdornment: ipDetails?.mode === 'static' && (
                        <IconButton size='large' sx={{ padding: 2 }} onClick={() => handleClear('subnet')}>
                          <CancelIcon sx={{ fontSize: '1.5em' }} style={{ display: 'flex', alignItems: 'center', height: 'auto' }} />
                        </IconButton>
                      ),
                    }}
                  />
                  {
                    ipDetails?.mode === 'static' &&
                    (
                      error?.subnet === null ? validFormatIcon : invalidFormatIcon
                    )
                  }
                </Grid>
                <Grid item xs={6} sx={selectStyles.ipDetailsGrid}>
                  <Typography sx={selectStyles.ipDetails}>
                    {t('network_page.ip_details.gateway')}
                  </Typography>
                  <TextField id="outlined-basic" variant="outlined"
                    name="gateway"
                    disabled={disableCdn}
                    value={ipDetails?.static_ip_details?.gateway || ''}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    error={error?.gateway}
                    sx={selectStyles.textField}
                    placeholder={placeHolderText}
                    InputProps={{
                      endAdornment: ipDetails?.mode === 'static' && (
                        <IconButton size='large' sx={{ padding: 2 }} onClick={() => handleClear('gateway')}>
                          <CancelIcon sx={{ fontSize: '1.5em' }} style={{ display: 'flex', alignItems: 'center', height: 'auto' }} />
                        </IconButton>
                      ),
                    }}
                  />
                  {
                    ipDetails?.mode === 'static' &&
                    (
                      error?.gateway === null ? validFormatIcon : invalidFormatIcon
                    )
                  }
                </Grid>
                <Grid item xs={6} sx={selectStyles.ipDetailsGrid}>
                  <Typography sx={selectStyles.ipDetails}>
                    {t('network_page.ip_details.preferred_dns')}
                  </Typography>
                  <TextField id="outlined-basic" variant="outlined"
                    name="preferred_dns"
                    disabled={disableCdn}
                    value={ipDetails?.static_ip_details?.preferred_dns || ''}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    error={error?.preferred_dns}
                    sx={selectStyles.textField}
                    placeholder={placeHolderText}
                    InputProps={{
                      endAdornment: ipDetails?.mode === 'static' && (
                        <IconButton size='large' sx={{ padding: 2 }} onClick={() => handleClear('preferred_dns')}>
                          <CancelIcon sx={{ fontSize: '1.5em' }} style={{ display: 'flex', alignItems: 'center', height: 'auto' }} />
                        </IconButton>
                      ),
                    }}
                  />
                  {
                    ipDetails?.mode === 'static' &&
                    (
                      error?.preferred_dns === null ? validFormatIcon : invalidFormatIcon
                    )
                  }
                </Grid>
                <Grid item xs={6} pb={0} sx={selectStyles.ipDetailsGrid}>
                  <Typography sx={selectStyles.ipDetails}>
                    {t('network_page.ip_details.alternate_dns')}
                  </Typography>
                  <TextField id="outlined-basic" variant="outlined"
                    disabled={disableCdn}
                    name="alternate_dns"
                    value={ipDetails?.static_ip_details?.alternate_dns || ''}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    error={error?.alternate_dns}
                    sx={selectStyles.textField}
                    placeholder={placeHolderText}
                    InputProps={{
                      endAdornment: ipDetails?.mode === 'static' && (
                        <IconButton size='large' sx={{ padding: 2 }} onClick={() => handleClear('alternate_dns')}>
                          <CancelIcon sx={{ fontSize: '1.5em' }} style={{ display: 'flex', alignItems: 'center', height: 'auto' }} />
                        </IconButton>
                      ),
                    }}
                  />
                  {
                    ipDetails?.mode === 'static' &&
                    (
                      error?.alternate_dns === null ? validFormatIcon : invalidFormatIcon
                    )
                  }
                </Grid>
              </Grid>

              <Grid container item justifyContent={'space-between'} height='10%'>
                <Grid item xs={10}>
                  {
                    showMsg &&
                    <Alert
                      severity={result ? "success" : "warning"}
                      variant="standard"
                      sx={{ fontSize: '3em', width: 'fit-content' }}
                    >
                      {t(result ? 'common.message.data_saved_successfully' : `network_page.network_error.${errorMsg?.message}`)}
                    </Alert>
                  }
                </Grid>
                <Grid item xs={2} display="flex" justifyContent="flex-end" height="6.5em">
                  <Button
                    variant='contained'
                    onClick={handleLocalSave}
                    sx={{ width: '10em', }}
                    disabled={processing || !(connected) || !isFormValid}
                  >
                    <Typography sx={{ fontSize: '1.2em' }}>{t('common.button.save')}</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid >
        <Grid container item display={'flex'} alignItems='center'>
          {(isEditMode && ipDetails?.mode === 'static') &&
            <EthernetKeyboard
              handleKeyPress={handleKeyboardPress}
            />
          }
        </Grid>
      </Grid >
    </>
  )
}

export default CommonIPSettings;