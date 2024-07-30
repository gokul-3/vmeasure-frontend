import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import * as networkService from '../../services/network.service'
import CommonIPSettings from "./common-ip-settings";
import { NetworkDialog } from "./network-dialog";
import WiFiEnterpriseDialog from "./enterprise-dialog";
import PasswordDialog from "./password-dialog";
import { useKeyboard } from "../../hooks/useKeyboard";
import { NetworkEnterpriseData, PermissionModules, NetworkError } from "../../constants";
import { NetworkMode, NetworkType, NetworkErrorCode } from "../../constants";
import LoadingDialog from "../../components/dialogs/loading-dialog";
import AlreadyConnectedNetwork from "./already-network-dialog";
import { PageTitle } from "../../components/custom-text-message/page-title";
import { SettingsInfoMessage } from "../../components/custom-text-message/settings-info-msg";
import { StaticIPSettings } from "./component/static-ip-settings";
import { NetworkDataPair } from "./component/network-data";
import ConnectLoadingDialog from "./component/connection-loading";
import { useDispatch, useSelector } from "react-redux";
import networkState from "../../redux/reducers/network-state";

function Wifi() {
  const { t } = useTranslation();

  const [showKeyboard, hideKeyboard, changeInput] = useKeyboard()

  const { is_enabled } = useSelector((state) => state.networkState.wifi);

  const [showMsg, setShowMsg] = useState(false);
  const [error, setError] = useState()
  const [result, setResult] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [wifiSettings, setWifiSettings] = useState('')
  const [wifiNetworks, setWifiNetworks] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [showNetworks, setShowNetworks] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showEnterprise, setShowEnterprise] = useState(false)
  const [showAlreadyConnected, setShowAlreadyConnected] = useState(false)

  const [focusingNetwork, setFocusingNetwork] = useState({ ssid: '', password: '', });
  const [connectLoading, setConnectLoading] = useState(false) //for connecting... btn
  const [openNetworkLoading, setOpenNetworkLoading] = useState(false)
  const [isWifiOn, setIsWifiOn] = useState(is_enabled)
  const [processingWifiIP, setProcessingWifiIP] = useState(false)
  const [isSSIDLoad, setIsSSIDLoad] = useState(false)
  const [forgetConnectionLoading, setForgetConnectionLoading] = useState(false)
  const [ipDetails, setIPDetails] = useState('')
  const [refreshLoading, setRefreshLoading] = useState(false)
  const [focusedForgetLoading, setFocusedForgetLoading] = useState(false)
  const [currentSSID, setCurrentSSID] = useState('')
  const [isWifiConnected, setIsWifiConnected] = useState(false)
  const [isIpDetailsFetched, setIsIpDetailsFetched] = useState(false)
  // to get the field name
  const [isEditMode, setIsEditMode] = useState(false)
  const [isNetworkConnectionFail, setIsNetworkConnectionFail] = useState(false)
  const [isNetworkNotSupported, setIsNetworkNotSupported] = useState(false);
  const [wifiIP, setWifiIP] = useState(null);

  const defaultEnterpriseData = {
    wifiSecurity: NetworkEnterpriseData.wifiSecurityList[0],
    authentication: NetworkEnterpriseData.authenticationList[0],
    anonymousIdentity: '',
    domain: '',
    caCertificate: '',
    caCertificatePassword: '',
    peapVersion: NetworkEnterpriseData.peapVersionList[0],
    innerAuthentication: NetworkEnterpriseData.innerAuthenticationList[0],
    username: '',
    password: ''
  }

  const [enterpriseData, setEnterpriseData] = useState(defaultEnterpriseData);

  const dispatch = useDispatch();

  const disableShowMsg = () => {
    if (showMsg) {
      setShowMsg(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSSIDLoad(true)
      disableShowMsg()
      let networkConfig = {
        is_wifi_on: isWifiOn,
        mode: ipDetails.mode,
        ip_details: null
      }
      if (ipDetails?.mode === NetworkMode.STATIC) {
        networkConfig.ip_details = {
          static_ip: ipDetails.static_ip_details.static_ip,
          subnet: ipDetails.static_ip_details.subnet,
          gateway: ipDetails.static_ip_details.gateway,
          preferred_dns: ipDetails.static_ip_details.preferred_dns,
          alternate_dns: ipDetails.static_ip_details.alternate_dns
        }
      }
      const result = await networkService.setWifiConfigs(networkConfig)
      setResult(result.status);
      setShowMsg(true);
      loadWifiIP({ "isRefetch": true })
      if (result.status) {
        setSuccessMsg({ "message": "data_saved_successfully" })
        setWifiSettings(result.data);
        setIsEditMode(false)
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsSSIDLoad(false)
    }
  }

  const handleNetwork = (network) => {
    if (network?.ssid === currentSSID) {
      setShowNetworks(false)
    } else {
      setFocusingNetwork({
        ...network
      });

      if (network?.isAlreadyConnected) {
        setShowAlreadyConnected(true)
      } else if (network?.networkType === NetworkType.OPEN) {
        setOpenNetworkLoading(true)
        handleOpenNetwork(network)
      } else if (network?.networkType === NetworkType.SECURED) {
        setShowPasswordDialog(true)
      } else if (network?.networkType === NetworkType.ENTERPRISES) {
        setShowEnterprise(true)
      } else {
        //handler for NetworkType.ENTERPRISEWEB && null network IDs
        handleOpenNetwork(network)
      }
    }
  }

  const handleAlreadyConnectedNetwork = () => {
    setConnectLoading(true)
    const networkData = {
      ssid: focusingNetwork?.ssid,
      networkType: focusingNetwork?.networkType,
      isAlreadyConnected: focusingNetwork?.isAlreadyConnected || null,
      networkID: focusingNetwork?.networkID || null,
      password: null,
      data: null
    }
    handleSetWifiNetwork(networkData)
  }

  const handleAlreadyConnectedNetworkFailure = () => {
    // Update the state variable focusingNetwork by setting the isAlreadyConnected key to false. 
    // This key signifies whether the currently selected network SSID is already connected.
    setFocusingNetwork(prevState => ({
      ...prevState,
      isAlreadyConnected: false,
      networkID: null
    }));
    handleNetworkRefresh()
    setShowAlreadyConnected(false)
    setShowPasswordDialog(true)
  }

  const handleOpenNetwork = (network) => {
    const networkData = {
      ssid: network?.ssid,
      networkType: network?.networkType,
      isAlreadyConnected: network?.isAlreadyConnected || null,
      networkID: network?.networkID || null,
      password: null,
      data: null
    }
    handleSetWifiNetwork(networkData)
  }

  const handleNetworkConnection = () => {
    setConnectLoading(true)
    const networkData = {
      ssid: focusingNetwork?.ssid,
      networkType: focusingNetwork?.networkType,
      password: focusingNetwork?.password || null,
      isAlreadyConnected: focusingNetwork?.isAlreadyConnected || null,
      networkID: focusingNetwork?.networkID || null,
      data: focusingNetwork?.networkType === NetworkType.ENTERPRISES ? {
        "eap": "PEAP",
        "key_mgmt": 'WPA-EAP',
        "peap_version": enterpriseData.peapVersion,
        "phase2": enterpriseData.innerAuthentication,
        "phase1": 'peaplabel=0',
        "identity": enterpriseData.username,
        "password": enterpriseData.password,
      } : null
    }
    handleSetWifiNetwork(networkData)
  }

  const handleSetWifiNetwork = async (networkData) => {
    try {
      const result = await networkService.setWifiNetwork(networkData)
      if (!(result.status)) {
        setError(result.error);
        if (showAlreadyConnected) {
          // Handle already connected network connection failure case
          handleAlreadyConnectedNetworkFailure()
        }
        if (networkData.networkType) {
          setIsNetworkConnectionFail(true)
        } else {
          setIsNetworkNotSupported(true)
        }
      } else {
        hideKeyboard()
        changeInput({ inputValue: "" })
        setShowPasswordDialog(false)
        setShowEnterprise(false)
        setShowNetworks(false)
        setShowAlreadyConnected(false)
        if (result.data.message === NetworkError.UNABLE_TO_FETCH_IP) {
          setShowMsg(true)
          setSuccessMsg(result.data)
        }
        loadWifiSettings({ "isRefetch": true })
        setIsSSIDLoad(true)
        focusingNetwork?.networkType === NetworkType.ENTERPRISES &&
          setEnterpriseData(defaultEnterpriseData)
      }
      setConnectLoading(false)
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setOpenNetworkLoading(false)
    }
  }

  const handleNetworkRefresh = async (isRefreshRequired = true) => {
    try {
      setRefreshLoading(isRefreshRequired)
      setIsNetworkConnectionFail(false)
      setIsNetworkNotSupported(false)
      const networkResult = await networkService.getWifiNetwork();
      if (networkResult.status) {
        setWifiNetworks(networkResult.data.wifiList);
      } else {
        setResult(networkResult.status);
        setShowMsg(true);
        setShowNetworks(false);
        setError(networkResult.error);
        setWifiNetworks([]);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setRefreshLoading(false)
    }
  };

  const handleEnterpriseChange = (event) => {
    const { name, value } = event.target;
    setEnterpriseData({
      ...enterpriseData,
      [name]: value
    });
  }

  const handleWifiOnChange = async (event) => {
    try {
      disableShowMsg()
      const newValue = JSON.parse(event.target.value);
      setIsWifiOn(newValue)
      dispatch(networkState.actions.updateWifiOnOffState({ is_wifi_on: newValue }));
      const result = await networkService.setWifiState(newValue)
      if (newValue) {
        if (result.status) {
          loadWifiSettings({ "isRefetch": true })
          setIsSSIDLoad(true)
        } else {
          if (result.error.code === NetworkErrorCode.NO_WIFI_ADAPTOR) {
            handleNoWifiAdaptor()
          }
          setResult(result.status)
          setError(result.error)
          setShowMsg(true);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }

  }

  const handleNoWifiAdaptor = () => {
    setIsWifiConnected(false)
    setCurrentSSID(null)
    setWifiIP(null)
  }

  const handleConnectedNetworkForget = async () => {
    setForgetConnectionLoading(true)
    disableShowMsg()
    const forgetNetworkData = currentSSID
    handleForgetConnection(forgetNetworkData)
  }

  const handleFocusedNetworkForget = async () => {
    setFocusedForgetLoading(true)
    const forgetNetworkData = focusingNetwork?.ssid
    handleForgetConnection(forgetNetworkData)
  }

  const handleForgetConnection = async (forgetNetworkData) => {
    try {
      const result = await networkService.setForgetCnx(forgetNetworkData)
      setResult(result.status);
      setShowMsg(true)
      setSuccessMsg({ "message": "network_forgot_successfully" })
      if (result.status) {
        setIsSSIDLoad(true)
        loadWifiSettings({ "isRefetch": true })
      } else {
        if (result.error.code === NetworkErrorCode.NO_WIFI_ADAPTOR) {
          handleNoWifiAdaptor()
        }
        setError(result.error)
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setShowAlreadyConnected(false)
      setForgetConnectionLoading(false)
      setFocusedForgetLoading(false)
      setShowNetworks(false)
    }
  }

  const handleShowNetworks = async () => {
    setShowNetworks(true)
    disableShowMsg()
  }

  const handleEditModeChange = () => {
    setIsEditMode(true)
    disableShowMsg()
  }

  const handleEnterpriseDialogClose = () => {
    setEnterpriseData(defaultEnterpriseData)
  }

  useEffect(() => {
    loadWifiSettings({ "isRefetch": false })
  }, [])

  const loadWifiIP = async (arg) => {
    try {
      disableShowMsg();
      setProcessingWifiIP(true);
      const result = await networkService.getWifiIPDetails(arg);
      setWifiIP(result.data.ip);
      const ssidResult = await networkService.getSSID();
      if (ssidResult.status) {
        setCurrentSSID(ssidResult?.data?.ssid)
      }

      setProcessingWifiIP(false)

    } catch (error) {
      console.error('Error in load WiFi IP')
    }
  };

  const loadWifiSettings = async (arg) => {
    try {
      setIsIpDetailsFetched(false)
      loadWifiIP(arg);

      networkService.getSSID()
        .then((result) => {
          setIsSSIDLoad(false)
          if (result.status) {
            setCurrentSSID(result?.data?.ssid)
            if (!result?.data?.ssid) {
              setWifiSettings(null);
              setIsIpDetailsFetched(true)
            }
          } else {
            setResult(result.status);
            setError(result.error);
            setShowMsg(true);
          }
        })

      networkService.getConnectionStatus()
        .then((result) => {
          if (result.status) {
            setIsWifiConnected(result?.data?.is_wifi_connected)
          } else {
            setResult(result.status);
            setIsWifiConnected(false)
            setError(result.error);
            setShowMsg(true);
          }
          setIsLoading(false)
        })

      networkService.getWifiConfigs(arg)
        .then((result) => {
          if (result.status) {
            setWifiSettings(result.data);
          } else {
            setResult(result.status);
            setError(result.error);
            setShowMsg(true);
          }
          setIsIpDetailsFetched(true)
        })

      // Get WiFi networks
      networkService.getWifiNetwork()
        .then((networkResult) => {
          if (networkResult.status) {
            setWifiNetworks(networkResult.data.wifiList);
          }
        });
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
    }
  };

  const disableCdn = !(isWifiConnected && isWifiOn)

  return (
    <>
      {!isEditMode &&
        <Grid container height={'100%'} sx={{ display: 'flex', }}>
          <Grid container maxHeight='10%'>
            <Grid container item xs={6} >
              <PageTitle title={t('network_page.wifi_page.title')} isBackNavEnabled={true} />
            </Grid>
            <Grid container item xs={6} alignItems={'center'} justifyContent={'flex-end'} sx={{ fontSize: '3em', }}>
              <ToggleButtonGroup
                color="primary"
                value={isWifiOn}
                exclusive
                onChange={handleWifiOnChange}
              >
                <ToggleButton value={false} sx={{ paddingX: 10, fontSize: '0.8em' }}>
                  {t('network_page.wifi_page.off')}
                </ToggleButton>
                <ToggleButton value={true} sx={{ paddingX: 10, fontSize: '0.8em' }}>
                  {t('network_page.wifi_page.on')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>


          <Grid container item xs={12} gap={2} height="92%">
            <Grid container item height={'25%'} sx={{ opacity: disableCdn ? '0.5' : '1' }}>
              <Paper variant="outlined" sx={{ width: '100%', height: '100%' }}>
                <Grid container item display={'flex'} rowGap={4} padding={7}>
                  <Grid item xs={6} my={'auto'} >
                    <NetworkDataPair
                      title='network_page.wifi_page.wifi_ip'
                      value={isWifiOn ? wifiIP : null}
                      isLoading={processingWifiIP && wifiIP}
                      isRefresh={true}
                      handleRefresh={loadWifiIP}
                      disableCdn={disableCdn}
                    />
                  </Grid>

                  <Grid item xs={6} display={'flex'} justifyContent={'flex-end'}>
                    <Button variant="contained" sx={{ paddingY: 3, width: '40%' }}
                      disabled={disableCdn} onClick={handleShowNetworks}>
                      {t('network_page.wifi_page.show_networks')}
                    </Button>
                  </Grid>

                  <Grid item xs={6} my={'auto'} >
                    <NetworkDataPair
                      title='network_page.wifi_page.current_network'
                      value={isWifiOn ? currentSSID || t('network_page.wifi_page.not_selected') : t('network_page.wifi_page.not_selected')}
                      isLoading={isSSIDLoad}
                      isRefresh={false}
                    />
                  </Grid>

                  <Grid item xs={6} display={'flex'} justifyContent={'flex-end'}>
                    <Button variant="contained" sx={{ paddingY: 4, width: '40%' }}
                      disabled={disableCdn || !currentSSID || forgetConnectionLoading}
                      onClick={handleConnectedNetworkForget}>
                      {forgetConnectionLoading ? t('network_page.wifi_page.forgetting') : t('network_page.wifi_page.forget_connection')}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid container item height={'57%'} sx={{ opacity: disableCdn ? '0.5' : '1' }}>
              <Paper variant='outlined' sx={{ padding: 7, width: '100%', height: '100%' }}>
                <StaticIPSettings
                  settings={wifiSettings}
                  handleEditModeChange={handleEditModeChange}
                  disableCdn={disableCdn}
                  isWifiOn={isWifiOn}
                  dhcpIP={wifiIP}
                  isIpDetailsFetched={isIpDetailsFetched}
                  currentSSID={currentSSID}
                />
              </Paper>
            </Grid>

            <Grid container item xs={10} height={'10%'}>
              {
                showMsg &&
                <SettingsInfoMessage
                  isShow={showMsg}
                  message={result ? `network_page.${successMsg.message}` : `network_page.network_error.${error?.message}`}
                  status={result}
                />
              }
            </Grid>
          </Grid>
        </Grid>
      }
      {isEditMode &&
        < CommonIPSettings
          settings={wifiSettings}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          result={result}
          errorMsg={error}
          connected={isWifiConnected}
          handleSave={handleSave}
          ipDetails={ipDetails}
          setIPDetails={setIPDetails}
          showMsg={showMsg}
          setShowMsg={setShowMsg}
          networkType={'WiFi'}
        />
      }
      {
        showNetworks &&
        <NetworkDialog
          showNetworks={showNetworks}
          setShowNetworks={setShowNetworks}
          handleNetworkRefresh={handleNetworkRefresh}
          wifiNetworks={wifiNetworks}
          handleNetwork={handleNetwork}
          selectedNetwork={currentSSID}
          refreshLoading={refreshLoading}
          setIsNetworkNotSupported={setIsNetworkNotSupported}
          isNetworkNotSupported={isNetworkNotSupported}
          error={error}
        />
      }
      {
        showPasswordDialog &&
        <PasswordDialog
          showPasswordDialog={showPasswordDialog}
          setShowPasswordDialog={setShowPasswordDialog}
          focusingNetwork={focusingNetwork}
          handleNetworkConnection={handleNetworkConnection}
          connectLoading={connectLoading}
          setFocusingNetwork={setFocusingNetwork}
          isNetworkConnectionFail={isNetworkConnectionFail}
          error={error}
          setIsNetworkConnectionFail={setIsNetworkConnectionFail}
        />
      }
      {
        showEnterprise &&
        <WiFiEnterpriseDialog
          showEnterprise={showEnterprise}
          setShowEnterprise={setShowEnterprise}
          enterpriseData={enterpriseData}
          handleEnterpriseChange={handleEnterpriseChange}
          handleNetworkConnection={handleNetworkConnection}
          focusingNetwork={focusingNetwork}
          connectLoading={connectLoading}
          isNetworkConnectionFail={isNetworkConnectionFail}
          error={error}
          setIsNetworkConnectionFail={setIsNetworkConnectionFail}
          handleEnterpriseDialogClose={handleEnterpriseDialogClose}
        />
      }
      {
        showAlreadyConnected &&
        <AlreadyConnectedNetwork
          showAlreadyConnected={showAlreadyConnected}
          setShowAlreadyConnected={setShowAlreadyConnected}
          handleForgetConnection={handleFocusedNetworkForget}
          handleAlreadyConnectedNetwork={handleAlreadyConnectedNetwork}
          connectLoading={connectLoading}
          forgetLoading={focusedForgetLoading}
        />
      }
      {
        isLoading &&
        <LoadingDialog open={isLoading} />
      }
      {
        openNetworkLoading &&
        <ConnectLoadingDialog open={openNetworkLoading} />
      }
    </>
  )
}

export default Wifi;