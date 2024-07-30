import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // To maintain selected weighing scale
  weighing_scale: {
    weighing_scale_name: 'none',
    weighing_scale_unit: '',
    weighing_scale_minimum_weight: null,
    is_scale_detected: false,
    is_scale_detached: false,
    is_scale_connected: false,
    show_reconnect_popup: false, //state used to maintain the state of scale reconnect or detach pop up.
    scale_reconnect_with_error: false, //Reconnect detected but failure due to other reasons like negative weight
  },
  // To maintain selected barcode
  barcode: {
    barcode: 'none',
    is_barcode_connected: false
  },

  unit: {
    dimension_unit: 'cm',
    weight_unit: 'kg',
  },

  metrological: {
    metrological_setting: 'default',
    is_strict_mode_enabled: false
  },

  calibration: {
    calibration_setting: 'legacy',
    is_zero_weight_check: true
  },

  system_settings: {
    time_zone: 'Asia/Kolkata|+05:30',
    language: 'english',
    font_size: 'DEFAULT'
  },

  ntp_server_list: [],

  device_config_popup: false,

}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateBarcode(state, action) {
      state.barcode.barcode = action?.payload?.barcode_name;
      state.barcode.is_barcode_connected = Boolean(action?.payload?.is_barcode_connected);
    },
    updateScale(state, action) {
      console.error('action?.payload : ', JSON.stringify(action?.payload));
      state.weighing_scale.weighing_scale_name = action?.payload?.weighing_scale_name;
      state.weighing_scale.weighing_scale_unit = action?.payload?.weighing_scale_unit;
      state.weighing_scale.weighing_scale_minimum_weight = action?.payload?.weighing_scale_minimum_weight;
      state.weighing_scale.is_scale_connected = action?.payload?.is_connected;
    },
    updateUnits(state, action) {
      state.unit.dimension_unit = action.payload.dimension_unit
      state.unit.weight_unit = action.payload.weight_unit
    },
    updateScaleDetected(state, action) {
      state.weighing_scale.is_scale_detected = action.payload
      state.weighing_scale.is_scale_connected = (state.weighing_scale.is_scale_detected && !state.weighing_scale.is_scale_detached)
      state.weighing_scale.show_reconnect_popup = true
    },

    setScaleDetachedStatus(state, action) {
      state.weighing_scale.is_scale_detached = action.payload
      state.weighing_scale.is_scale_connected = (state.weighing_scale.is_scale_detected && !state.weighing_scale.is_scale_detached)
      state.weighing_scale.show_reconnect_popup = true
    },
    resetReconnectPopup(state, action) {
      // if true pop up appear, false popup disappear
      state.weighing_scale.show_reconnect_popup = false;
      state.weighing_scale.is_scale_detached = false;
      state.weighing_scale.is_scale_detected = false;
    },
    setScaleConnectionStatus(state, action) {
      state.weighing_scale.is_scale_connected = action.payload;
    },
    setReconnectWithError(state, action) {
      state.weighing_scale.scale_reconnect_with_error = action.payload
    },
    setNtpServerList(state, action) {
      state.ntp_server_list = action.payload
    },
    enableDeviceConfigUpdatePopup(state, action) {
      state.device_config_popup = action.payload
    },
    updateDeviceConfiguration(state, action) {
      if (action.payload.metrological) {
        state.metrological.metrological_setting = action.payload.metrological.metrological_setting;
        state.metrological.is_strict_mode_enabled = action.payload.metrological.is_strict_mode_enabled;
      }

      if (action.payload.calibration) {
        state.calibration.calibration_setting = action.payload.calibration.calibration_setting;
        state.calibration.is_zero_weight_check = action.payload.calibration.is_zero_weight_check;
      }

      if (action.payload.system_settings) {
        state.system_settings = { ...action.payload.system_settings };
      }

    }
  },
})

const settings = {
  actions: settingsSlice.actions,
  reducer: settingsSlice.reducer
}
export default settings