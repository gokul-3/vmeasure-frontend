import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const calibrateCamera = async (data) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CALIBRATE_CAMERA, data);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const isCalibrationDataQueueFull = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_CALIBRATION_IS_QUEUE_FULL);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }

}

export const getCalibrationData = async() => {
    try{
        const result = await ipcRenderer.invoke(IPC_Channel.GET_CALIBRATION_DATA);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}