import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const getNtpServerList = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_NTP_SERVER_LIST);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const setNtpServer = async (ntpServer) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_NTP_SERVER, ntpServer);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
