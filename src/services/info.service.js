import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const getSystemInfo = async (is_refetch) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_SYSTEM_INFO, { is_refetch });
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getSystemVersion = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_SYSTEM_VERSION);
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}
export const getSystemSerialNumber = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_SYSTEM_SERIAL_NUMBER);
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getDeviceAppPairStatus = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_DEVICE_APP_PREVIOUS_PAIR_STATUS);
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}


export const getSystemConfig = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_SYSTEM_CONFIG);
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getMeasurementRange = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_MEASUREMENT_RANGE);
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getDimensionPyramidData = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_DIMENSION_PYRAMID);
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const checkTimeSyncStatus = async (is_refetch) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CHECK_TIMESYNC_STATUS, { is_refetch });
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}

