import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import DataPair from './data-pair';
import * as systemInfoService from '../../services/info.service'
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

export default function SystemInfo() {

  const { t } = useTranslation();

  const [systemData, setSystemData] = useState({});
  const [workflowData, setWorkflowData] = useState({});

  const { workflow } = useSelector((state) => state.workflow);

  useEffect(() => {
    loadSystemInfo();
  }, [workflow])

  const loadSystemInfo = () => {
    systemInfoService.getSystemInfo(false)
      .then((result) => {
        if (result.status) {

          setSystemData({
            "information_page.system_info.serial_number": result.data.serial_number,
            "information_page.system_info.cc": result.data.cc ?? 'NA',
            "information_page.system_info.operating_temperature": result.data.operating_temperature,
            "information_page.system_info.manufacturer": result.data.manufacturer,
            "information_page.system_info.model": result.data.model_no,
            "information_page.system_info.app_version": result.data.app_version
          });

          setWorkflowData({
            "information_page.system_info.system_name": result.data.system_friendly_name,
            "information_page.system_info.site_name": result.data.site_name,
            "information_page.system_info.config_group_name": result.data.config_group_name ?? 'NA',
            "information_page.system_info.workflow_name": result.data.workflow_name ?? 'NA',
            "information_page.system_info.webhooks": result.data.webhooks?.length ? result.data.webhooks.toString() : 'NA',
            "information_page.system_info.file_webhook_name": result.data.file_webhook_name ?? 'NA',
          });
        }
      })
      .catch((err) => {

      })
  }


  return (

    <Grid container paddingX={5} columnSpacing={20} height={'77vh'} style={{ height:'77vh', overflow: 'auto' }}>
      <Grid container item xs={6} padding={5}>
        {
          Object.keys(systemData).map((key) => (
            <Grid key={key} container item xs={12} borderBottom={'1px solid #ddd'} paddingY={8}>
              <DataPair label={t(key)} value={systemData[key]} />
            </Grid>
          ))
        }
      </Grid>
      <Grid container item xs={6} padding={5}>
        {
          Object.keys(workflowData).map((key) => (
            <Grid key={key} container item xs={12} borderBottom={'1px solid #ddd'} paddingY={8}>
              <DataPair label={t(key)} value={workflowData[key]} />
            </Grid>
          ))
        }
      </Grid>
    </Grid>

  )
}
