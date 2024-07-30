import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Paper,
  FormControl,
  Select,
  MenuItem,
  FormGroup,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import * as configurationService from '../../services/configuration.service'
import Switch from '../../components/switch'
import { SettingsSaveButton } from "../../components/button/settings-save-button";
import { PageTitle } from "../../components/custom-text-message/page-title";
import { SettingsKey } from "../../components/custom-text-message/settings-key";
import { SettingsInfoMessage } from "../../components/custom-text-message/settings-info-msg";
import { Certificates, NTEPDefaults, PermissionModules } from "../../constants";
import applicationState from "../../redux/reducers/application-state"
import { useDispatch, useSelector } from "react-redux";
import NTEPConfirmation from "./certificate-confirmation/ntep-popup";
import DefaultModeNotes from "./notes/default-mode";
import RawModeNotes from "./notes/raw-mode";
import NTEPModeNotes from "./notes/ntep-mode";
import usePermission from "../../hooks/usePermission";
import settings from "../../redux/reducers/settings";

function Metrological() {

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const metrological_standards = [
    {
      'id': 1,
      'metrological_setting': 'Default',
      'is_strict_mode_enabled': 'false',
      'label': t('configurations.measurements.default')
    },
    {
      'id': 2,
      'metrological_setting': 'Raw',
      'is_strict_mode_enabled': 'false',
      'label': t('configurations.measurements.raw')
    }
  ]

  const [selectedSettings, setSelectedSettings] = useState({
    is_strict_mode_enabled: false,
    metrological_setting: 'default'
  });

  const [currentSettings, setCurrentSettings] = useState({
    is_strict_mode_enabled: false,
    metrological_setting: 'default'
  });

  const [showNTEPPopup, setShowNTEPPopup] = useState(false);
  const [hasPermission] = usePermission(PermissionModules.CONFIGURATION_METROLOGICAL_UPDATE);
  const [msgAreaProps, setMsgAreaProps] = useState({ isShow: false, status: false, msg: '' });
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const isProgressRef = useRef(false);
  const {
    metrological_standard, strict_mode
  } = useSelector((state) => state.settings.metrological);

  const { metrological: metrologicalSettings } = useSelector((state) => state.settings);

  //enable ntep if it is activate in .env file
  const { device_modes } = useSelector(state => state.applicationState);
  if (device_modes?.is_ntep_required) {
    metrological_standards.push({
      'id': metrological_standards.length + 1,
      'metrological_setting': 'NTEP',
      'is_strict_mode_enabled': 'true',
      'label': "NTEP"
    })
  }

  useEffect(() => {
    setIsDataChanged(
      selectedSettings.is_strict_mode_enabled != currentSettings.is_strict_mode_enabled ||
      selectedSettings.metrological_setting != currentSettings.metrological_setting
    );
  }, [currentSettings, selectedSettings]);

  const handleChange = (event) => {

    let strictMode = selectedSettings.is_strict_mode_enabled;

    if (event.target.value === Certificates.NTEP) {
      // force enable strict mode too
      strictMode = NTEPDefaults.STRICT_MODE;
    } else if (selectedSettings.metrological_setting === Certificates.NTEP) {
      // if ntep mode is disabled make the strict mode to last selected one
      strictMode = currentSettings.is_strict_mode_enabled;
    }

    setSelectedSettings({
      metrological_setting: event.target.value,
      is_strict_mode_enabled: strictMode
    });

    setMsgAreaProps({ isShow: false });

  };

  const handleStrictModeChange = (event) => {
    setSelectedSettings({
      ...selectedSettings,
      is_strict_mode_enabled: event.target.checked
    });

    setMsgAreaProps({ isShow: false });
  };

  const saveMeasurementSettings = async () => {

    if (isProgressRef.current) {
      return;
    }

    isProgressRef.current = true;
    setInProgress(true);

    if (showNTEPPopup) {
      setShowNTEPPopup(false)
    }
    if (msgAreaProps.isShow) {
      setMsgAreaProps({ isShow: false });
    }

    const result = await configurationService.setMetroLogicalSettings({
      metrological_setting: selectedSettings.metrological_setting,
      is_strict_mode_enabled: selectedSettings.is_strict_mode_enabled
    });

    setIsDataChanged(false);

    let msg = ''

    if (!result.status) {
      msg = 'common.message.failed_to_save_data';
    } else {
      if (selectedSettings.metrological_setting !== Certificates.NTEP && currentSettings.metrological_setting !== Certificates.NTEP) {
        msg = 'common.message.data_saved_successfully';
      } else {
        msg = 'configurations.measurements.ntep_settings_saved';
      }
    }

    setMsgAreaProps({ isShow: true, status: result.status, msg: msg })

    if (selectedSettings.metrological_setting === Certificates.NTEP) {
      //calibration settings to defaults
      await configurationService.setCalibrationSettings({
        calibration_setting: NTEPDefaults.DEPTH_REF,
        is_zero_weight_check: NTEPDefaults.ZERO_WEIGHT_CHECK
      })
    }

    isProgressRef.current = false;
    setCurrentSettings({ ...selectedSettings });
    setIsDataChanged(false);
    setInProgress(false);
  }

  const handleSave = (data) => {
    if (selectedSettings.metrological_setting === Certificates.NTEP) {
      setShowNTEPPopup(true);
    } else {
      saveMeasurementSettings();
    }
  }

  const popupCloseHandler = (isConfirmed) => {
    isConfirmed ? saveMeasurementSettings() : setShowNTEPPopup(false);
  }

  useEffect(() => {
    setSelectedSettings({
      metrological_setting: metrologicalSettings.metrological_setting,
      is_strict_mode_enabled: metrologicalSettings.is_strict_mode_enabled
    });

    setCurrentSettings({
      metrological_setting: metrologicalSettings.metrological_setting,
      is_strict_mode_enabled: metrologicalSettings.is_strict_mode_enabled
    });

  }, [metrologicalSettings]);

  useEffect(() => {
    if (hasPermission === false) {
      setMsgAreaProps({ isShow: true, msg: 'common.message.permission_denied', status: false });
    } else {
      setMsgAreaProps({ isShow: false });
    }
  }, [hasPermission])

  return (
    <>
      <NTEPConfirmation open={showNTEPPopup} closeHandler={popupCloseHandler} />
      <Grid container rowSpacing={5} height={'100%'}>
        <Grid item xs={12} display={'flex'} alignContent={'center'} height={'10%'}>
          <PageTitle title={t('configurations.measurements.page_title')} isBackNavEnabled={true} />
        </Grid>
        <Grid container item xs={12} height={'80%'}>
          <Paper variant="outlined" sx={{ height: '100%', width: '100%', padding: 17 }} >

            <Grid container item xs={12} height={'100%'}  >
              {/* Form Control */}
              <Grid container item xs={12} height={'40%'} display={'block'} rowSpacing={12}>

                {/* Metro logical standard */}
                <Grid container item xs={12} justifyContent={'space-between'}>
                  <Grid item >
                    <SettingsKey name={'configurations.measurements.metrological_standards'} />
                  </Grid>
                  <Grid item width={'25%'}>
                    <FormControl fullWidth >
                      <Select value={selectedSettings.metrological_setting} onChange={handleChange} inputProps={{ readOnly: !hasPermission }}>
                        {
                          metrological_standards.map((standard) => (
                            <MenuItem key={standard.id} value={standard.metrological_setting}>
                              {standard.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container item xs={12} justifyContent={'space-between'}>
                  <Grid item >
                    <SettingsKey name={'configurations.measurements.strict_mode'} disabled={selectedSettings === Certificates.NTEP} />
                  </Grid>
                  <Grid item width={'25%'}>
                    <FormGroup>
                      <Switch
                        disabled={selectedSettings.metrological_setting === Certificates.NTEP || !hasPermission}
                        checked={selectedSettings.is_strict_mode_enabled || selectedSettings.metrological_setting === Certificates.NTEP}
                        onChange={handleStrictModeChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Grid>


              {/* Measurment settings notes */}
              <Grid
                container
                item
                xs={12}
                marginTop={'auto'}
              // display="flex"
              >
                {
                  selectedSettings.metrological_setting === metrological_standards[0].metrological_setting &&
                  <DefaultModeNotes />
                }
                {
                  selectedSettings.metrological_setting === metrological_standards[1].metrological_setting &&
                  <RawModeNotes />
                }
                {
                  device_modes?.is_ntep_required && selectedSettings.metrological_setting === metrological_standards[2].metrological_setting &&
                  <NTEPModeNotes />
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
                disableCdn={!isDataChanged || inProgress}
              />}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default Metrological;