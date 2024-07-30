import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as measurementService from '../../services/measurement.service'
import * as customService from '../../services/custom-workflow.service'
import { MeasurementPageReloadState, MeasurementState, ProcessingState } from '../../constants';
/**
 * This app state will be in sync with backend - workflow engine
 */

const initialState = {

  // To maintain whether user enable the bottle mode after login
  is_bottle_mode_enabled: false,

  is_bottle_mode: false,
  // To retain volumetric data values
  volumetric_divisor_name: null,

  // To maintain calibration state
  is_calibration_completed: false,

  // To maintain measurement check state and the reason for that
  is_measurement_check_needed: false,

  measurement_check_reason: null,
  // Measurement timer start or not. To show timer for external trigger 
  start_measurement_timer: false,
  // Measurement data. It will be in ResuleData format
  measurement_result: null,
  // Weather measurement is still going on or not
  is_measurement_processing: false,


  barcode_api_validation_failure: {},

  measurement_cont_upload_failure: {},

  measurement_state: { currentState: MeasurementState.INIT, processingState: ProcessingState.INIT, additionalInfo: null },

  is_measurement_retring: false,

  is_measurement_upload_cancelled: false,

  // This fill be used to retail custom fields and volumetric divisor
  retainable_fields: {},

  weighing_scale_trigger: {},

  is_weighing_scale_trigger_disabled: true,

  calibration_info: {},

  is_open_calibration_completed_popup: false,

  smart_measurement_trigger: {},

  is_smart_measurement_trigger_disabled: true,

  reload_measurement_page: MeasurementPageReloadState.RELOAD_NOT_REQUIRED,

  current_measurmement_page: null,

  additional_video_state: null,

  onchange_custom_field: "",

  is_measurement_flow_in_progress: false,

  show_demo_force_exit_popup: false,

  triggerServicePopup: {
    showTriggerPopup: false,
    status: false,
    title: null,
    statusIcon: null,
    content: null,
  }

}

const measureBox = createAsyncThunk(
  'measurement/start',
  async ({ volumetric_divisor, workflow_meta, custom_fields, is_bottle_mode }, { rejectWithValue }) => {
    try {
      return await measurementService.measureBox({ volumetric_divisor, workflow_meta, custom_fields, is_bottle_mode })
    } catch (error) {
      console.error("user logout reject", error)
      return rejectWithValue(error.message)
    }
  }
);

const measureReferenceBox = createAsyncThunk(
  'test-measurement/start',
  async ({ barcode_value, volumetric_divisor }, { rejectWithValue }) => {
    try {
      return await measurementService.measureReferenceBox({ barcode_value, volumetric_divisor })
    } catch (error) {
      console.error("user logout reject", error)
      return rejectWithValue(error.message)
    }
  }
);


const saveMeasurement = createAsyncThunk(
  'measurement/save',
  async ({ is_discard, additional_barcodes }, { rejectWithValue }) => {
    try {
      return await measurementService.saveMeasurement({ is_discard, additional_barcodes })
    } catch (error) {
      console.error("user logout reject", error)
      return rejectWithValue(error.message)
    }
  }
);

//uploading via custom workflow
const saveMeasurementViaCustom = createAsyncThunk(
  'measurement/save',
  async ({ is_discard, additional_barcodes, measurement_data }, { rejectWithValue }) => {
    try {
      return await customService.saveMeasurement({
        measurement_data,
        is_discard,
        additional_barcodes
      })
    } catch (error) {
      console.error("user logout reject", error)
      return rejectWithValue(error.message)
    }
  }
);

// Need to think about the cases
const cancelMeasurementUpload = createAsyncThunk(
  'measurement/cancel',
  async ({ }, { rejectWithValue }) => {
    try {
      await measurementService.cancelMeasurementUpload()
    } catch (error) {
      console.error("user logout reject", error)
      return rejectWithValue(error.message)
    }
  }
);

const validateMeasurementBarcode = createAsyncThunk(
  'measurement/barcode-validation',
  async ({ barcode }, { rejectWithValue }) => {
    try {
      await measurementService.validateBarcode(barcode)
    } catch (error) {
      console.error("user logout reject", error)
      return rejectWithValue(error.message)
    }
  }
);

