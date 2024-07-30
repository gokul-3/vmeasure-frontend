
import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import LanIcon from '@mui/icons-material/Lan';
import WifiIcon from '@mui/icons-material/Wifi';
import { PageTitle } from "../../components/custom-text-message/page-title";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as networkService from "../../services/network.service";
import { NetworkDataPair } from "./component/network-data";
import PopupButton from "../../components/button/popup-button";

function NetworkPage() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  const { success: isAuthSuccess, systemInfo } = useSelector((state) => state.userAuth);

  // const [macDetails, setMacDetails] = useState()
  const [ethernetData, setEthernetData] = useState({ mac: null, ip: null });
  const [wifiData, setWifiData] = useState({ mac: null, ip: null });
  // const [isLoadingMacDetails, setIsLoadingMacDetails] = useState(true)
  const [isLoadingEthernetIP, setIsLoadingEthernetIP] = useState(true)
  const [isLoadingWifiIP, setIsLoadingWifiIP] = useState(true)

  const handleNetwokTest = () => {
    navigate('/menu/network/network-testing')
  }
  const handleNtpServer = () => {
    navigate('/menu/network/ntp-server')
  }

  const handleProxyServer = () => {
    navigate('/menu/network/proxy-server')
  }
  const handleEthernet = () => {

    if (isAuthSuccess) {
      navigate('/menu/network/ethernet')
    } else {
      navigate('/network/ethernet')
    }
  }

  const handleWifi = () => {

    if (isAuthSuccess) {
      navigate('/menu/network/wifi')
    } else {
      navigate('/network/wifi')
    }
  }

  useEffect(() => {
    loadNetworkSettings()
  }, [])

  const loadNetworkSettings = async () => {
    try {

      networkService.getWifiIPDetails({ isRefetch: false })
      .then((result) => {
        setWifiData(result.data);
        setIsLoadingWifiIP(false)
      });

      networkService.getEthernetIPDetails({ isRefetch: false })
        .then((result) => {
          console.error('result.data : ',JSON.stringify(result.data))
          setEthernetData(result.data);
          setIsLoadingEthernetIP(false)
        });

      // networkService.getWifiNetwork()

    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  return (
    <Grid container rowSpacing={5} height={'100%'}>
      <Grid container item xs={12} maxHeight={'10%'} display={'flex'} justifyContent={'space-between'}>
        <Grid item>
          <PageTitle
            title={t('network_page.network_settings_page_title')}
          />
        </Grid>
        <Grid item display={'flex'} justifyContent={'end'} alignItems={'center'} sx={{ width: '50%' }}>
          <PopupButton
            text={t('network_page.network_main_page.ntp')}
            onClick={handleNtpServer}
            height={'80%'}
          />
          <PopupButton
            text={t('network_page.network_main_page.proxy')}
            onClick={handleProxyServer}
            height={'80%'}
          />
          <PopupButton
            text={t('network_page.network_main_page.test')}
            onClick={handleNetwokTest}
            height={'80%'}
            mr={'0em'}
          />
        </Grid>
      </Grid>

      <Grid container item xs={12} height={'92%'}>
        <Paper variant="outlined" sx={{ width: '100%', height: '36%' }}>
          <Grid
            container
            item
            xs={12}
            height={'100%'}
            rowGap={5}
            padding={5}
            display={'flex'}
          >
            <Grid container item xs={12} display={'flex'}>
              <Grid container item xs={6}>
                <NetworkDataPair
                  title={'network_page.network_main_page.serial_number'}
                  isLoading={false}
                  value={systemInfo?.serial_number}
                  isRefresh={false}
                />
              </Grid>
            </Grid>

            <Grid container item xs={12} display={'flex'} justifyContent={'space-between'}>
              <Grid container item xs={6} >
                <NetworkDataPair
                  title={'network_page.network_main_page.ethernet_mac_address'}
                  isLoading={isLoadingEthernetIP}
                  value={ethernetData.mac}
                  isRefresh={false}
                />
              </Grid>

              <Grid container item xs={6} justifyContent={'right'}>
                <NetworkDataPair
                  title={'network_page.network_main_page.ethernet_ip_address'}
                  isLoading={isLoadingEthernetIP}
                  value={ethernetData.ip}
                  isRefresh={false}
                />
              </Grid>
            </Grid>

            <Grid container item xs={12} display={'flex'} justifyContent={'space-between'}>
              <Grid container item xs={6}>
                <NetworkDataPair
                  title={'network_page.network_main_page.wifi_mac_address'}
                  isLoading={isLoadingWifiIP}
                  value={wifiData.mac}
                  isRefresh={false}
                />
              </Grid>

              <Grid container item xs={6} justifyContent={'right'}>
                <NetworkDataPair
                  title={'network_page.network_main_page.wifi_ip_address'}
                  isLoading={isLoadingWifiIP}
                  value={wifiData.ip}
                  isRefresh={false}
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <Paper variant="outlined" sx={{ width: '100%', height: '56%' }}>
          <Grid
            container
            item
            xs={12}
            height={'100%'}
            rowGap={5}
            padding={5}
          >
            <Grid item xs={12} height={'20%'} display={'flex'}>
              <Typography variant="h3" align={'center'} margin={'auto'}>
                {t('network_page.network_main_page.please_choose_the_network_settings')}
              </Typography>
            </Grid>
            <Grid container item height={'80%'}>
              <Grid container item xs={6} display={'flex'} justifyContent={'center'} alignItems={'center'} >
                <IconButton size="large" onClick={handleEthernet} sx={{ flexDirection: 'column', width: '30%', height: '55%' }}>
                  <LanIcon color="primary" sx={{ fontSize: '5em' }} />
                  <Typography mt={2} variant="h3" color='black'>
                    {t('network_page.ethernet')}
                  </Typography>
                </IconButton>
              </Grid>
              <Grid container item xs={6} display={'flex'} justifyContent={'center'} alignItems={'center'} >
                <IconButton size="large" onClick={handleWifi} sx={{ flexDirection: 'column', width: '30%', height: '55%' }}>
                  <WifiIcon color="primary" sx={{ fontSize: '5em', }} />
                  <Grid container item direction={'row'} display={'flex'} justifyContent={'center'}>
                    <Typography mt={2} variant="h3" color='black'>
                      {t('network_page.wi-fi')}
                    </Typography>
                    <Typography mt={2} pl={2} sx={{ fontWeight: 'bold', color: "red" }}>
                      {t('network_page.network_main_page.beta')}
                    </Typography>
                  </Grid>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid >
    </Grid >
  )
}

export default NetworkPage;
