import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const checkForUpdates = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CHECK_FOR_UPDATES);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const startSoftwareUpdateDownloadProcess = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.START_DOWNLOADING_UPDATES);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}


export const startPreValidation = async (serviceData) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.START_SOFTWARE_PREVALIDATION,serviceData);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
