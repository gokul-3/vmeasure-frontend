import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
} from "@mui/material";

import * as networkService from '../../services/network.service'
import CommonIPSettings from "./common-ip-settings";
import { NetworkMode, PermissionModules } from "../../constants";
import LoadingDialog from "../../components/dialogs/loading-dialog";
import { PageTitle } from "../../components/custom-text-message/page-title";
import { SettingsInfoMessage } from "../../components/custom-text-message/settings-info-msg";
import { NetworkDataPair } from "./component/network-data";
import { EthernetStaticIPSettings } from "./component/ethernet-static-ip";
import usePermission from "../../hooks/usePermission";
import { useTranslation } from "react-i18next";

function Ethernet() {
  const { t } = useTranslation();

  const [showMsg, setShowMsg] = useState(false);
  const [ethernetSettings, setEthernetSettings] = useState('')
  const [error, setError] = useState()
  const [result, setResult] = useState(false)

  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [ethernetIP, setEthernetIP] = useState()
  const [processingEthernetIP, setProcessingEthernetIP] = useState(false)
  const [ipDetails, setIPDetails] = useState()

  const disableCdn = !ethernetSettings?.is_ethernet_connected

  const handleSave = async () => {
    try {
      disableShowMsg()
      let networkConfig = {
        mode: ipDetails.mode,
        ip_details: null
      };
      if (ipDetails.mode === NetworkMode.STATIC) {
        networkConfig.ip_details = {
          static_ip: ipDetails.static_ip_details.static_ip,
          subnet: ipDetails.static_ip_details.subnet,
          gateway: ipDetails.static_ip_details.gateway,
          preferred_dns: ipDetails.static_ip_details.preferred_dns,
          alternate_dns: ipDetails.static_ip_details.alternate_dns
        }
      }
      const result = await networkService.setEthernetConfigs(networkConfig)
      loadEthernetIP({ "isRefetch": true })


      setResult(result.status);
      setShowMsg(true);
      if (result.status) {
        setEthernetSettings(result.data)
        setIsEditMode(false)
      } else {
        setError(result.error)
      }

    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  const disableShowMsg = () => {
    if (showMsg) {
      setShowMsg(false);
    }
  };

  useEffect(() => {
    loadEthernetSettings({ "isRefetch": false })
  }, [])

  const loadEthernetIP = async (arg) => {
    try {
      setProcessingEthernetIP(true)
      const result = await networkService.getEthernetIPDetails(arg);
      setEthernetIP(result.data.ip)
      setProcessingEthernetIP(false);
    } catch (error) {
      console.error('Error in loading IP');
    }

  }

  const handleEditModeChange = () => {
    disableShowMsg()
    setIsEditMode(true)
  }

  const loadEthernetSettings = async (arg) => {
    try {
      loadEthernetIP(arg);

      const result = await networkService.getEthernetConfigs()
      setResult(result.status)

      if (result.status) {
        setEthernetSettings(result.data)
      } else {
        setError(result.error)
        setShowMsg(true)
      }

    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!isEditMode &&
        <Grid height={'100%'} sx={{ display: 'flex', flexDirection: 'column', }}>
          <Grid container item xs={12} maxHeight='10%'>
            <PageTitle title={t('network_page.ethernet_page.title')} isBackNavEnabled={true} />
          </Grid>
          <Grid container item xs={12} height={'85%'}>
            <Grid height={'15%'} width={'100%'} sx={{ opacity: disableCdn ? '0.5' : '1' }}>
              <Paper sx={{ padding: 10, height: '100%' }}>
                <Grid item xs={6} display={'flex'} height='100%'>
                  <NetworkDataPair
                    title='network_page.ethernet_ip'
                    value={ethernetIP}
                    isLoading={processingEthernetIP && ethernetIP}
                    isRefresh={true}
                    handleRefresh={loadEthernetIP}
                    disableCdn={disableCdn}
                  />
                </Grid>
              </Paper>
            </Grid>

            <Grid container item height={"70%"} display={'flex'} sx={{ opacity: disableCdn ? '0.5' : '1' }}>
              <Paper sx={{ padding: 10, width: '100%' }}>
                <EthernetStaticIPSettings
                  settings={ethernetSettings}
                  handleEditModeChange={handleEditModeChange}
                  disableCdn={disableCdn}
                  dhcpIP={ethernetIP}
                />
              </Paper>
            </Grid>
            <Grid container item xs={10} height={'7%'}>
              {
                showMsg &&
                <SettingsInfoMessage
                  isShow={showMsg}
                  message={result ? 'common.message.data_saved_successfully' : `network_page.network_error.${error?.message}`}
                  status={result}
                />
              }
            </Grid>
          </Grid>
        </Grid>
      }
      {isEditMode &&
        <CommonIPSettings
          settings={ethernetSettings}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          result={result}
          errorMsg={error}
          connected={ethernetSettings?.is_ethernet_connected}
          handleSave={handleSave}
          ipDetails={ipDetails}
          setIPDetails={setIPDetails}
          showMsg={showMsg}
          setShowMsg={setShowMsg}
          networkType={'Ethernet'}
        />
      }
      {isLoading &&
        <LoadingDialog open={isLoading} />
      }
    </>
  )
}

export default Ethernet;