const appStateSlice = createSlice({
  name: 'app_state',
  initialState,
  reducers: {
    updateCalibrationStatus(state, action) {
      state.is_calibration_completed = action?.payload?.is_calibration_completed;
      state.measurement_result = null;
    },

    updateCalibrationSuccess(state, action) {
      state.is_open_calibration_completed_popup = action?.payload;
    },

    updateMeasurementCheckState(state, action) {
      state.is_measurement_check_needed = action?.payload?.is_measurement_check_needed;
      state.measurement_check_reason = action?.payload?.measurement_check_reason;
    },

    updateMeasurementResult(state, action) {
      state.measurement_result = action?.payload;
    },

    resetMeasurementResult(state, action) {
      state.measurement_result = null;
    },

    startMeasurementTimer(state, action) {
      if (state.measurement_state.currentState === MeasurementState.PROCESS_COMPLETED ||
        state.measurement_state.currentState === MeasurementState.DONE
      ) {
        state.measurement_state.currentState = MeasurementState.INIT;
        state.measurement_state.processingState = ProcessingState.INIT;
        state.measurement_state.additionalInfo = null;
        state.measurement_result = null;
        state.is_measurement_upload_cancelled = false;
      }
      state.is_measurement_retring = false;
      state.retry_count = 0;
      state.start_measurement_timer = true;
      state.is_measurement_processing = true;
    },

    resetMeasurementTimer(state, action) {
      state.start_measurement_timer = false
    },

    startMeasurement(state, action) {
      state.is_measurement_processing = true;
    },

    clearMeasurementData(state, action) {
      if (action.payload.is_clear_all) {
        // This won't throws exception.
        measurementService.clearMeasurementData().catch((err) => { })
      }
      state.weighing_scale_trigger = null;
      state.measurement_result = null;
      state.is_measurement_processing = false;
      state.is_measurement_upload_cancelled = false;
      state.smart_measurement_trigger = null;
    },

    initMeasurementState(state, action) {
      state.measurement_state.currentState = MeasurementState.INIT;
      state.measurement_state.processingState = ProcessingState.INIT;
      state.measurement_state.additionalInfo = null;
      state.is_measurement_retring = false;
      state.retry_count = 0;
    },

    changeBottleMode(state, action) {
      state.is_bottle_mode = action?.payload?.is_bottle_mode;
      if (state.is_bottle_mode) {
        state.is_bottle_mode_enabled = true;
      }
    },

    updateVolumetricDivisor(state, action) {
      state.volumetric_divisor_name = action?.payload?.volumetric_divisor_name
    },

    emitBarcodeAPIValidationFailure(state, action) {
      state.barcode_api_validation_failure = action?.payload;
    },

    emitContMeasurementUploadFailure(state, action) {
      state.measurement_cont_upload_failure = action?.payload;
    },

    updateMeasurementState(state, action) {
      try {
        state.measurement_state.currentState = action?.payload?.currentState;
        state.measurement_state.processingState = action?.payload?.processingState;
        state.measurement_state.additionalInfo = { ...action?.payload?.additionalInfo };
      } catch (error) {
        console.error('error in updateMeasurementState redux : ', error)
      }
    },

    updateRetainableCustomFields(state, action) {
      state.retainable_fields[action.payload.key] = action?.payload?.value
    },

    updateMeasurementRetryState(state, action) {
      state.is_measurement_retring = true;
      state.retry_count = action?.payload?.retry_count;
    },

    resetRetainableFields(state, action) {
      state.retainable_fields = {};
      state.volumetric_divisor_name = null;
      state.is_bottle_mode = false;
      state.is_bottle_mode_enabled = false;
    },

    enableWeighingScaleTrigger(state, action) {
      if (state.is_weighing_scale_trigger_disabled) {
        state.weighing_scale_trigger = null;
        state.is_weighing_scale_trigger_disabled = false;
      }
      measurementService.enableWeighingScaleTrigger().catch(err => { })
    },

    disableWeighingScaleTrigger(state, action) {
      state.is_weighing_scale_trigger_disabled = true;
      measurementService.disableWeighingScaleTrigger().catch(err => { })
    },

    updateWeighingScaleTriggerState(state, action) {
      if (state.is_weighing_scale_trigger_disabled) {
        return;
      }
      state.weighing_scale_trigger = {
        state: action.payload.state,
        status_code: action.payload.status_code,
        error_msg: action.payload.error_msg
      }
    },

    setMeasurementResult(state, action) {
      state.measurement_result = action.payload;
    },

    cancelMeasurement(state, action) {
      measurementService.cancelMeasurement(action?.payload?.statusCode).catch(err => { })
      state.start_measurement_timer = false;
    },

    updateCalibrationInfo(state, action) {
      state.calibration_info = action?.payload;
    },

    enableSmartMeasurementTrigger(state, action) {
      if (state.is_smart_measurement_trigger_disabled) {
        state.smart_measurement_trigger = null;
        state.is_smart_measurement_trigger_disabled = false;
      }
      console.info('Enable smart measurement trigger');
      measurementService.enableSmartMeasurementTrigger().catch(err => { })
    },

    disableSmartMeasurementTrigger(state, action) {
      state.is_smart_measurement_trigger_disabled = true;
      console.info('Disabled smart measurement trigger');
      measurementService.disableSmartMeasurementTrigger().catch(err => { })
    },

    updateSmartMeasurementTrigger(state, action) {
      if (state.is_smart_trigger_measurement_disabled) {
        return;
      }
      state.smart_measurement_trigger = {
        state: action.payload.state,
        status_code: action.payload.status_code,
        error_msg: action.payload.error_msg
      }
    },

    updateMeasurementReloadState(state, action) {
      console.error('action.payload : ', action.payload)
      state.reload_measurement_page = action.payload;
    },

    updateCurrentMeasurementPage(state, action) {
      state.current_measurmement_page = action.payload;
    },

    updateAdditionalVideoState(state, action) {
      state.additional_video_state = action.payload;
    },

    updateMeasurementFlowInProgress(state, action) {
      state.is_measurement_flow_in_progress = action.payload;
    },
    resetTriggerServicePopup(state) {
      state.triggerServicePopup.showTriggerPopup = false;
      state.triggerServicePopup.status = false;
      state.triggerServicePopup.statusIcon = null;
      state.triggerServicePopup.title = null;
      state.triggerServicePopup.content = null;
      state.measurement_state.currentState = MeasurementState.PROCESS_COMPLETED;
    }

  },
  extraReducers: (builder) => {
    builder

      .addCase(validateMeasurementBarcode.pending, (state) => {
        state.measurement_state.currentState = MeasurementState.BARCODE_VALIDATE;
        state.measurement_state.processingState = ProcessingState.IN_PROGRESS;
        state.measurement_result = null
      })
      .addCase(validateMeasurementBarcode.fulfilled, (state, { payload }) => {
        state.measurement_state.currentState = MeasurementState.BARCODE_VALIDATE;
        state.measurement_state.processingState = payload?.status ? ProcessingState.SUCCEED : ProcessingState.FAILED;
        state.measurement_result = payload
      })
      .addCase(validateMeasurementBarcode.rejected, (state, { payload }) => {
        state.measurement_state.currentState = MeasurementState.BARCODE_VALIDATE;
        state.measurement_state.processingState = ProcessingState.FAILED;
        state.measurement_result = payload
      })


      .addCase(measureBox.pending, (state) => {
        state.is_measurement_processing = true;
        state.is_measurement_retring = false;
        state.measurement_state.currentState = MeasurementState.MEASUREMENT;
        state.measurement_state.processingState = ProcessingState.IN_PROGRESS;
        state.measurement_result = null
      })
      .addCase(measureBox.fulfilled, (state, { payload }) => {
        state.is_measurement_retring = false;
        state.retry_count = 0;
        state.measurement_state.currentState = MeasurementState.MEASUREMENT;
        state.measurement_state.processingState = payload.status ? ProcessingState.SUCCEED : ProcessingState.FAILED;
        state.measurement_state.additionalInfo = payload?.data?.measurement?.additional_info;
        state.measurement_result = payload
        state.start_measurement_timer = false;
        state.weighing_scale_trigger = null;
        state.smart_measurement_trigger = null;
      })
      .addCase(measureBox.rejected, (state, { payload }) => {
        state.measurement_state.currentState = MeasurementState.MEASUREMENT;
        state.measurement_state.processingState = ProcessingState.FAILED;
        state.measurement_result = payload
      })

      .addCase(saveMeasurement.pending, (state) => {
        state.measurement_state.currentState = MeasurementState.MEASUREMENT_UPLOAD;
        state.measurement_state.processingState = ProcessingState.IN_PROGRESS;
        state.measurement_state.additionalInfo = {}
      })
      .addCase(saveMeasurement.fulfilled, (state, { payload }) => {
        if (!state.is_measurement_upload_cancelled) {
          state.measurement_state.currentState = MeasurementState.MEASUREMENT_UPLOAD;
          state.measurement_state.processingState =
            payload.status ? ProcessingState.SUCCEED : ProcessingState.FAILED;
          state.measurement_state.additionalInfo = {
            displayMessage: payload?.data?.message || payload?.error?.message
          }
          if(payload?.isDemoModeForceExitRequired){
            state.show_demo_force_exit_popup = true
          }
          if (payload?.triggerServiceWriteStatus && Object.keys(payload?.triggerServiceWriteStatus).length && payload?.triggerServiceWriteStatus?.showTriggerPopup) {
            state.triggerServicePopup.showTriggerPopup = payload?.triggerServiceWriteStatus?.showTriggerPopup;
            state.triggerServicePopup.status = payload?.triggerServiceWriteStatus?.status;
            state.triggerServicePopup.statusIcon = payload?.triggerServiceWriteStatus?.statusIcon;
            state.triggerServicePopup.title = payload?.triggerServiceWriteStatus?.title;
            state.triggerServicePopup.content = payload?.triggerServiceWriteStatus?.content;
          }
        }
      })
      .addCase(saveMeasurement.rejected, (state, { payload }) => {
        if (!state.is_measurement_upload_cancelled) {
          state.measurement_state.currentState = MeasurementState.MEASUREMENT_UPLOAD;
          state.measurement_state.processingState = ProcessingState.FAILED;
          state.measurement_state.additionalInfo = {
            displayMessage: payload?.error?.message
          }
        }
      })

      .addCase(cancelMeasurementUpload.pending, (state) => {
        state.measurement_state.currentState = MeasurementState.MEASUREMENT_DISCARD;
        state.measurement_state.processingState = ProcessingState.IN_PROGRESS;
        state.measurement_state.additionalInfo = null;
      })
      .addCase(cancelMeasurementUpload.fulfilled, (state, { payload }) => {
        state.is_measurement_upload_cancelled = true;
        state.measurement_state.currentState = MeasurementState.MEASUREMENT_DISCARD;
        state.measurement_state.processingState = ProcessingState.SUCCEED;
        state.measurement_state.additionalInfo = null;
      })
      .addCase(cancelMeasurementUpload.rejected, (state, { payload }) => {
        state.measurement_state.currentState = MeasurementState.MEASUREMENT_DISCARD;
        state.measurement_state.processingState = ProcessingState.FAILED;
        state.measurement_state.additionalInfo = null;
      })


      .addCase(measureReferenceBox.pending, (state) => {
        state.measurement_state.currentState = MeasurementState.TEST_MEASUREMENT;
        state.measurement_state.processingState = ProcessingState.IN_PROGRESS;
        state.measurement_result = null
      })
      .addCase(measureReferenceBox.fulfilled, (state, { payload }) => {
        state.measurement_state.currentState = MeasurementState.TEST_MEASUREMENT;
        state.measurement_state.processingState = payload.status ? ProcessingState.SUCCEED : ProcessingState.FAILED;
        state.measurement_result = payload;
        state.weighing_scale_trigger = null;
        state.smart_measurement_trigger = null;
      })
      .addCase(measureReferenceBox.rejected, (state, { payload }) => {
        state.measurement_state.currentState = MeasurementState.TEST_MEASUREMENT;
        state.measurement_state.processingState = ProcessingState.FAILED;
        state.measurement_result = payload;
        state.weighing_scale_trigger = null;
        state.smart_measurement_trigger = null;
      })


  }
})

const data = {
  actions: appStateSlice.actions,
  reducer: appStateSlice.reducer,
  extraActions: {
    measureBox,
    validateMeasurementBarcode,
    saveMeasurement,
    cancelMeasurementUpload,
    measureReferenceBox,
    saveMeasurementViaCustom
  }
}
export default data
