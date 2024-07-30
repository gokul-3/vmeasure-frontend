import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

export const validateBarcode = async (barcode) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.VALIDATE_BARCODE, { barcode });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const validateReferenceBoxBarcode = async (barcode) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.VALIDATE_REFERENCE_BOX_BARCODE, { barcode });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const cancelBarcodeValidate = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CANCEL_VALIDATE_BARCODE);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const measureReferenceBox = async ({ barcode_value, volumetric_divisor }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.MEASURE_REFERENCE_BOX, {
            barcode_value,
            volumetric_divisor_name: volumetric_divisor?.name,
            volumetric_divisor_value: volumetric_divisor?.volumetric_divisor
        })
        return result;
    } catch (error) {
        console.error(error)
        return DefaultErrorResult;
    }
}

export const measureBox = async ({ workflow_meta, custom_fields, is_bottle_mode, volumetric_divisor }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.MEASURE_BOX, {
            workflow_meta,
            custom_fields,
            is_bottle_mode,
            volumetric_divisor_name: volumetric_divisor?.name,
            volumetric_divisor_value: volumetric_divisor?.volumetric_divisor//value
        });
        return result;
    } catch (error) {
        console.error(error)
        return DefaultErrorResult;
    }
}

export const saveMeasurement = async ({ is_discard, additional_barcodes }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SAVE_MEASUREMENT, { is_discard, additional_barcodes });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const cancelMeasurementUpload = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CANCEL_MEASUREMENT_UPLOAD);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const addAdditionalImagesData = async (list) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.ADD_ADDITIONAL_IMAGES);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}


export const getAnnotatedImage = async (filename) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_ANNOTATED_IMAGE, { filename });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const validateAdditionalBarcode = async (barcode) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.VALIDATE_ADDITIONAL_BARCODE, { barcode });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const saveAdditionalImage = async (imageData) => {

    try {
        const result = await ipcRenderer.invoke(IPC_Channel.ADD_ADDITIONAL_IMAGES, imageData);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }

}
export const saveAdditionalVideo = async (state) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.ADD_ADDITIONAL_VIDEO, state);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const isMeasurementDataQueueFull = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_MEASUREMENT_IS_QUEUE_FULL);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }

}

export const clearMeasurementData = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CLEAR_MEASUREMENT_DATA);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const deleteAdditionalVideo = async (status) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.DELETE_ADDITIONAL_VIDEO, status);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const checkRefBoxCondition = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CHECK_REFBOX_CONDITION);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const enableWeighingScaleTrigger = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.ENABLE_WEIGING_SCALE_TRIGGER);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const disableWeighingScaleTrigger = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.DISABLE_WEIGING_SCALE_TRIGGER);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const cancelMeasurement = async (data) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CANCEL_MEASUREMENT, data);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const isMeasurementFlowInprogress = async (data) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_IS_MEASUREMENT_FLOW_INPROGRESS, data);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const discardMeasurementData = async (data) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.DISCARD_MEASUREMENT_DATA, data);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const displayScaleReconnectPopup = async (isMeasurePage = false) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.DISPLAY_SCALE_RECONNECT_POPUP, isMeasurePage);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const enableSmartMeasurementTrigger = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.ENABLE_SMART_MEASUREMENT_TRIGGER);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const disableSmartMeasurementTrigger = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.DISABLE_SMART_MEASUREMENT_TRIGGER);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const playAudio = async (status = 'failure') => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.PLAY_AUDIO, status);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}