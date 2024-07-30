import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const getBarcodeList = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_BARCODE_LIST);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getSelectedBarcode = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_SELECTED_BARCODE);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const setBarcode = async ({ barcode_name }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_BARCODE, {
            barcode_name
        });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

