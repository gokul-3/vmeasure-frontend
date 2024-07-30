import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')
export const getMoment = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_MOMENT);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}