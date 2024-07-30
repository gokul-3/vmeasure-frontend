import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')


export const getMetroLogicalSettings = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_METRO_LOGICAL_SETTINGS);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const setMetroLogicalSettings = async ({ metrological_setting, is_strict_mode_enabled }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_METRO_LOGICAL_SETTINGS, { metrological_setting, is_strict_mode_enabled });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getCalibrationSettings = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_CALIBRATION_SETTINGS);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const setCalibrationSettings = async ({ calibration_setting, is_zero_weight_check }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_CALIBRATION_SETTINGS, {
            calibration_setting, is_zero_weight_check
        });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const loadLanguageSettings = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.LOAD_LANGUAGE_SETTIGNS);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getLanguageSettings = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_LANGUAGE_SETTINGS);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const setLanguageSettings = async (data) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_LANGUAGE_SETTINGS, data);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}