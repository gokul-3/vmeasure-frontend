import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const getTimezoneList = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_TIMEZONE_LIST);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getCurrentdTimezone = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_CURRENT_TIMEZONE);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const setTimezone = async ({ selectedTimezone }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_TIMEZONE, {
            selectedTimezone
        });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

