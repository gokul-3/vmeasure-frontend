import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import barcodeScanner from "../redux/reducers/barcode-scan";
import externalInput from "../redux/reducers/external-input";
import applicationState from "../redux/reducers/application-state";
import appState from "../redux/reducers/measurement-states";
import softwareUpdateState from "../redux/reducers/software-update"
import settings from "../redux/reducers/settings";
import deviceAPI from "../redux/reducers/device-api"
import userAuth from "../redux/reducers/user-auth"
import networkState from "../redux/reducers/network-state";
import { BarcodeDataCategory, IPC_Events, MeasurementTriggerSrc } from "../constants";
import { useNavigate, useLocation } from "react-router-dom";
import workflow from '../redux/reducers/workflow'
import customWorkflow from "../redux/reducers/custom-workflow";
const { ipcRenderer, } = window.require('electron')

const WorkflowEngine = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const dataRef = useRef({
    pathname: null
  });


  useEffect(() => {
    dataRef.current.pathname = location.pathname;
  }, [location])

  useEffect(() => {

    ipcRenderer.on(IPC_Events.ON_BARCODE_SCAN, (event, data) => {
      dispatch(barcodeScanner.actions.emitBarcodeValue({ value: data.value, category: data.category }));
    });

    ipcRenderer.on(IPC_Events.ON_EXTERNAL_INPUT, (event, data) => {
      dispatch(externalInput.actions.emitExternalInputValue({ value: data.value, category: data.category }));
    });

    ipcRenderer.on(IPC_Events.ON_SOFTWARE_UPDATE_STATE_CHANGE, (event, data) => {
      dispatch(softwareUpdateState.actions.updateSoftwareUpdateProgress({
        ...data
      }))
    })

    ipcRenderer.on(IPC_Events.CHANGE_MEASUREMENT_CHECK_STATE, (event, data) => {
      dispatch(appState.actions.updateMeasurementCheckState(data))
    })


    ipcRenderer.on(IPC_Events.ON_CALIBRATION_STATE_CHANGE, (event, data) => {
      dispatch(appState.actions.updateCalibrationStatus(data))
    });

    ipcRenderer.on(IPC_Events.START_MEASUREMENT_TIMER, (event, data) => {
      dispatch(barcodeScanner.actions.emitBarcodeValue({ value: data.barcode, category: BarcodeDataCategory.SCAN_VALUE }));
      dispatch(appState.actions.startMeasurementTimer(data))
    });

    ipcRenderer.on(IPC_Events.ON_MEASUREMENT_STATE_CHANGE_INIT, (event, data) => {
      dispatch(appState.actions.initMeasurementState(data))
    })

    ipcRenderer.on(IPC_Events.ON_BARCODE_VALIDATION_FAILED, (event, data) => {
      dispatch(appState.actions.emitBarcodeAPIValidationFailure(data))
    });

    ipcRenderer.on(IPC_Events.ON_MEASUREMENT_UPLOAD_FAILED, (event, data) => {
      dispatch(appState.actions.emitContMeasurementUploadFailure(data))
    });

    ipcRenderer.on(IPC_Events.ON_DEVICE_API_AUTH_REQUEST, (event, data) => {
      dispatch(deviceAPI.actions.openConfirmation(data))
    });

    ipcRenderer.on(IPC_Events.ON_DEVICE_API_AUTO_LOGIN_REQUEST, (event, data) => {
      dispatch(deviceAPI.actions.updateAutoLoginRequest(data));
      navigate('/login');
      setTimeout(() => {
        dispatch(userAuth.actions.doAutoLogin(data));
        dispatch(deviceAPI.actions.setPairStatus(true));
      }, 3000)
    });

    ipcRenderer.on(IPC_Events.ON_DEVICE_APP_UNPAIR_NOTOFICATION, (event, data) => {
      dispatch(deviceAPI.actions.setPairStatus(false));
    });

    ipcRenderer.on(IPC_Events.ON_DEVICE_APP_PAIR_NOTOFICATION, (event, data) => {
      dispatch(deviceAPI.actions.setPairStatus(true));
    });

    ipcRenderer.on(IPC_Events.ON_MEASUREMENT_RETRYING, (event, data) => {
      dispatch(appState.actions.updateMeasurementRetryState(data))
    });

    ipcRenderer.on(IPC_Events.ON_SELECTED_BARCODE_DEVICE_CHANGE, (event, data) => {
      dispatch(settings.actions.updateBarcode(data))
    });

    ipcRenderer.on(IPC_Events.ON_SELECTED_WEIGHING_SCALE_CHANGE, (event, data) => {
      dispatch(settings.actions.updateScale(data))
    });

    ipcRenderer.on(IPC_Events.ON_UNITS_CHANGE, (event, data) => {
      dispatch(settings.actions.updateUnits(data))
    });

    ipcRenderer.on(IPC_Events.ON_DEVICE_CONFIGURATION_CHANGE, (event, data) => {
      dispatch(settings.actions.updateDeviceConfiguration(data))
    });

    ipcRenderer.on(IPC_Events.ON_SYSTEM_FORCE_LOGOUT, (event, data) => {
      dispatch(userAuth.extraActions.userLogout());
      // On force logout, if user in login page logout doesn't any affect on it. 
      // So forcefully change the control to login page
      if (dataRef.current.pathname === '/login') {
        navigate('/');
      }
    })

    ipcRenderer.on(IPC_Events.ON_WEIGHING_SCALE_TRIGGER, (event, data) => {
      dispatch(appState.actions.updateWeighingScaleTriggerState(data))
    })

    ipcRenderer.on(IPC_Events.ON_SCALE_AUTO_DETECT, (event, data) => {
      dispatch(settings.actions.updateScaleDetected(data.is_scale_detected))
      dispatch(settings.actions.setScaleDetachedStatus(data.is_scale_detached))
      if (data?.reconnect_with_error) {
        dispatch(settings.actions.setReconnectWithError(data.reconnect_with_error))
      }
    })

    ipcRenderer.on(IPC_Events.UPDATE_CALIBRATION_EXPIRED_TIME, (event, data) => {
      dispatch(appState.actions.updateCalibrationInfo(data))
      if (dataRef.current.pathname != '/measurement' &&
        dataRef.current.pathname != '/menu/network/network-testing' &&
        data.triggerMode == MeasurementTriggerSrc.REMOTE
      ) {
        dispatch(appState.actions.updateCalibrationSuccess(true));
      }
    })

    ipcRenderer.on(IPC_Events.SMART_MEASUREMENT_TRIGGER, (event, data) => {
      dispatch(appState.actions.updateSmartMeasurementTrigger(data))
    })

    ipcRenderer.on(IPC_Events.UPDATE_WORKFLOW, (event, data) => {
      dispatch(workflow.actions.openWorkflowUpdatePopup(true));
    });

    ipcRenderer.on(IPC_Events.UPDATE_AND_SET_WORKFLOW, (event, data) => {
      dispatch(workflow.actions.updateWorkflowForCustomService(data));
    });
    ipcRenderer.on(IPC_Events.RESET_WORKFLOW, (event, data) => {
      dispatch(workflow.actions.resetWorkflowForCustomService());
    });

    ipcRenderer.on(IPC_Events.UPDATE_WIFI_ON_OFF_STATE, (event, data) => {
      dispatch(networkState.actions.updateWifiOnOffState(data));
    });

    ipcRenderer.on(IPC_Events.UPDATE_NETWORK_STATE, (event, data) => {
      dispatch(networkState.actions.updateNetworkState(data));
    });


    ipcRenderer.on(IPC_Events.UPDATE_DEVICE_CONFIG, (event, data) => {
      dispatch(settings.actions.enableDeviceConfigUpdatePopup(true));
    });

    ipcRenderer.on(IPC_Events.ON_PERMISSION_CHANGE, (event, data) => {
      dispatch(applicationState.actions.updateDevicePermission({ permissions: data.permissions }));
    });

    ipcRenderer.on(IPC_Events.ON_MEMORY_OVERLOAD, (event, data) => {
      dispatch(appState.actions.updateMemoryOverloadState({ isMemoryOverload: data }));
    });

    ipcRenderer.on(IPC_Events.ON_WORKFLOW_SYNC, (event, data) => {
      dispatch(workflow.actions.onWorkflowDonwloadSuccess(data));
      dispatch(applicationState.actions.updateDeviceModeAndPermission(data));
      dispatch(customWorkflow.actions.updateCustomServiceInfo(data));
    });

    ipcRenderer.on(IPC_Events.ON_OPERATOR_INFO_SYNC, (event, data) => {
      dispatch(userAuth.actions.updateUserLoginInfo(data));
    });

    ipcRenderer.on(IPC_Events.NAVIGATE_PAGE, (event, data) => {
      navigate(data.page);
    });

    ipcRenderer.on(IPC_Events.ON_NETWORK_CONNECT, (event, data) => {
      dispatch(userAuth.actions.autoRefreshLoginPage(true));
    });

    ipcRenderer.on(IPC_Events.ON_DEMO_MODE_MEASUREMENT_COMPLETE, (event, data) => {
      dispatch(applicationState.actions.updateDemoRemainingMeasureCount(data));
    });

    return () => {
      ipcRenderer.removeAllListeners();
    }

  }, [])

  return (
    <>
      {""}
    </>);
};

export default WorkflowEngine;
