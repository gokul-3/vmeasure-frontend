import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const getScaleList = async (scaleRequest) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_SCALE_LIST, scaleRequest);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getCurrentScaleSettings = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_SELECTED_SCALE);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const setScaleSettings = async ({ weighing_scale_name, weighing_scale_minimum_weight, weighing_scale_unit }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_SCALE, {
            weighing_scale_name, weighing_scale_minimum_weight, weighing_scale_unit
        });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getSupportedUnits = async ({ weighing_scale_name }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_SCALE_SUPPORTED_UNIT, {
            scale_name: weighing_scale_name
        });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getIsScaleEnabled = async () => {
    try {
        return await ipcRenderer.invoke(IPC_Channel.GET_WEIGHING_SCALE_ENABLE_STATUS);
    } catch (error) {
        return false;
    }
}
