import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const getProxyServerIP = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_PROXY_SERVER);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const setProxyServerIP = async (args) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_PROXY_SERVER, args);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}