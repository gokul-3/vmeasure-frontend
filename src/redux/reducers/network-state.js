import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    wifi: {
        is_enabled: false,
        is_connected: false,
        has_internet: false
    },
    ethernet: {
        is_connected: false,
        has_internet: false
    }
}

const networkStateSlice = createSlice({
    name: 'network-state',
    initialState,
    reducers: {

        updateNetworkState(state, { payload }) {
            if (payload.ifacetype === 'ethernet') {
                state.ethernet.is_connected = payload.is_connected;
                state.ethernet.has_internet = payload.has_internet;
            } else {
                state.wifi.is_connected = payload.is_connected;
                state.wifi.has_internet = payload.has_internet;
            }

        },

        updateWifiOnOffState(state, { payload }) {
            state.wifi.is_enabled = payload.is_wifi_on;
        }
    }
})

const networkState = {
    actions: networkStateSlice.actions,
    reducer: networkStateSlice.reducer
}

export default networkState;