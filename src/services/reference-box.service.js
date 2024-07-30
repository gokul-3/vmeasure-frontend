import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const getReferenceBoxList = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_REFERENCE_BOX_LIST);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getMeasureCountAfterReferenceBox = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_REFERENCE_BOX_MEASURE_COUNT_DATA);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
