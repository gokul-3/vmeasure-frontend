import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const getSelectedUnit = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_SELECTED_UNIT);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const setUnit = async ({ dimension_unit, weight_unit }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_UNIT, {
            dimension_unit, weight_unit
        });
        console.log(result)
        return result;
    } catch (error) {
        console.error("ERROR IN SET UNIT", error)
        return DefaultErrorResult;
    }
}

