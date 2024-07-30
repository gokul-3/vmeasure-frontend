import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require("electron");

export const getCalibrationRecords = async (page, rowsPerPage) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_CALIBRATION_RECORDS, {
            page: page, rows_per_page: rowsPerPage
        });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getSystemConfigLogRecords = async (page, rowsPerPage) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_SYS_CONFIG_LOG_RECORDS, {
            page: page, rows_per_page: rowsPerPage
        });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}


export const getMeasurementRecords = async (page, rowsPerPage) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_MEASUREMENT_RECORDS, {
            page: page, rows_per_page: rowsPerPage
        });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getAnnotationImage = async (measurement_id) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_MEASUREMENT_ANNOTATION_IMAGE, { measurement_id });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getTestMeasurementRecords = async (page, rowsPerPage) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_TEST_MEASUREMENT_RECORDS, {
            page: page, rows_per_page: rowsPerPage
        });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getBarcodeValidationLogs = async (page, rowsPerPage) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_BARCODE_VALIDATION_LOGS, {
            page: page, rows_per_page: rowsPerPage
        });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}


export const startDownloadLogs = async ({ count, logTypes, selectedUsb }) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.START_LOG_DOWNLOAD, { count, logTypes, selectedUsb });
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const getUSBDeviceList = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_LIST_OF_USB)
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}