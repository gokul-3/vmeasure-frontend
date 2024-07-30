import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')


export const connectionAvailability = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CHECK_FOR_CONNECTION_AVAILABILITY);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const internetAvailability = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CHECK_FOR_INTERNET_AVAILABILITY);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const forgeCommunication = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CHECK_FOR_FORGE_COMMUNICATION);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const websocketCommunication = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CHECK_FOR_WEBSOCKET_COMMUNICATION);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const downloadSpeed = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CHECK_FOR_DOWNLOAD_SPEED);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const uploadSpeed = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CHECK_FOR_UPLOAD_SPEED);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}