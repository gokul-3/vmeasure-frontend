import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron');

export const getDemoModeConfigs = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_DEMO_MODE_CONFIGS);
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}


export const revokeDemoMode = async () => {
    try {
        await ipcRenderer.invoke(IPC_Channel.REVOKE_DEMO_MODE);
        return
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const acceptDemoMode = async () => {
    try {
        await ipcRenderer.invoke(IPC_Channel.ACTIVATE_DEMO_MODE);
        return
    } catch (error) {
        return DefaultErrorResult;
    }
}