import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')


export const sendDeviceAuthResponse = async (response) => {
    try {
        ipcRenderer.sendSync(IPC_Channel.DEVICE_API_AUTH_RESPONSE,response);
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const sendDeviceAutoLoginResponse = async (response) => {
    try {
        ipcRenderer.sendSync(IPC_Channel.DEVICE_API_AUTO_LOGIN_RESPONSE,response);
    } catch (error) {
        return DefaultErrorResult;
    }
}


export  const forceUnpairDeviceApp = async () => {
    try {
       return await ipcRenderer.invoke(IPC_Channel.FORCE_UNPAIR_DEVICE_APP);
    } catch (error) {
        return DefaultErrorResult;
    }
}