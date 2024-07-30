import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const syncDeviceConfigs = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SYNC_DEVICE_CONFIG);
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}