import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const getFrame = async (isWorkareaRect, isShowAnglePoints, is4KEnabled) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_FRAME, { is_work_area_rect: isWorkareaRect, is_show_angle_points: isShowAnglePoints, is4KEnabled });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getCaptureImage = async (params) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_CAPTURED_IMAGE, params);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
