import { IPC_Channel, DefaultErrorResult } from '../constants';
const { ipcRenderer } = window.require('electron')

//network information calls
export const getMacDetails = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_MAC_DETAILS)
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

export const getEthernetIPDetails = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_ETHERNET_IP_DETAILS, arg)
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

export const getWifiIPDetails = async (arg) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_WIFI_IP_DETAILS, arg)
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}
//ethernet settings
export const getEthernetConfigs = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_ETHERNET_CONFIGS);
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

export const setEthernetConfigs = async (args) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_ETHERNET_CONFIGS, args);
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

//wifi Settings 
export const getWifiConfigs = async (args) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_WIFI_CONFIGS, args);
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

export const setWifiConfigs = async (args) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_WIFI_IP_CONFIGS, args);
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

export const getWifiNetwork = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_WIFI_NETWORK_LIST);
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

export const getSSID = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_CURRENT_SSID);
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

export const getConnectionStatus = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_WIFI_CONNECTION_STATUS);
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

export const setWifiNetwork = async (args) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_WIFI_CONFIG, args);
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

export const setEnterpriseNetwork = async (args) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_ENTERPRISE_NETWORK, args);
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

export const setForgetCnx = async (args) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.FORGET_WIFI_CONNECTION, args);
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

export const setWifiState = async (args) => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.SET_WIFI_STATE, args);
        return result
    } catch (error) {
        return DefaultErrorResult
    }
}

export const getWiFiNetworkInfo = async () => {
    try {
        const result = await ipcRenderer.invoke(IPC_Channel.GET_WIFI_NETWORK_SIGNAL);
        return result;
    } catch (error) {
        return DefaultErrorResult;
    }
}