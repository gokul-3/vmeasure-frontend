import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  useTheme,
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Alert as MuiAlert,
  AlertTitle,
  FormGroup
} from "@mui/material";
import { useTranslation, Trans } from "react-i18next";
import * as configurationService from '../../services/configuration.service'
import styled from "styled-components/macro";
import Switch from "../../components/switch";
import { SettingsSaveButton } from "../../components/button/settings-save-button";
import { PageTitle } from "../../components/custom-text-message/page-title";
import { SettingsKey } from "../../components/custom-text-message/settings-key";
import { SettingsInfoMessage } from "../../components/custom-text-message/settings-info-msg";
import { Certificates, PermissionModules } from "../../constants";
import usePermission from "../../hooks/usePermission";
import { useSelector } from "react-redux";

const Alert = styled(MuiAlert)`
  .MuiSvgIcon-root {
    font-size:1.4em;
  }
`
function CalibrationSetting() {

  const { t } = useTranslation();

  const calibration_settings = [
    {
      'id': 1,
      'calibration_setting': 'Legacy',
      'label': t('configurations.calibration.legacy')
    },
    {
      'id': 2,
      'calibration_setting': 'Marker Based',
      'label': t('configurations.calibration.marker_based')
    },
    {
      'id': 3,
      'calibration_setting': 'Region Based',
      'label': t('configurations.calibration.region_based')
    },
  ]
  const [settingsValue, setSettingsValue] = useState({
    calibration_setting: '',
    is_zero_weight_check: true
  });

  const { metrological_setting } = useSelector(state => state.settings.metrological);
  const [currentData, setCurrentData] = useState({
    calibration_setting: 'Legacy',
    is_zero_weight_check: true
  });
  const [msgAreaProps, setMsgAreaProps] = useState({ isShow: false, status: false, msg: '' });
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const inprogressRef = useRef(false);
  const [hasPermission] = usePermission(PermissionModules.CONFIGURATION_CALIBRATION_UPDATE);

  const { calibration: calibrationSettings } = useSelector((state) => state.settings);

  const handleDepthRefChange = (event) => {
    setSettingsValue({ ...settingsValue, calibration_setting: event.target.value });
    setMsgAreaProps({ isShow: false, status: false });
  };

  const validateCetrificateMode = (certificateList) => {
    //True - only if current certificate mode available in given certificate list 
    return certificateList.includes(metrological_setting)
  }

  useEffect(() => {
    setIsDataChanged(
      settingsValue.calibration_setting != currentData.calibration_setting ||
      settingsValue.is_zero_weight_check != currentData.is_zero_weight_check
    );
  }, [currentData, settingsValue]);

  const handleSave = async () => {

    if (inprogressRef.current) {
      return;
    }

    if (msgAreaProps) {
      setMsgAreaProps({ isShow: false });
    }

    setInProgress(true);
    inprogressRef.current = true;

    const result = await configurationService.setCalibrationSettings(settingsValue)

    let msg = '';
    if (result.status) {
      if (settingsValue.calibration_setting !== currentData.calibration_setting || settingsValue.is_zero_weight_check !== currentData.is_zero_weight_check) {
        msg = 'configurations.calibration.calibration_settings_saved';
      } else {
        msg = 'common.message.data_saved_successfully';
      }
    } else {
      msg = 'common.message.failed_to_save_data';
    }

    setMsgAreaProps({
      status: result.status,
      msg: msg,
      isShow: true
    })

    inprogressRef.current = false;
    setIsDataChanged(false);
    setCurrentData({ ...settingsValue });
    setInProgress(false);

  }

  const handleZeroWeightCheckChange = (event) => {
    setSettingsValue({
      ...settingsValue,
      is_zero_weight_check: event.target.checked
    })
  }

  useEffect(() => {
    setSettingsValue({
      calibration_setting: calibrationSettings.calibration_setting,
      is_zero_weight_check: calibrationSettings.is_zero_weight_check
    });

    setCurrentData({
      calibration_setting: calibrationSettings.calibration_setting,
      is_zero_weight_check: calibrationSettings.is_zero_weight_check
    });
  }, [calibrationSettings])

  useEffect(() => {

    if (hasPermission === false) {
      setMsgAreaProps({ isShow: true, msg: 'common.message.permission_denied', status: false });
    } else if (validateCetrificateMode([Certificates.NTEP])) {
      setMsgAreaProps({ isShow: true, msg: 'common.message.permission_denied', status: false });
    } else {
      setMsgAreaProps({ isShow: false });
    }
  }, [hasPermission])

  return (
    <Grid container rowSpacing={5} height={'100%'}>
      <Grid item xs={12} display={'flex'} alignContent={'center'} height={'10%'}>
        <PageTitle title={t('configurations.calibration.page_title')} isBackNavEnabled={true} />
      </Grid>
      <Grid container item xs={12} height={'80%'}>
        <Paper variant="outlined" sx={{ height: '100%', width: '100%', padding: 17 }} >

          <Grid container item xs={12} height={'100%'}  >
            {/* Form Control */}
            <Grid container item xs={12} height={'50%'} display={'block'} rowSpacing={15}>

              {/* Metro logical standard */}
              <Grid container item xs={12} justifyContent={'space-between'}>
                <Grid item >
                  <SettingsKey name={'configurations.calibration.calibration_settings'} disabled={validateCetrificateMode([Certificates.NTEP])} />
                </Grid>
                <Grid item width={'25%'}>
                  <FormControl fullWidth >
                    <Select value={settingsValue.calibration_setting} onChange={handleDepthRefChange} inputProps={{ readOnly: !hasPermission }} disabled={validateCetrificateMode([Certificates.NTEP])}>
                      {
                        calibration_settings.map((setting) => (
                          <MenuItem key={setting.id} value={setting.calibration_setting} >
                            {setting.label}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container item xs={12} justifyContent={'space-between'}>
                <Grid item >
                  <SettingsKey name={'configurations.calibration.zero_tare_calibration'} disabled={validateCetrificateMode([Certificates.NTEP])} />
                </Grid>
                <Grid item width={'25%'}>
                  <FormGroup>
                    <Switch
                      checked={settingsValue.is_zero_weight_check}
                      onChange={handleZeroWeightCheckChange}
                      inputProps={{ 'aria-label': 'controlled' }}
                      disabled={!hasPermission || validateCetrificateMode([Certificates.NTEP])}
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </Grid>

            <Grid container item xs={12} marginTop={'auto'}>
              {
                settingsValue.calibration_setting === calibration_settings[0].calibration_setting &&
                <Alert variant="outlined" severity="info" >
                  <AlertTitle sx={{ fontSize: '1.4em' }}>{t('configurations.notes')}</AlertTitle>
                  <Typography variant="h4" sx={{ color: 'black' }}>
                    <Trans
                      i18nKey="configurations.calibration.notes_legacy.line1"
                      components={[
                        <span style={{ color: '#307EC7' }}></span>,
                      ]}
                    />
                  </Typography>
                </Alert>
              }
              {
                settingsValue.calibration_setting === calibration_settings[1].calibration_setting &&

                <Alert variant="outlined" severity="info" >
                  <AlertTitle sx={{ fontSize: '1.4em' }}>{t('configurations.notes')}</AlertTitle>
                  <Typography variant="h4" sx={{ color: 'black' }}>
                    <Trans
                      i18nKey="configurations.calibration.notes_marker_based.line1"
                      components={[
                        <span style={{ color: '#307EC7' }}></span>,
                      ]}
                    />
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'black' }}>
                    <Trans
                      i18nKey="configurations.calibration.notes_marker_based.line2"
                      components={[
                        <span style={{ color: '#307EC7' }}></span>,
                      ]}
                    />
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'black' }}>
                    <Trans
                      i18nKey="configurations.calibration.notes_marker_based.line3"
                      components={[
                        <span style={{ color: '#307EC7' }}></span>,
                      ]}
                    />
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'black' }}>
                    <Trans
                      i18nKey="configurations.calibration.notes_marker_based.line4"
                      components={[
                        <span style={{ color: '#307EC7' }}></span>,
                      ]}
                    />
                  </Typography>
                </Alert>
              }
              {
                settingsValue.calibration_setting === calibration_settings[2].calibration_setting &&
                <Alert variant="outlined" severity="info" >
                  <AlertTitle variant='body3'>{t('configurations.notes')}</AlertTitle>
                  <Typography variant="h4" sx={{ color: 'black' }}>1.{" "}
                    <Trans
                      i18nKey="configurations.calibration.notes_region_based.line1"
                      components={[
                        <span style={{ color: '#307EC7' }}></span>,
                      ]}
                    />
                  </Typography>

                  <Typography variant="h4" sx={{ color: 'black' }}>2.{" "}
                    <Trans
                      i18nKey="configurations.calibration.notes_region_based.line2"
                      components={[
                        <span style={{ color: '#307EC7' }}></span>,
                      ]}
                    />
                  </Typography>
                </Alert>
              }
            </Grid>
          </Grid>

        </Paper>
      </Grid>
      <Grid container item justifyContent={'space-between'} height={'10%'}>
        <Grid item>
          <SettingsInfoMessage
            isShow={msgAreaProps.isShow}
            message={msgAreaProps.msg}
            status={msgAreaProps.status}
          />
        </Grid>
        <Grid item>
          {hasPermission &&
            <SettingsSaveButton
              onSaveClick={handleSave}
              disableCdn={validateCetrificateMode([Certificates.NTEP]) || !isDataChanged || inProgress}
            />}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CalibrationSetting;
