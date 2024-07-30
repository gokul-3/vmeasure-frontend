import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  Alert,
  IconButton,
  FormControl,
  Select,
  MenuItem
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as proxyServices from '../../services/proxy.service'
import navBarController from "../../redux/reducers/nav-bar-controller"
import { useNavigate } from "react-router-dom";
import { ProxyMode } from "../../constants";
import ManualFields from "./manual-fields";
import AutoConfFields from "./autoconf-fields";

function ProxySettings() {

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [proxyDetails, setProxyDetails] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [result, setResult] = useState(false);

  const handleInteraction = () => {
    setShowMsg(false);
  };

  const handleBackArrowPress = () => {
    navigate(-1);
  }

  const disabledNavBar = () => {
    dispatch(navBarController.actions.disableNavigation())
  }

  const enabledNavBar = () => {
    dispatch(navBarController.actions.enaleNavigation())
  }

  const handleLocalSave = async () => {
    setIsProcessing(true);
      disabledNavBar();
      proxyServices.setProxyServerIP(proxyDetails)
        .then((res) => {
          handleResult(res);
        })
  }

  const handleProxyModeChange = (event) => {
    setProxyDetails({
      ...proxyDetails,
      proxy_mode: event.target.value,
    })
    if (showMsg) {
      setShowMsg(false);
    }
  }

  const handleResult = (result) => {
    setIsProcessing(false)
    enabledNavBar()
    setShowMsg(true);
    setResult(result);
  }

  const loadProxyConfigs = async () => {
    setIsProcessing(true);
    const ipDetails = await proxyServices.getProxyServerIP();
    setIsProcessing(false);
    setProxyDetails(ipDetails?.data);
  }

  useEffect(() => {
    loadProxyConfigs();
  }, [])

  useEffect(() => {
    document.addEventListener('click', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  return (
      <Grid container rowSpacing={4} >
        <Grid container display={'flex'} alignContent={'center'} height={'fit-content'}>
          <Grid item>
            <IconButton size="large" onClick={handleBackArrowPress} disabled={isProcessing}>
              <ArrowBackIcon color="primary" sx={{ fontSize: '3em' }} />
            </IconButton>
          </Grid>
          <Grid item display={'flex'} alignItems={'center'}>
            <Typography variant="h3">
              {t('network_page.proxy_server.proxy_server_configuration')}
            </Typography>
          </Grid>
        </Grid >
        <Grid container item xs={12} >
          <Box variant="outlined" sx={{ width: '100%', height: '40vh' }}>
            <Grid
              container
              item
              xs={12}
              padding={8}
              sx={{ backgroundColor: '#fff', height: '100%' }}
              display={'flex'}
            >
              <Grid item xs={12} pb={5}>
                <Grid container item xs={6} alignItems={'center'} fontSize='2.8em'>
                  <Typography variant="h4" minWidth={'30%'} paddingRight={8}>
                    {t('network_page.proxy_server.proxy_server_mode')}
                  </Typography>
                  <FormControl >
                    <Select
                      value={proxyDetails?.proxy_mode || 'disabled'}
                      onChange={handleProxyModeChange}
                      sx={{ fontSize: '0.8em', width: '10em', paddingX: '0.5em' }}
                      disabled={isProcessing}
                    >
                      <MenuItem value={'disabled'}>{t('network_page.proxy_server.mode.disabled')}</MenuItem>
                      <MenuItem value={'manual'}>{t('network_page.proxy_server.mode.manual')}</MenuItem>
                      <MenuItem value={'auto'}>{t('network_page.proxy_server.mode.automatic')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {
                (proxyDetails?.proxy_mode === ProxyMode.MANUAL || proxyDetails?.proxy_mode === ProxyMode.DISABLED) && 

                  <ManualFields
                    proxyDetails={proxyDetails}
                    setProxyDetails={setProxyDetails}
                    setIsFormValid={setIsFormValid}
                    isProcessing={isProcessing}
                  />
              }
              {
                proxyDetails?.proxy_mode === ProxyMode.AUTO &&

                <AutoConfFields 
                  proxyInfo={proxyDetails}
                  setProxyInfo={setProxyDetails}
                  setIsValid={setIsFormValid}
                  isProcessing={isProcessing}
                />
              }

            </Grid>
          </Box>
        </Grid >
        <Grid container xs={12} item justifyContent={'space-between'} height='10%'>
          <Grid item xs={10}>
            {
              showMsg &&
              <Alert
                severity={(result?.status && !result?.data) ? "success" : "warning"}
                variant="standard"
                sx={{ fontSize: '3em', width: 'fit-content' }}
              >
                {result?.status ? (result?.data ? (t('network_page.proxy_server.success_msg') + ' ' + t(`network_page.proxy_server.error_msg.${result?.data?.msg}`)): t('network_page.proxy_server.success_msg')) : (
                  result?.error ? (t('network_page.proxy_server.failure_msg') + ' - ' +  t(`network_page.proxy_server.error_msg.${result?.error?.msg}`)) : t('network_page.proxy_server.failure_msg'))}
              </Alert>
            }
          </Grid>
          <Grid item xs={2} display="flex" justifyContent="flex-end" height="6.5em">
            <Button
              variant='contained'
              onClick={handleLocalSave}
              sx={{ width: '10em', }}
              disabled={isProcessing || !isFormValid}
            >
              <Typography sx={{ fontSize: '1.2em' }}>{t('common.button.save')}</Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid >
  )
}

export default ProxySettings;