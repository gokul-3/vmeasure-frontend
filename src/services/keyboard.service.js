import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require("electron");

export const openOnboardKeyboard = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.OPEN_VIRTUAL_KEYBOARD);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
export const toggleOnboardKeyboard = async () => {
    try{
        const result = await ipcRenderer.invoke(IPC_Channel.TOGGLE_VIRTUAL_KEYBOARD);
        return result;
    } catch(error) {
        return DefaultErrorResult;
    }
}
export const closeOnboardKeyboard = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CLOSE_VIRTUAL_KEYBOARD);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}