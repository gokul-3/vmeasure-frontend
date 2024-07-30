import { configureStore } from "@reduxjs/toolkit";
import snackbar from './reducers/snackbar';
import userAuth from './reducers/user-auth';
import barcodeScan from './reducers/barcode-scan';
import measurementReadyState from './reducers/measurement-states';
import workflowDownload from './reducers/workflow';
import settings from './reducers/settings'
import keyboard from './reducers/keyboard'
import keyboardState from './reducers/keyboardStates'
import softwareUpdate from "./reducers/software-update"
import externalInput from './reducers/external-input'
import deviceAPI from "./reducers/device-api"
import customWorkflow from "./reducers/custom-workflow"
import navigationSlice from './reducers/nav-bar-controller'
import dynamicPageFieldValues from './reducers/dynamic-page-field-values'
import applicationState from "./reducers/application-state"
import virtualKeyboard from "./reducers/virtual-keyboard";
import customFlow from "./reducers/custom-workflow";
import networkState from "./reducers/network-state";

export const store = configureStore({
  reducer: {
    snackbar: snackbar.reducer,
    userAuth: userAuth.reducers,
    barcodeScan: barcodeScan.reducer,
    appState: measurementReadyState.reducer,
    workflow: workflowDownload.reducers,
    settings: settings.reducer,
    externalInput: externalInput.reducer,
    deviceAPI: deviceAPI.reducer,
    customWorkflow: customWorkflow.reducers,
    keyboard: keyboard.reducer,
    keyboardState: keyboardState.reducer,
    softwareUpdate: softwareUpdate.reducer,
    navigation: navigationSlice.reducer,
    dynamicPageFieldValues: dynamicPageFieldValues.reducer,
    applicationState: applicationState.reducer,
    virtualKeyboard: virtualKeyboard.reducer,
    customFlow: customFlow.reducers,
    networkState: networkState.reducer
  },
});
