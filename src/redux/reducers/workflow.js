import { createSlice } from '@reduxjs/toolkit'
/**
 * workflow state has following details
 * ui_config:{}
 * pages:{}
 * mode:
 * trigger_source:
 */

const defaultWorkflow = {
  "additional_volume_data": {
    "is_cubic_volume_enabled": false,
    "is_real_volume_enabled": false
  },
  "additional_image": {
    "is_enabled": false,
    "title": "",
    "desc": "",
    "preview_timeout": 0,
    "is_skip_enabled": false,
    "is_capture_on_measurement": false,
    "additional_images_titles": []
  },
  "annotated_image_fields": {
    "is_show_barcode_value": false,
    "is_show_date_time": false,
    "is_show_volumetric_weight": false
  },
  "barcode_config": {
    "is_enabled": false,
    "barcode_text": "",
    "min_length": 0,
    "max_length": 0
  },
  "measurement_check": {
    "is_enabled": false,
    "is_cont_measurement_failure": false,
    "failed_measurement_count": 0,
    "is_dimension_out_of_spec": false,
    "is_on_zero_weight": false,
    "is_on_operator_login": false,
    "is_on_system_boot": false,
    "max_measurement_count": 0
  },
  "measurement_retry_count": 0,
  "measurement_trigger": {
    "is_enabled": false,
    "source": "Default",
    "delay_after_trigger": 0,
  },
  "support_trigger": {
    "is_weighing_scale_trigger_enabled": false,
    "wait_for_trigger": 0
  },
  "upload_mode": {
    "upload_mode": "synchronous",
    "retry_mode": "continuous_retry",
    "max_queue_size": 0
  },
  "volumetric_config": {
    "is_enabled": false,
    "volumetric_divisor": 5000,
    "is_standard_divisor": true,
    "dynamic_divisors": []
  },
  "workflow_mode": {
    "operate_mode": "master"
  },
  "ui_config": {
    "result_timeout": {
      "is_enabled": false,
      "timeout": 0,
      "is_skip_enabled": false
    },
    "additional_result": {
      "is_enabled": false,
      "field": ""
    },
    "measurement_reject": {
      "is_enabled": false
    },
    "custom_fields": {
      "is_reset_enabled": false,
      "fields": []
    },
    "dynamic_pages": null
  },
  "additional_barcode": {
    "is_enabled": false,
    "is_api_validation_enabled": false,
    "is_regex_validation_enabled": false
  },
  "calibration_config": {
    "is_auto_calibration": false,
    "is_manual_calibration": true,
    "calibration_method": {
      "is_1_1_E": true,
      "is_1_1": true,
      "is_1_5": true,
      "is_2_2": true
    }
  },
}

const initialState = {
  isLoading: false,
  error: null,
  status: false,
  addon_features: {
    bottle_mode: true,
  },
  workflow: {...defaultWorkflow},
  restricted_features: [],
  enablePopup: false,
}

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    clearWorkflow(state) {
      state.status = false;
      state.workflow = null;
      state.error = null;
    },
    onWorkflowDownloadStarted(state) {
      state.isLoading = true
      state.error = null
      state.status = false;
    },
    onWorkflowDonwloadSuccess(state, action) {
      state.isLoading = false;
      state.status = action.payload.status;
      if (action.payload.status) {
        state.workflow = action.payload.data.config;
        state.addon_features = action.payload.data.addon_features;
        state.restricted_features = action.payload.data.restricted_features;
      }
    },
    onWorkflowDownloadFailure(state, action) {
      state.isLoading = false;
      state.status = false;
      state.error = action.payload;
      state.workflow = null;
    },
    onWorkflowRestrictedConflicts(state, action) {
      state.isLoading = false;
      state.restricted_features = action.payload;
    },
    updateWorkflowUIconfigs(state, action) {
      state.workflow.ui_config = { ...state.workflow.ui_config, ...action.payload }
    },
    resetCustomWorkflowUIconfigs(state, action) {
      state.workflow.ui_config.custom_fields = {
        "is_reset_enabled": false,
        "fields": []
      }
    },
    updateWorkflowForCustomService(state,action){
      state.workflow = {...state.workflow,...action.payload}
    },
    resetWorkflowForCustomService(state,action){
      state.workflow = {...defaultWorkflow}
    },
    openWorkflowUpdatePopup(state, action) {
      state.enablePopup = action?.payload;
    },
    setAdditionalImage(state, action) {
      state.workflow.additional_image = { ...state.workflow.additional_image, ...action.payload }
    },
    resetAdditionalImage(state, action) {
      state.workflow.additional_image = {
        "is_enabled": false,
        "title": "",
        "desc": "",
        "preview_timeout": 0,
        "is_skip_enabled": false,
        "is_capture_on_measurement": false,
        "additional_images_titles": []
      }
    }
  },
})

const data = {
  actions: workflowSlice.actions,
  reducers: workflowSlice.reducer
}

export default data
