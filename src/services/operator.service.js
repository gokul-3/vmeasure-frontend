import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')


export const getOperatorList = async ({ is_refresh }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_OPERATORS, { is_refresh });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const validateOperatorPIN = async ({ id, pin }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.VALIDATE_PIN, { id, pin });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const logoutOperatorSession = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.LOGOUT_OPERATOR);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

