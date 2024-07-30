import { IPC_Channel, DefaultErrorResult } from '../constants';
import { addCustomFlowTranslation } from './custom-workflow.service';
const { ipcRenderer } = window.require('electron')

export const downloadWorkflow = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.DOWNLOAD_AND_GET_WORKFLOW);
        addCustomFlowTranslation(result.data.custom_service_translation)
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const resetWorkflow = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.RESET_WORKFLOW);
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}