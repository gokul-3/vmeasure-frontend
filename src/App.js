import React, { useEffect, useState } from "react";
import { useRoutes, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components/macro";
import { StyledEngineProvider } from "@mui/styled-engine";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import createTheme from "./theme";
import appRoutes from "./routes/app.routes";
import loginRoutes from "./routes/login.routes";
import deviceAPI from "./redux/reducers/device-api";
import applicationState from "./redux/reducers/application-state";
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
import { OperatingMode, MeasurementTriggerSrc, MeasurementState, MeasurementPages, ProcessingState, VolumeLevel } from "./constants";
import WorkflowEngine from "./workflow-engine/engine";
import DeviceAPIAuthPopup from "./components/device-api-auth-popup/device-api-auth-popup";
import SoftwareUpdateLayoutDialog from "./pages/update/update-layout-dialog";
import appState from './redux/reducers/measurement-states'
import settings from './redux/reducers/settings'
import { sendDeviceAutoLoginResponse } from "./services/device-api.service";
import navigationController from "./redux/reducers/nav-bar-controller";
import ScaleReconnectPopup from "./pages/scales/scale-reconnect-popup";
import { checkDialogConditions } from "./utils/navigation";
import WorkFlowUpdatedPopup from "./pages/auth/workflow-update-popup";
import CalibrationCompletedPopup from "./pages/calibration/calibration-completed-popup";
import * as ConfigurationService from './services/configuration.service'
import { updateCurrentPageChange } from "./services/utils.service";
import DeviceConfigDownloadDialog from "./pages/device-config/update-popup";
import { getConnectionStatus } from "./services/network.service";
import networkState from "./redux/reducers/network-state";

const { ipcRenderer, } = window.require('electron')


function App() {

  const { i18n } = useTranslation();
  const { success: authSuccess, userInfo } = useSelector((state) => state.userAuth);
  const { autoLoginRequest } = useSelector((state) => state.deviceAPI);
  const {
    is_calibration_completed,
    calibration_info,
    is_open_calibration_completed_popup,
    current_measurmement_page,
    measurement_state,
    start_measurement_timer
  } = useSelector((state) => state.appState);
  const { font_size } = useSelector((state) => state.applicationState)
  const { is_scale_detected, is_scale_detached, show_reconnect_popup, scale_reconnect_with_error } = useSelector((state) => state.settings.weighing_scale)
  const { metrological_setting } = useSelector((state) => state.settings.metrological)
  const [showScaleDialog, updateScaleDialog] = useState(false);

  const dispatch = useDispatch();
  const {
    status: workflowDownloadStatus,
    workflow: workflow_state
  } = useSelector((state) => state.workflow);

  const location = useLocation();
  const navigate = useNavigate();

  const loginContent = useRoutes(loginRoutes);
  const appContent = useRoutes(appRoutes);


  const resolveDeviceAppAutoLoginReq = () => {
    // to disable auto login request from tray app if any
    if (autoLoginRequest) {
      sendDeviceAutoLoginResponse(true)
      dispatch(deviceAPI.actions.disableAutoLoginRequest());
    }
  }

  useEffect(() => {
    console.error("CURRENT LOCATION", location.pathname)
    checkNavigationPath()
    updateCurrentPageChange(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    if (is_calibration_completed) {
      dispatch(settings.actions.resetReconnectPopup(false))
    }
  }, [is_calibration_completed])

  const checkNavigationPath = async () => {
    const dialogStatus = checkDialogConditions(location);
    updateScaleDialog(dialogStatus)
  }

  const resetScaleDialog = () => {
    updateScaleDialog(false);

  }

  useEffect(() => {
    loadLanguageSettings()
    loadWifiSettings()
  }, [])

  const loadLanguageSettings = async () => {
    const loadLanguage = await ConfigurationService.loadLanguageSettings()
    const fontSizeSettings = (loadLanguage?.status ? (loadLanguage?.data?.fontSize || 'default') : 'default')
    const triggerServicePopupTimer = (loadLanguage?.status ? (loadLanguage?.data?.triggerServicePopupTime || 0) : 0)
    const value = loadLanguage?.status ? (loadLanguage?.data?.language || 'en') : 'en';
    dispatch(applicationState.actions.updateFontSetting(fontSizeSettings))
    dispatch(applicationState.actions.updateTriggerServicePopupTime(triggerServicePopupTimer))
    i18n.changeLanguage(value);

  }

  const loadWifiSettings = async () => {
    try {
      const result = await getConnectionStatus()
      if (result.status) {
        dispatch(networkState.actions.updateWifiOnOffState({ is_wifi_on: result?.data?.is_wifi_enabled }));
      } else {
        dispatch(networkState.actions.updateWifiOnOffState({ is_wifi_on: result?.error?.is_wifi_enabled }));
      }
    } catch (error) {
      console.error('Error in getting wifi page state', error)
    }
  }

  useEffect(() => {

    dispatch(appState.actions.updateMeasurementState({
      currentState: MeasurementState.INIT,
      processingState: ProcessingState.INIT,
      additionalInfo: { reason: null }
    }));
    dispatch(appState.actions.resetMeasurementResult());

    if (workflowDownloadStatus && authSuccess) {
      //both login and workflow download success
      dispatch(navigationController.actions.enaleNavigation());
      resolveDeviceAppAutoLoginReq();
      if (autoLoginRequest && workflow_state.workflow_mode.operate_mode == OperatingMode.SLAVE) {
        navigate('/measurement')
      }
    } else if (!authSuccess) {
      navigate('/');
    }
  }, [authSuccess, workflowDownloadStatus]);

  useEffect(() => {
    if (!userInfo) {
      dispatch(appState.actions.resetRetainableFields())
    }
  }, [userInfo])

  useEffect(() => {

    if (location.pathname !== '/measurement' ||
      (
        current_measurmement_page === MeasurementPages.DYNAMIC_PAGES || current_measurmement_page === MeasurementPages.ADDITIONAL_IMAGE ||
        (
          current_measurmement_page === MeasurementPages.MEASUREMENT_PAGE &&
          !start_measurement_timer &&
          measurement_state?.currentState < MeasurementState.MEASUREMENT
        )

      )
    ) {
      dispatch(appState.actions.updateMeasurementFlowInProgress(false));
    } else {
      dispatch(appState.actions.updateMeasurementFlowInProgress(true));
    }

  }, [location.pathname, current_measurmement_page, start_measurement_timer, measurement_state])


  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={createTheme(font_size)}>
        <ThemeProvider theme={createTheme(font_size)}>
          <WorkflowEngine />
          <DeviceAPIAuthPopup />
          <WorkFlowUpdatedPopup />
          <DeviceConfigDownloadDialog />
          <SoftwareUpdateLayoutDialog />
          {
            authSuccess && workflowDownloadStatus
              ?
              appContent
              :
              loginContent
          }
          {authSuccess && workflowDownloadStatus && !is_calibration_completed && showScaleDialog && show_reconnect_popup &&
            <ScaleReconnectPopup
              props={resetScaleDialog}
              is_scale_detected={is_scale_detected}
              is_scale_detached={is_scale_detached}
              scale_reconnect_with_error={scale_reconnect_with_error}
            />}

          {
            (is_calibration_completed && calibration_info?.triggerMode === MeasurementTriggerSrc.REMOTE && location.pathname != '/measurement') &&
            <CalibrationCompletedPopup />
          }
          {/* {authSuccess && workflowDownloadStatus &&
              <WorkFlowUpdatedPopup />
            } */}
        </ThemeProvider>
      </MuiThemeProvider>
    </StyledEngineProvider>

  );
}

export default App;
