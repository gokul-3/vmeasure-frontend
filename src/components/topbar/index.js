import * as React from 'react';
import { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserInfoPopover from './user-info';
import TimeDisplay from '../TimeDisplay';
import DownloadIndicator from '../DownloadInidicator/DownloadIndicator';
import { useSelector } from 'react-redux';
import { Chip } from '@mui/material';
import { Certificates } from '../../constants';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanIndicator } from '../signalIndicator/lan-indicator';
import { getWiFiNetworkInfo } from '../../services/network.service';
import { WifiIndicator } from '../signalIndicator/wifi-indicator';


export default function TopBar({ isAuthLayout }) {

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const networkInfoInterval = React.useRef(null);
  const [wifiSignal, setWifiSignal] = React.useState();
  const location = useLocation();
  const { t } = useTranslation();


  const handleUserIconClick = (event) => {
    if (!isAuthLayout) {
      setOpen(true);
      setAnchorEl(event.currentTarget);
    }
  }


  const handleClose = () => {
    setOpen(false);
  }
  const { metrological_setting } = useSelector((state) => state.settings.metrological);
  const { is_calibration_completed } = useSelector((state) => state.appState);
  const { demo_mode } = useSelector((state) => state.applicationState);
  const { ethernet: ethernetConnState, wifi: wifiConnState } = useSelector((state) => state.networkState);

  React.useEffect(() => {
    handleWiFiSignalRefresh()

    networkInfoInterval.current = setInterval(() => {
      handleWiFiSignalRefresh();

    }, 5000)

    return () => {
      clearInterval(networkInfoInterval.current)
    }
  }, []);

  const handleWiFiSignalRefresh = async () => {
    const info = await getWiFiNetworkInfo();
    setWifiSignal(info);
  }

  return (
    <AppBar position="relative" elevation={1} sx={{ backgroundColor: '#fff', height: '8em' }} >
      <Toolbar>
        <Grid container justifyContent={'space-between'} padding={0}>
          <Grid item paddingY={4}>
            <img src='/images/vMeasure-logo.png' style={{ height: '6em' }} draggable={false} />
          </Grid>
          <Grid item display={'flex'} >
            {
              Boolean(metrological_setting === Certificates.NTEP && location.pathname === "/measurement" && is_calibration_completed) &&
              <Grid item padding={4} margin={'auto'}>
                <Chip
                  color={"primary"}
                  size={"medium"}
                  label={t('measurement_notes.ntep.message')}
                  sx={{ fontSize: '2.7em', width: "auto", height: "5vh", padding: 5 }} />
              </Grid>
            }
            {
              Boolean(demo_mode.is_demo_mode_available && demo_mode.is_demo_mode_activated) &&
              <Grid item margin={'auto'}>
                <Chip
                  color={"warning"}
                  size={"medium"}
                  label={t('demo_mode.top_bar.title',{ count: demo_mode.remaining_demo_measurements })}
                  sx={{ fontSize: '2.7em', width: "auto", height: "5vh", padding: 5 }} />
              </Grid>
            }
          </Grid>
          <Grid item display={'flex'}>
            <Grid item padding={4} margin={'auto'}><DownloadIndicator /></Grid>
            <Grid item padding={4} margin={'auto'}>
              {wifiConnState?.is_enabled && <WifiIndicator isConnected={wifiConnState.is_connected} isInternetAvailable={wifiConnState.has_internet} signalLevel={wifiSignal} />}
            </Grid>
            <Grid item padding={4} margin={'auto'}>
              <LanIndicator isConnected={ethernetConnState.is_connected} isInternetAvailable={ethernetConnState.has_internet} />
            </Grid>
            <Grid item padding={4} margin={'auto'}><TimeDisplay /></Grid>
            <Grid item paddingTop={4} display={isAuthLayout ? 'none' : 'flex'} >
              <AccountCircleIcon onClick={handleUserIconClick} sx={{ fontSize: '6em' }} color='primary' />
              <UserInfoPopover open={open} handleClose={handleClose} anchorEl={anchorEl} />
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
