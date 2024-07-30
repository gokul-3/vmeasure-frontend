import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')


export const rebootDevice = async (reason) => {
    try {
        ipcRenderer.invoke(IPC_Channel.REBOOT_DEVICE, reason);
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const updateCurrentPageChange = async (page) => {
    try {
        const result = ipcRenderer.invoke(IPC_Channel.HANDLE_PAGE_CHANGE, page);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
