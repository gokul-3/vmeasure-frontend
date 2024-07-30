import { IPC_Channel, DefaultErrorResult } from "../constants";
 
const { ipcRenderer } = window.require('electron')
export const getAvailablePrinters = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_PRINTER_AVAILABLE_LIST);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const getConfiguredPrinters = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_PRINTER_CONFIGURED_LIST);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const getAvailableManufacturer = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_PRINTER_MANUFACTURER);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const addNewPrinterConfig = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.ADD_LOCAL_PRINTER, arg);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const addNetworkPrinter = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.ADD_NETWORK_PRINTER, arg);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const getPrinterOption = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_PRINTING_OPTION, arg);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const setPrinterOptions = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_PRINTING_OPTION, arg);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const printPage = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.PRINT_PAGE,arg)
        return result
    } catch (error) {
        return { status: false, error: { message: "api_failed" } }
    }
}
 
export const printTestPage = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.PRINT_TEST_PAGE, arg);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const getAvailableDrivers = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_PRINTER_DRIVER, arg);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const getJobsDetails = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_PRINTER_ACTIVE_JOBS, arg);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const deletePrinter = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.DELETE_PRINTER, arg);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const cancelAllJobs = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CANCEL_ALL_PRINTER_JOB, arg);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const deleteJob = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.CANCEL_SINGLE_PRINTER_JOB, arg);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const setDefaultPrinter = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_DEFAULT_PRINTER, arg);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}
 
export const getDefaultPrinter = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_DEFAULT_PRINTER);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}

export const setPrinterFlowConfigService = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_ADDITIONAL_PRINTING_OPTIONS,arg)
        return result
    } catch (error) {
        return DefaultErrorResult;
    }
}