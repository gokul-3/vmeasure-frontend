import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    device_camera_modes: {
        is_4k_available: false,
    },
    device_modes: {
        is_ntep_required: false,
    },
    device_test_modes: {
        is_endurance_testing_enabled: false,
        is_simulation_enabled: false
    },
    permissions: {
        restrict_operator: false,
    },
    font_size: "Default",
    isBlockingPopupOpened: false,
    trigger_service: {
        status: false,
        isPopupRequired: false,
        popupTimer: 0
    },
    demo_mode: {
        is_demo_mode_available: false,
        is_demo_mode_activated: false,
        show_demo_confirmation_popup: false,
        max_allowed_demo_measurements: 0,
        remaining_demo_measurements: 0
    }
}

const applicationStateSlice = createSlice({
    name: 'application-state',
    initialState,
    reducers: {
        updateDeviceModeAndPermission(state, { payload }) {
            state.device_modes.is_ntep_required = payload?.data?.device_certification_modes?.is_ntep_enabled;
            state.device_camera_modes.is_4k_available = payload?.data?.device_camera_modes?.is_4k_available;
            state.device_test_modes.is_endurance_testing_enabled = payload?.data?.device_endurance_test_modes?.is_endurance_testing_enabled;
            state.device_test_modes.is_simulation_enabled = payload?.data?.device_endurance_test_modes?.is_simulation_enabled;
            state.permissions = payload?.data?.permissions;
            state.trigger_service.status = payload?.data?.trigger_service_details?.status;
            state.trigger_service.isPopupRequired = payload?.data?.trigger_service_details?.isPopupRequired;
        },
        updateDevicePermission(state, { payload }) {
            state.permissions = payload?.permissions;
        },

        resetDeviceModeAndPermission(state) {
            state.device_modes.is_ntep_required = false;
            state.permissions = { restrict_operator: false };
        },
        updateFontSetting(state, { payload }) {
            state.font_size = payload
        },
        updateIsBlockingPopupOpened(state, { payload }) {
            state.isBlockingPopupOpened = payload
        },
        updateTriggerServicePopupTime(state, { payload }) {
            state.trigger_service.popupTimer = payload
        },
        updateDemoModeAvailableState(state, { payload }) {
            state.demo_mode.is_demo_mode_available = payload
        },
        updateDemoModeConfirmationPopup(state, { payload }) {
            state.demo_mode.show_demo_confirmation_popup = payload
        },
        updateDemoMeasureCounts(state, { payload }) {
            state.demo_mode.max_allowed_demo_measurements = payload.allowed
            state.demo_mode.remaining_demo_measurements = payload.remaining
        },
        updateDemoRemainingMeasureCount(state, { payload }) {
            state.demo_mode.remaining_demo_measurements = payload
        },
        updatedDemoModeActiveStatus(state, { payload }) {
            state.demo_mode.is_demo_mode_activated = payload
        }
    },
})

const applicationState = {
    actions: applicationStateSlice.actions,
    reducer: applicationStateSlice.reducer
}
export default applicationState