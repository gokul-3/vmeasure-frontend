import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Grid,
  useTheme,
  Typography,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux'
import { BarcodeDataCategory, MeasurementTriggerSrc, MeasurementBackgroundColor, MeasurementState, SyncRetryMode, ProcessingState, MeasurementStateInfoReason, ObjectTpe, Certificates, SmartMeasurementTriggerState, ExternalInputs, TimeoutStateInfoReason, AudioStatus } from "../../constants";
import { cancelBarcodeValidate, clearMeasurementData, getAnnotatedImage, validateBarcode, validateReferenceBoxBarcode, checkRefBoxCondition, discardMeasurementData, playAudio } from "../../services/measurement.service";
import appState from "../../redux/reducers/measurement-states";
import MeasurementTriggerTimer from "./components/measurement-trigger-timer";
import MeasurementDiscardTimer from "./components/measurement-discard-timer";
import DimensionInfoArea from "./components/dimension-info-area";
import WeightInfoArea from "./components/weight-info-area";
import { useTranslation } from 'react-i18next';
import VideoStream from "../../components/video-stream/video-stream";
import VolumetricDivisor from "./components/volumentric-divisor";
import BarcodeField from "./components/barcode-field";
import MeasurementClearTimer from "./components/measurement-clear-timer";
import MeasurementPageCustomField from "./components/measurement-page-custom-field";
import AdditionalBarcode from "./components/additional-barcodes";
import AdditionalResultData from "./components/additional-data";
import MeasurementInfo from "./components/measurement-info";
import BarcodeValidationRetry from "./components/barcode-validation-retry";
import WhiteAnnotatedImage from '../../assets/images/white-annotated.jpg'
import MeasurementUploadRetry from "./components/measurement-upload-retry";
import QRPopup from "./components/qr-popup";
import navigationController from "../../redux/reducers/nav-bar-controller";
import BottleMode from "./components/bottle-mode";
import MeasurementDuration from "./components/measurement-duration";
import { useKeyboard } from "../../hooks/useKeyboard";
import { ObjectTypeIcon } from "./components/object-type-icon";
import { NTEPModeIcon } from "./components/ntep-icon";
import { TriggerServicePopup } from "./components/trigger-service-popup";
import { DemoModeForceExitPopup } from "./components/demo-mode-force-exit";

const VIDEO_HEIGHT = '72vh'
const WORK_AREA_SPACING = 6;
const VIDEO_STREAM_GRID_WIDTH = '32%';
const CONTENT_GRID_WIDTH = '68%';

function MeasurementPage({ onAction, dynamicPageData = {}, onMeasurementClearStateStarted, onMeasurementProcessCompleted, barcodeValue = null }) {

  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [volumetricDivisor, setVolumetricDivisor] = useState(null);

  const [videoStreamProps, setVideoStreamProps] = useState({
    isStreamEnabled: true,
    isShowExternalImage: false,
    externalImage: null
  });

  const [barcodeFieldProps, setBarcodeFieldProps] = useState({
    value: '',
    showError: false,
    error: ''
  });

  const [barcodeValidateRetry, setBarcodeValidateRetry] = useState({
    open: false,
    reason: ''
  })

  const [measurementUploadRetry, setMeasurementUploadRetry] = useState({
    open: false,
    message: ''
  })

  // Measurement page should be disable if barcode is not selected for barcode trigger mode
  const [disablePage, setDisablePage] = useState(false);

  const [volumetricDivisorError, setVolumetricDivisorError] = useState(false);

  const [additionalBarcodeFieldProps, setAdditionalBarcodeFieldProps] = useState('');

  const [highlightedField, setHighlightedField] = useState();

  const [videoStreamWidth, setVideoStreamWidth] = useState('100%');

  const [backgroundColor, setBackgroundColor] = useState(MeasurementBackgroundColor.DEFAULT);

  const [customFieldBarcodeScan, setCustomFieldBarcodeScan] = useState(null);

  const [customFields, setCustomFields] = useState({});

  const [disableAdditionalFields, setDisableAdditionalFields] = useState(false);

  const [showKeyboard, hideKeyboard] = useKeyboard();

  const [isMeasureBoxCompleted, setIsMeasureBoxCompleted] = useState(false);

  const [streamBackgroundColor, setStreamBackgroundColor] = useState(MeasurementBackgroundColor.DEFAULT);

  const isFirstCall = useRef({
    isValidationCall: true,
  })

  const barcodeValueProps = useRef({
    currentValue: '',
    isFirst: true,
    isRefBox: false
  });

  const additionalBarcode = useRef([]);

  const [isReferenceBoxMeasurement, setIsReferenceBoxMeasurement] = useState(false);

  const {
    value: barcodeScanValue,
    category: barcodeCategory,
    counter: barcodeCount
  } = useSelector((state) => state.barcodeScan);

  useEffect(() => {
    if (barcodeValue) {
      setBarcodeFieldProps({ value: barcodeValue })
    }
  }, [barcodeValue])

  const { metrological_setting } = useSelector((state) => state.settings.metrological);

  const {
    is_measurement_check_needed,
    measurement_check_reason,
    measurement_cont_upload_failure,
    measurement_result,
    measurement_state,
    barcode_api_validation_failure,
    is_bottle_mode,
    weighing_scale_trigger,
    smart_measurement_trigger,
    triggerServicePopup,
    show_demo_force_exit_popup
  } = useSelector((state) => state.appState);

  const { workflow, addon_features, enablePopup } = useSelector((state) => state.workflow);

  const { name: barcode_name, is_barcode_connected } = useSelector((state) => state.settings.barcode);
  const { name: weighing_scale } = useSelector((state) => state.settings.weighing_scale);

  const { value: externalInputValue, counter: externalInputCounter } = useSelector((state) => state.externalInput);

  const { trigger_service, demo_mode } = useSelector((state) => state.applicationState)

  const handleBarcodeChange = (value) => {
    barcodeValueProps.current.currentValue = value;
    setBarcodeFieldProps({
      value: value
    });
  }

  /**
   * This function will check whether all required custom fields are filled or not
   * @returns true, is all fields were filled
   */
  const isRequiredCustomFieldsFilled = () => {
    if (workflow.ui_config?.custom_fields.length === 0) {
      return true;
    }

    const result = {
      isRequiredFilled: true,
      isRegexPassed: true,
      failedRegexField: null
    }

    workflow.ui_config?.custom_fields.fields.forEach((field) => {
      if (field.is_mandatory && !customFields[field.key]) {
        result.isRequiredFilled = false;
      }

      if (field.is_mandatory && field.type === "Text" && field.regex_pattern !== '' && customFields[field.key] && typeof field.regex_pattern === 'string') {
        const regexPattern = new RegExp(field.regex_pattern);
        if (!regexPattern.test(customFields[field.key])) {
          result.isRegexPassed = false;
          result.failedRegexField = result.failedRegexField ?? field.key;
        }
      }

    })

    return result;
  }

  const isRequiredCustomTextFieldsFilled = () => {
    if (workflow.ui_config?.custom_fields.length === 0) {
      return true;
    }
    let isvalid = true;

    workflow.ui_config?.custom_fields.fields.forEach((field) => {
      if (field.is_mandatory && !customFields[field.key] && field.type == 'Text') {
        isvalid = false;
      }
    })

    return isvalid && isRequiredCustomFieldsFilled().isRegexPassed;
  }


  /**
   * This function will validate volumetric divisor and custom fields and change the state wrt that
   * @returns 
   */
  const getPreValidationResult = () => {

    if (barcodeValueProps.current.isRefBox) {
      return true;
    }

    // If volumetric divisor is not selected, show the warning message
    if (workflow?.volumetric_config?.is_enabled && !workflow?.volumetric_config?.is_standard_divisor && !volumetricDivisor) {
      dispatch(appState.actions.updateMeasurementState({
        currentState: MeasurementState.INIT,
        processingState: ProcessingState.FAILED,
        additionalInfo: { reason: MeasurementStateInfoReason.VOLUMETRIC_DIVISOR_REQUIRED }
      }));
      return false;
    }

    const result = isRequiredCustomFieldsFilled();

    // If required custom fields are not filled show the error messages.
    if (workflow?.ui_config?.custom_fields?.fields?.length && (!result.isRequiredFilled || !result.isRegexPassed)) {

      let reason = null;
      let regexField = null;

      for (let field of workflow.ui_config.custom_fields.fields) {
        if (field.is_mandatory && !customFields[field.key]) {
          reason = MeasurementStateInfoReason.CUSTOM_FIELD_REQUIRED
          break;
        } else if (field.is_mandatory && result.failedRegexField === field.key) {
          reason = MeasurementStateInfoReason.REGEX_VALIDATION_FAILED;
          regexField = field.key
          break;
        }
      }

      dispatch(appState.actions.updateMeasurementState({
        currentState: MeasurementState.INIT,
        processingState: ProcessingState.FAILED,
        additionalInfo: {
          reason: reason,
          regexField: regexField
        }
      }));
      return false;
    }

    return true;
  }

  const handleBarcodeScan = () => {

    // If additional barcode dialog is open, send the detail to it
    if (measurement_state.currentState === MeasurementState.ADDITIONAL_BARCODE) {
      setAdditionalBarcodeFieldProps({
        value: barcodeScanValue,
        counter: barcodeCount,
        category: BarcodeDataCategory.SCAN_VALUE
      });
      return;
    }

    // If workflow notification popup in enabled in device restrict update scanned barcode value

    if (enablePopup) {
      return;
    }

    if (workflow.measurement_trigger?.source === MeasurementTriggerSrc.REMOTE) {
      barcodeValueProps.current.currentValue = barcodeScanValue;
      barcodeValueProps.current.isRefBox = false;
      setBarcodeFieldProps({
        error: null,
        showError: false,
        value: barcodeScanValue
      });
    }

    // If measurement is not in init state or barcode validate init state 
    // no need to process the barcode
    if (!(measurement_state.currentState === MeasurementState.INIT || (
      measurement_state.currentState == MeasurementState.BARCODE_VALIDATE &&
      measurement_state.processingState == ProcessingState.INIT
    ))) {
      return;
    }

    /**
     * Case 1: Validate custom fields. 
     * If validation fails, 
     *      update the barcode value in required text fields
     *      If there is no text field available then emit the error 
     * If validation success,
     *      then we can proceed.
     */

    if (!isRequiredCustomTextFieldsFilled()) {
      setCustomFieldBarcodeScan({ value: barcodeScanValue, counter: barcodeCount });
      return
    }

    if (!getPreValidationResult()) {
      return;
    }

    // If custom fields are filled, set the BarcodeText value
    barcodeValueProps.current.currentValue = barcodeScanValue;
    barcodeValueProps.current.isRefBox = false;
    setBarcodeFieldProps({
      error: null,
      showError: false,
      value: barcodeScanValue
    });

    // Handle Measurement flow

    dispatch(appState.actions.updateMeasurementState({
      currentState: MeasurementState.BARCODE_VALIDATE,
      processingState: ProcessingState.INIT
    }));

  }

  const handleReferenceBoxBarcodeValidation = async () => {

    // Start barcode validation by change the processing state 
    dispatch(appState.actions.updateMeasurementState({
      currentState: MeasurementState.BARCODE_VALIDATE,
      processingState: ProcessingState.IN_PROGRESS,
      additionalInfo: {}
    }));

    const validationResult = await validateReferenceBoxBarcode(barcodeValueProps.current.currentValue)

    dispatch(appState.actions.updateMeasurementState({
      currentState: MeasurementState.BARCODE_VALIDATE,
      processingState: validationResult?.status ? ProcessingState.SUCCEED : ProcessingState.FAILED,
      additionalInfo: {
        reason: validationResult?.status ? MeasurementStateInfoReason.BARCODE_SUCCESS : MeasurementStateInfoReason.BARCODE_FAILED,
        error: validationResult?.error?.message,
      }
    }));
  }

  /**
   * This function used to validate barcode validation
   * This function will change the processing state of MeasurementState.BARCODE_VALIDATE
   * @returns 
   */
  const handleBarcodeValidation = async () => {
    try {

      if (barcodeValueProps.current.isRefBox) {
        await handleReferenceBoxBarcodeValidation()
        return;
      }

      if (!getPreValidationResult()) {
        return;
      }

      if (measurement_state.currentState > MeasurementState.BARCODE_VALIDATE) {
        return;
      }

      // Start barcode validation by change the processing state 
      dispatch(appState.actions.updateMeasurementState({
        currentState: MeasurementState.BARCODE_VALIDATE,
        processingState: ProcessingState.IN_PROGRESS,
        additionalInfo: {}
      }));

      const validationResult = await validateBarcode(barcodeValueProps.current.currentValue);

      setBarcodeValidateRetry({ open: false, reason: '' });

      // This case wil executed only for Entering barcode value manually
      if (validationResult?.data?.is_reference_box) {
        // handleReferenceBoxBarcodeValidation().catch((err)=>{
        //   console.log(err)
        // })
        setBackgroundColor(MeasurementBackgroundColor.MEASUREMENT_CHECK);
        barcodeValueProps.current.isRefBox = true;
        setIsReferenceBoxMeasurement(true);
        handleReferenceBoxBarcodeValidation();
        return;

      }

      // For successfull barcode validation change the processing state to success
      // Otherwise change it to failed. 
      // Further actions will taken care by handleMeasurementStateChange
      dispatch(appState.actions.updateMeasurementState({
        currentState: MeasurementState.BARCODE_VALIDATE,
        processingState: validationResult?.status ? ProcessingState.SUCCEED : ProcessingState.FAILED,
        additionalInfo: {
          reason: validationResult?.status ? MeasurementStateInfoReason.BARCODE_SUCCESS : MeasurementStateInfoReason.BARCODE_FAILED,
          error: validationResult?.error?.message,
          isDisplayMessage: validationResult?.status ? validationResult?.data?.is_display_message : validationResult?.error?.is_display_message,
          displayMessage: validationResult?.status ? validationResult?.data?.display_message : validationResult?.error?.display_message
        }
      }));

      onAction(true);

    } catch (error) {

    }
  }


  /**
   * On barcode API failed continuously, cancel popup will show
   * This function is used to cancel API validation retry
   */
  const handleBarcodeAPIValidationCancel = () => {
    setBarcodeValidateRetry({
      open: true,
      reason: 'cancelling',
      cancelling: true
    });
    cancelBarcodeValidate().catch(() => { })
  }

  /**
   * On continuous measurement upload failed, cancel popup will show
   * This function is used to cancel measurement upload retry
   */
  const handleMeasurementUploadCancel = () => {
    setMeasurementUploadRetry({
      open: false,
      message: 'cancelled'
    });

    dispatch(appState.extraActions.cancelMeasurementUpload({}));
  }

  /**
   * This function will call once the measurement trigger timer completed. 
   * Or on user click
   * @returns 
   */
  const handleMeasurementTriggerTimerComplete = () => {

    if (workflow?.support_trigger?.is_weighing_scale_trigger_enabled && weighing_scale !== 'none') {
      dispatch(appState.actions.disableWeighingScaleTrigger());
    }

    if (workflow?.support_trigger?.is_measurement_trigger_enabled) {
      dispatch(appState.actions.disableSmartMeasurementTrigger());
    }

    setVideoStreamProps({
      isShowExternalImage: false,
      isStreamEnabled: false
    });

    hideKeyboard()

    dispatch(navigationController.actions.disableNavigation());

    if (barcodeValueProps.current.isRefBox) {
      dispatch(appState.extraActions.measureReferenceBox({
        barcode_value: barcodeValueProps.current.currentValue,
        volumetric_divisor: volumetricDivisor
      }));

      return;
    }

    // Check for prevalidation
    if (!getPreValidationResult()) {
      return;
    }

    dispatch(appState.extraActions.measureBox({
      custom_fields: customFields,
      is_bottle_mode: is_bottle_mode,
      workflow_meta: dynamicPageData,
      volumetric_divisor: volumetricDivisor
    }));
  }


  /**
   * This function used to handle reference box scan
   * For barcode trigger mode, it will start measuring the ref-box
   */
  const handleReferenceBoxScan = async () => {

    // If additional barcode dialog is open, send the detail to it
    if (measurement_state.currentState === MeasurementState.ADDITIONAL_BARCODE) {
      setAdditionalBarcodeFieldProps({
        value: barcodeScanValue,
        counter: barcodeCount,
        category: BarcodeDataCategory.REFERENCE_BOX
      });
      return;
    }

    // If workflow notification popup in enabled in device restrict update scanned barcode value
    if (enablePopup) {
      return;
    }

    /**
     * For remote test measurement, 
     * 1. If auto clear is enabled, measurement state will be moved to READY state
     * 2. If Barcode is entered in barcode field but not yet validate. At that time, if we scan the REF BOX barcode it should work.
     * 3. If auto clear is not enabled, measurement state will be stayed in PROCESS_COMPLETED state
     * In these case we need to proceed further start reference box scan
     */
    if (measurement_state.currentState !== MeasurementState.INIT &&
      !(measurement_state.currentState === MeasurementState.BARCODE_VALIDATE &&
        measurement_state.processingState === ProcessingState.INIT
      ) &&
      (!(
        workflow.measurement_trigger?.source === MeasurementTriggerSrc.REMOTE &&
        measurement_state.currentState === MeasurementState.READY
      ) && !(
        workflow.measurement_trigger?.source === MeasurementTriggerSrc.REMOTE &&
        measurement_state.currentState === MeasurementState.PROCESS_COMPLETED &&
        !workflow.ui_config.result_timeout.is_enabled
      ))

    ) {
      return;
    }

    setIsReferenceBoxMeasurement(true);
    setBackgroundColor(MeasurementBackgroundColor.MEASUREMENT_CHECK);

    barcodeValueProps.current.currentValue = barcodeScanValue;
    barcodeValueProps.current.isRefBox = true;
    setBarcodeFieldProps({ value: barcodeScanValue });

    await handleReferenceBoxBarcodeValidation();

    // Start measurement trigger on barcode measurement
    if (workflow.measurement_trigger?.source === MeasurementTriggerSrc.BARCODE) {
      dispatch(appState.actions.startMeasurementTimer())
    }
  }

  const handleMeasurementResult = (resultStatus) => {
    setBackgroundColor(
      resultStatus
        ?
        MeasurementBackgroundColor.SUCCESS
        :
        MeasurementBackgroundColor.FAILED
    );

    if (measurement_result?.data?.measurement?.annotated_image) {
      getAnnotatedImage(measurement_result?.data?.measurement?.annotated_image)
        .then((result) => {
          setVideoStreamProps({
            externalImage: result?.data?.content,
            isShowExternalImage: true,
            isStreamEnabled: false
          });
        }).catch((err) => { })
    }
  }

  /**
   * If discard timer is enabled then this function will call after discard timeout.
   * Otherwise this function will get call immediately.
   * @param {*} is_discard 
   */
  const handleMeasurementDiscardTimerComplete = (is_discard) => {

    if (is_discard) {
      discardMeasurementData(measurement_result?.status)
    }

    // If measurement is discarded changed the processing state to success
    dispatch(appState.actions.updateMeasurementState({
      currentState: MeasurementState.MEASUREMENT_DISCARD,
      processingState: is_discard ? ProcessingState.SUCCEED : ProcessingState.FAILED,
    }));
  }

  const handleAdditionalBarcodeSubmit = (barcodes) => {

    additionalBarcode.current = [...barcodes];

    dispatch(appState.actions.updateMeasurementState({
      currentState: MeasurementState.ADDITIONAL_BARCODE,
      processingState: ProcessingState.SUCCEED
    }));
  }

  /**
   * This function will call after auto clear timeout or manual clear
   */
  const handleMeasurementClear = () => {

    // Reset the state to default
    barcodeValueProps.current.isRefBox = false;
    setBackgroundColor(MeasurementBackgroundColor.DEFAULT);
    barcodeValueProps.current.currentValue = '';
    setBarcodeFieldProps({ error: null, showError: false, value: '' });
    setVolumetricDivisorError(false);
    setVideoStreamProps({
      isStreamEnabled: true,
      isShowExternalImage: false,
      externalImage: ''
    });

    if (!volumetricDivisor?.is_retain) {
      setVolumetricDivisor(null);
    }

    if (measurement_result?.status) {
      dispatch(appState.actions.updateMeasurementState({
        currentState: MeasurementState.DONE,
        processingState: ProcessingState.SUCCEED,
        additionalInfo: {}
      }));
      // Call the parent function
      onMeasurementProcessCompleted(measurement_result?.status);
    } else {
      onMeasurementProcessCompleted(measurement_result?.status).then(() => {
        dispatch(appState.actions.initMeasurementState());
      });
    }

    dispatch(appState.actions.clearMeasurementData({
      // For successfull measurement clear additional images and videos. 
      // Not failure measurement no need to clear those data
      is_clear_all: measurement_result?.status || workflow?.measurement_trigger?.source === MeasurementTriggerSrc.REMOTE
    }));


  }

  const handleBottleModeToggle = (checked) => {
    dispatch(appState.actions.changeBottleMode({ is_bottle_mode: checked }))
  }

  const handleAdditionBarcodeValidationComplete = () => {
    setBarcodeValidateRetry({
      open: false
    })
  }

  const handleVolumetricChange = (volumetricDivisor) => {
    setVolumetricDivisor(volumetricDivisor);
  }

  const handleCustomFieldValueChange = (value) => {
    setCustomFields({ ...value });
  }

  const changeHighlightedField = () => {

    if (barcodeValueProps.current.isRefBox) {
      return
    }

    if (!workflow.barcode_config.is_enabled && !is_barcode_connected) {
      return
    }

    if (workflow?.ui_config?.custom_fields?.fields) {
      for (let field of workflow.ui_config.custom_fields.fields) {
        const result = isRequiredCustomFieldsFilled();

        if (field.is_mandatory && (!customFields[field.key] || result.failedRegexField === field.key)) {
          setHighlightedField(field.key)
          return
        }
      }
    }

    if (workflow.barcode_config.is_enabled &&
      measurement_state.currentState < MeasurementState.BARCODE_VALIDATE) {
      setHighlightedField('measurement_barcode_field')
      return
    }

    setHighlightedField('')

  }

  const handleWaitTriggerTimeout = () => {

    if (workflow?.support_trigger?.is_weighing_scale_trigger_enabled && weighing_scale !== 'none') {
      dispatch(appState.actions.disableWeighingScaleTrigger());
    }

    if (workflow?.support_trigger?.is_measurement_trigger_enabled) {
      dispatch(appState.actions.disableSmartMeasurementTrigger());
    }

    setBackgroundColor(MeasurementBackgroundColor.FAILED);


    dispatch(appState.actions.setMeasurementResult({ status: false }));
    if (workflow?.support_trigger?.is_measurement_trigger_enabled) {
      dispatch(appState.actions.cancelMeasurement({ statusCode: smart_measurement_trigger?.status_code }));
      dispatch(appState.actions.updateMeasurementState({
        currentState: MeasurementState.PROCESS_COMPLETED,
        processingState: ProcessingState.INIT,
        additionalInfo: { reason: TimeoutStateInfoReason[smart_measurement_trigger?.status_code] }
      }));
      return;
    }
    dispatch(appState.actions.cancelMeasurement({ statusCode: weighing_scale_trigger?.status_code }));
    dispatch(appState.actions.updateMeasurementState({
      currentState: MeasurementState.PROCESS_COMPLETED,
      processingState: ProcessingState.INIT,
      additionalInfo: { reason: TimeoutStateInfoReason[weighing_scale_trigger?.status_code] }
    }));

  }


  /**
 * This function will handle measurement state change
 * Decide the Current State based on changed currentState and processing state
 * @returns 
 */
  const handleMeasurementStateChange = async () => {
    // console.info("MEASUREMENT STATE : ", JSON.stringify(measurement_state));
    switch (measurement_state.currentState) {
      case MeasurementState.INIT:
        setIsMeasureBoxCompleted(false);
        dispatch(navigationController.actions.enaleNavigation());
        setVideoStreamProps({
          isStreamEnabled: true,
          externalImage: false,
          isShowExternalImage: false
        });
        /**
         * If trigger source in remote changed the current state to READY
         */

        if (measurement_state.processingState === ProcessingState.INIT) {
          if (workflow?.volumetric_config?.is_standard_divisor) {
            setVolumetricDivisor({
              name: 'Default',
              volumetric_divisor: workflow?.volumetric_config?.volumetric_divisor
            });
          }

          if (workflow?.support_trigger?.is_weighing_scale_trigger_enabled && weighing_scale !== 'none') {
            dispatch(appState.actions.enableWeighingScaleTrigger());
          } else {
            dispatch(appState.actions.disableWeighingScaleTrigger());
          }

          if (workflow?.support_trigger?.is_measurement_trigger_enabled) {
            dispatch(appState.actions.enableSmartMeasurementTrigger());
          } else {
            dispatch(appState.actions.disableSmartMeasurementTrigger());
          }

          if (workflow.measurement_trigger.source === MeasurementTriggerSrc.REMOTE) {

            let isReady = true;

            if (is_measurement_check_needed) {
              barcodeValueProps.current.isRefBox = true;
              setIsReferenceBoxMeasurement(true);
              setBackgroundColor(MeasurementBackgroundColor.MEASUREMENT_CHECK);
              // If ref box condition fails no need to move to ready state
              isReady = await handleRefBoxCondition();
            } else {
              setBackgroundColor(MeasurementBackgroundColor.DEFAULT);
              barcodeValueProps.current.isRefBox = false;
              setIsReferenceBoxMeasurement(false);
            }

            if (isReady) {
              dispatch(appState.actions.updateMeasurementState({
                currentState: MeasurementState.READY,
                processingState: ProcessingState.INIT,
              }));
            }

            return;
          }

          dispatch(appState.actions.updateMeasurementState({
            currentState: MeasurementState.INIT,
            processingState: ProcessingState.IN_PROGRESS,
            additionalInfo: {}
          }));

        }

        if (measurement_state.processingState === ProcessingState.IN_PROGRESS) {
          handleFieldValidation();
        }

        break;
      case MeasurementState.BARCODE_VALIDATE:
        /**
         * If barcode validation is success, move to ready state
         * If barcode validation is failed, move to Init state with processing state "FAILED"
         */

        if (measurement_state.processingState === ProcessingState.IN_PROGRESS) {
          dispatch(navigationController.actions.disableNavigation())

          /**Smart measurement trigger or weighing scale trigger
           * is stopped again the thread started only in clear process.
           * In slave mode measurements will taken without clear process,
           * So in below process thread started without clearing previous result in measurement check api.
          */

          if (is_measurement_check_needed) {
            if (workflow?.support_trigger?.is_weighing_scale_trigger_enabled && weighing_scale !== 'none') {
              dispatch(appState.actions.enableWeighingScaleTrigger());
            }

            if (workflow?.support_trigger?.is_measurement_trigger_enabled) {
              dispatch(appState.actions.enableSmartMeasurementTrigger());
            }
          }

        } else if (measurement_state.processingState === ProcessingState.SUCCEED) {

          dispatch(navigationController.actions.enaleNavigation())
          dispatch(appState.actions.updateMeasurementState({
            currentState: MeasurementState.READY,
            processingState: ProcessingState.INIT,
            additionalInfo: measurement_state.additionalInfo
          }));

          // Start measurement trigger on barcode measurement
          if (workflow.measurement_trigger.source === MeasurementTriggerSrc.BARCODE) {
            dispatch(appState.actions.startMeasurementTimer())
          }

          return;
        }
        if (measurement_state.processingState === ProcessingState.FAILED) {
          dispatch(appState.actions.updateMeasurementState({
            currentState: MeasurementState.INIT,
            processingState: ProcessingState.FAILED,
            additionalInfo: measurement_state.additionalInfo
          }));
          return;
        }
        break;
      case MeasurementState.READY:

        break;
      case MeasurementState.MEASUREMENT:
        /**
         * handled the measurement state is success or failure
         */
        if (measurement_state.processingState > ProcessingState.IN_PROGRESS) {
          setIsMeasureBoxCompleted(true);
          handleMeasurementResult(measurement_state.processingState === ProcessingState.SUCCEED);

          dispatch(appState.actions.updateMeasurementState({
            currentState: MeasurementState.MEASUREMENT_DISCARD,
            processingState: workflow?.ui_config?.measurement_reject.is_enabled ? ProcessingState.INIT : ProcessingState.FAILED,
            additionalInfo: { message: measurement_state.additionalInfo }
          }));

        }

        break;
      case MeasurementState.TEST_MEASUREMENT:
        /**
         * handled the test-measurement state is success or failure
         */
        if (measurement_state.processingState > ProcessingState.IN_PROGRESS) {
          setIsMeasureBoxCompleted(true);
          handleMeasurementResult(measurement_state.processingState === ProcessingState.SUCCEED);

          dispatch(appState.actions.updateMeasurementState({
            currentState: MeasurementState.PROCESS_COMPLETED,
            processingState: ProcessingState.INIT,
            additionalInfo: { reason: MeasurementStateInfoReason.TEST_MEASUREMENT_COMPLETED }
          }));

        }

        break;
      case MeasurementState.MEASUREMENT_DISCARD:

        // If measurement is discarded, complete the process
        if (measurement_state.processingState === ProcessingState.SUCCEED) {

          dispatch(appState.actions.updateMeasurementState({
            currentState: MeasurementState.PROCESS_COMPLETED,
            processingState: ProcessingState.INIT,
            additionalInfo: { message: 'measurement_discarded' }
          }));

        } else if (measurement_state.processingState === ProcessingState.FAILED) {

          // If additional barcode is not enabled or measurement is failed, save the measurement
          // Otherwise show the additional barcode dialog by change the state
          if (!workflow?.additional_barcode?.is_enabled || !measurement_result?.status) {
            dispatch(appState.actions.updateMeasurementState({
              currentState: MeasurementState.MEASUREMENT_UPLOAD,
              processingState: ProcessingState.INIT,
            }));
            return;
          }

          // Show the additional barcode
          dispatch(appState.actions.updateMeasurementState({
            currentState: MeasurementState.ADDITIONAL_BARCODE,
            processingState: ProcessingState.INIT,
          }));
        }

        break;
      case MeasurementState.ADDITIONAL_BARCODE:
        if (measurement_state.processingState > ProcessingState.IN_PROGRESS) {
          dispatch(appState.actions.updateMeasurementState({
            currentState: MeasurementState.MEASUREMENT_UPLOAD,
            processingState: ProcessingState.INIT,
          }));
        }

        break;
      case MeasurementState.MEASUREMENT_UPLOAD:
        if (measurement_state.processingState === ProcessingState.INIT) {
          dispatch(appState.extraActions.saveMeasurement({
            is_discard: false,
            additional_barcodes: [...additionalBarcode.current]
          }));
          additionalBarcode.current = []
        } else if (measurement_state.processingState > ProcessingState.IN_PROGRESS) {
          setMeasurementUploadRetry({ open: false, message: '' })
          dispatch(appState.actions.updateMeasurementState({
            currentState: MeasurementState.PROCESS_COMPLETED,
            processingState: measurement_state.processingState,
            additionalInfo: measurement_state.additionalInfo
          }));

        }
        break;
      case MeasurementState.PROCESS_COMPLETED:
        onMeasurementClearStateStarted(measurement_result);
        // We need to clear the data in backend, for successfull measurement and 
        // Need to clear the data for remote measurement for all cases to continue next measurement. 
        if (workflow?.measurement_trigger?.source === MeasurementTriggerSrc.REMOTE &&
          workflow?.ui_config?.result_timeout?.timeout == 0) {
          clearMeasurementData().catch((err) => { });
        }
        dispatch(navigationController.actions.enaleNavigation());
        break;
    }
  }

  const videoStreamRef = useRef();
  const videoRef = useRef();
  const previewRef = useRef();
  const timeoutRef = useRef()

  const setGridWidth = () => {
    timeoutRef.current = setTimeout(() => {
      if (previewRef.current && videoRef.current?.offsetWidth > 300) {
        setVideoStreamWidth(videoStreamRef.current.offsetWidth);
      } else {
        timeoutRef.current = setTimeout(setGridWidth, 50);
      }
    }, 50);
  }

  useEffect(() => {

    /**
     * This useEffect will trigger on component load.
     * On component load, calculate the video stream width
     */

    setGridWidth();

    // On component unmount, clear the timeout and change the measurement state
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

  }, []);

  const handleNewBarcodeScannerValue = () => {

    // Use effect will call when the page is init. At that time, 
    // we will have old or un-wanted barcode. So to avoid that we use this flag
    if (barcodeValueProps.current.isFirst) {
      barcodeValueProps.current.isFirst = false
      return;
    }

    if (barcodeCategory === BarcodeDataCategory.REFERENCE_BOX) {
      handleReferenceBoxScan();
      return;
    }

    // If there is no bef box assign to the site, no need process the barcode
    if (
      barcodeValueProps.current.isRefBox &&
      measurement_state.currentState === MeasurementState.INIT &&
      measurement_state.processingState === ProcessingState.FAILED &&
      measurement_state?.additionalInfo?.reason === MeasurementStateInfoReason.REFERENCE_BOX_DOESNOT_ASSIGN_TO_SITE
    ) {
      return;
    }

    // If measurement check is needed for measurement then we need to 
    // dispatch the message
    if (!barcodeValueProps.current.isRefBox) {
      handleBarcodeScan();
      return;
    }

    if (measurement_state.currentState === MeasurementState.INIT) {
      // Show measurement check only for init state
      dispatch(appState.actions.updateMeasurementState({
        currentState: MeasurementState.INIT,
        processingState: ProcessingState.FAILED,
        additionalInfo: { reason: MeasurementStateInfoReason.MEASUREMENT_CHECK_REQUIRED }
      }));
    }

  }

  useEffect(() => {
    handleNewBarcodeScannerValue();
  }, [barcodeScanValue, barcodeCategory, barcodeCount]);

  useEffect(() => {
    if (
      measurement_state?.currentState === MeasurementState.BARCODE_VALIDATE &&
      measurement_state?.processingState === ProcessingState.INIT &&
      workflow?.measurement_trigger?.source === MeasurementTriggerSrc.BARCODE
    ) {
      handleBarcodeValidation();
    }
  }, [barcodeFieldProps.value, measurement_state])


  useEffect(() => {

    // Process barcode api validation failure only on barcode validate state or addtional barcode validate state
    if (((measurement_state.currentState === MeasurementState.BARCODE_VALIDATE &&
      measurement_state.processingState === ProcessingState.IN_PROGRESS) ||
      measurement_state.currentState === MeasurementState.ADDITIONAL_BARCODE
    ) &&
      barcode_api_validation_failure) {
      setBarcodeValidateRetry({ open: true, reason: barcode_api_validation_failure.reason });
    }

  }, [barcode_api_validation_failure]);

  useEffect(() => {
    if (measurement_state.currentState === MeasurementState.MEASUREMENT_UPLOAD &&
      measurement_state.processingState === ProcessingState.IN_PROGRESS) {
      setMeasurementUploadRetry({
        open: true,
        message: "measurement_page.upload_retry_dialog.message"
      });
    }

  }, [measurement_cont_upload_failure])

  useEffect(() => {
    try {
      handleMeasurementStateChange();
    } catch (error) {
      console.error('Error in measurement state change in measurement page : ', error);
    }
  }, [measurement_state, measurement_result]);

  useEffect(() => {
    try {
      if (backgroundColor === MeasurementBackgroundColor.SUCCESS) {
        playAudio(AudioStatus.SUCCESS)
      } else if (backgroundColor === MeasurementBackgroundColor.FAILED) {
        playAudio(AudioStatus.FAILURE)
      }
    } catch (error) {
      console.error('Error in measurement state change in measurement page : ', error);
    }
  }, [backgroundColor]);

  const handleAutoCustomFieldValidation = () => {
    if (getPreValidationResult() && measurement_state.currentState < MeasurementState.MEASUREMENT) {
      dispatch(appState.actions.updateMeasurementState({
        currentState: MeasurementState.READY,
        processingState: ProcessingState.SUCCEED,
      }));
    }
  }

  const handleFieldValidation = () => {

    if (measurement_state.currentState === MeasurementState.INIT &&
      measurement_state.processingState === ProcessingState.INIT) {
      return
    }

    // If barcode config is disabled, then we need to check for custom field and volumetric validation
    // On success, move the state to ready
    if (workflow.measurement_trigger.source === MeasurementTriggerSrc.REMOTE) {
      return
    }
    // Change the highlight color
    changeHighlightedField();

    // If barcode is not enabled validate auto custom field validation
    if (!workflow.barcode_config.is_enabled) {
      handleAutoCustomFieldValidation();
      return
    }

    // No need to proceed for reference box barcode
    if (isReferenceBoxMeasurement) {
      return
    }

    // If prevalidation result is not success then no need to proceed
    if (!getPreValidationResult()) {
      return
    }

    // If measurement state is already in succeed state no need to update the state
    // It will cause infinite loop
    if (measurement_state.currentState === MeasurementState.INIT &&
      measurement_state.processingState === ProcessingState.SUCCEED
    ) {
      return;
    }

    dispatch(appState.actions.updateMeasurementState({
      currentState: MeasurementState.INIT,
      processingState: ProcessingState.SUCCEED,
    }));
  }

  useEffect(() => {
    if (!isFirstCall.current.isValidationCall) {
      handleFieldValidation();
    }
    isFirstCall.current.isValidationCall = false;
  }, [workflow, volumetricDivisor, customFields])


  useEffect(() => {
    if (measurement_state.currentState === MeasurementState.INIT &&
      measurement_state.processingState === ProcessingState.IN_PROGRESS &&
      !barcodeValueProps.current.isRefBox) {
      if (is_measurement_check_needed) {
        barcodeValueProps.current.isRefBox = true;
        setIsReferenceBoxMeasurement(true);
        setBackgroundColor(MeasurementBackgroundColor.MEASUREMENT_CHECK);
        handleRefBoxCondition();
      } else {
        barcodeValueProps.current.isRefBox = false;
        setIsReferenceBoxMeasurement(false);
      }
    }

    if (workflow.measurement_trigger.source === MeasurementTriggerSrc.REMOTE) {
      if (!is_measurement_check_needed) {
        barcodeValueProps.current.isRefBox = false;
        setIsReferenceBoxMeasurement(false);
      }
    }

  }, [measurement_state, is_measurement_check_needed])

  useEffect(() => {

    /**
     * Enable/ Disable the additional field disbale state
     */
    if (workflow.barcode_config.is_enabled) {
      setDisableAdditionalFields(measurement_state.currentState !== MeasurementState.INIT)
    } else {
      setDisableAdditionalFields(
        measurement_state.currentState > MeasurementState.MEASUREMENT ||
        (measurement_state.currentState === MeasurementState.MEASUREMENT &&
          measurement_state.processingState !== ProcessingState.INIT)
      )
    }
  }, [measurement_state])


  useEffect(() => {

    // For barcode trigger mode check for barcode connection.
    if (measurement_state.currentState === MeasurementState.INIT &&
      workflow.measurement_trigger.source === MeasurementTriggerSrc.BARCODE
    ) {

      if (!is_barcode_connected && measurement_state?.additionalInfo?.reason !== MeasurementStateInfoReason.CONNECT_BARCODE) {
        setDisablePage(true);
        dispatch(appState.actions.updateMeasurementState({
          currentState: MeasurementState.INIT,
          processingState: ProcessingState.FAILED,
          additionalInfo: { reason: MeasurementStateInfoReason.CONNECT_BARCODE }
        }));
      }

      if (is_barcode_connected && measurement_state?.additionalInfo?.reason === MeasurementStateInfoReason.CONNECT_BARCODE) {
        setDisablePage(false);
        dispatch(appState.actions.updateMeasurementState({
          currentState: MeasurementState.INIT,
          processingState: ProcessingState.INIT,
          additionalInfo: {}
        }));
      }
    }

  }, [barcode_name, is_barcode_connected, workflow, measurement_state]);

  useEffect(() => {

    // For weighing scale trigger mode, check for weighing scale is connected or not
    // Need to give high priority for barcode.
    if (measurement_state.currentState === MeasurementState.INIT &&
      workflow?.support_trigger?.is_weighing_scale_trigger_enabled &&
      measurement_state?.additionalInfo?.reason !== MeasurementStateInfoReason.CONNECT_BARCODE &&
      measurement_state?.additionalInfo?.reason !== MeasurementStateInfoReason.CONNECT_WEIGHING_SCALE
    ) {

      if (weighing_scale === 'none') {
        setDisablePage(true);
        dispatch(appState.actions.updateMeasurementState({
          currentState: MeasurementState.INIT,
          processingState: ProcessingState.FAILED,
          additionalInfo: { reason: MeasurementStateInfoReason.CONNECT_WEIGHING_SCALE }
        }));
      }

    }

  }, [weighing_scale, barcode_name, is_barcode_connected, workflow, measurement_state]);


  const handleRefBoxCondition = async () => {
    const result = await checkRefBoxCondition();
    if (!result?.status) {
      dispatch(appState.actions.updateMeasurementState({
        currentState: MeasurementState.INIT,
        processingState: ProcessingState.FAILED,
        additionalInfo: { reason: result?.error.reason }
      }));
    } else {
      dispatch(appState.actions.updateMeasurementState({
        currentState: MeasurementState.INIT,
        processingState: ProcessingState.SUCCEED,
        additionalInfo: { reason: MeasurementStateInfoReason.SCAN_REFERENCE_BOX }
      }));
    }
    return result?.status;
  }

  const validateCetrificateMode = (certificateList) => {
    //True - only if current certificate mode available in given certificate list 
    return certificateList.includes(metrological_setting)
  }

  const handleSmartMeasurementTriggerChange = () => {
    if (smart_measurement_trigger?.state == SmartMeasurementTriggerState.WAIT_FOR_SMART_MEASUREMENT_TRIGGER) {
      setStreamBackgroundColor('#ffa000');
    } else if (smart_measurement_trigger?.state == SmartMeasurementTriggerState.TRIGGERED) {
      setStreamBackgroundColor('#66bb6a');
    } else {
      setStreamBackgroundColor('#E8E8E8');
    }
  }

  useEffect(() => {
    if (workflow?.support_trigger?.is_measurement_trigger_enabled) {
      handleSmartMeasurementTriggerChange()
    } else {
      setStreamBackgroundColor('#E8E8E8');
    }

  }, [smart_measurement_trigger])

  const isFirst = useRef(true)
  const handleExternalInput = () => {
    if (isFirst.current) {
      isFirst.current = false
      return;
    }

    if (workflow.measurement_trigger.source === MeasurementTriggerSrc.MANUAL) {

      if (barcodeFieldProps.value !== '' && measurement_state.currentState <= MeasurementState.BARCODE_VALIDATE) {
        handleBarcodeValidation();
      }

      if (!workflow?.support_trigger?.is_measurement_trigger_enabled && measurement_state.currentState === MeasurementState.READY) {
        handleMeasurementTriggerTimerComplete();
      }

      if (workflow?.support_trigger?.is_measurement_trigger_enabled && smart_measurement_trigger?.state === SmartMeasurementTriggerState.TRIGGERED && measurement_state.currentState === MeasurementState.READY) {
        handleMeasurementTriggerTimerComplete();
      } else if (workflow?.support_trigger?.is_measurement_trigger_enabled && smart_measurement_trigger?.state !== SmartMeasurementTriggerState.TRIGGERED && measurement_state.currentState === MeasurementState.READY) {
        return;
      }

    }

    if (measurement_state.currentState === MeasurementState.PROCESS_COMPLETED && !workflow?.ui_config?.result_timeout?.is_enabled) {
      handleMeasurementClear();
    }

  }

  useEffect(() => {
    if (externalInputValue === ExternalInputs.NEXT && !enablePopup) {
      handleExternalInput();
    }
  }, [externalInputValue, externalInputCounter])

  const isTriggerServicePopupRequired = () => {
    return trigger_service?.status && trigger_service?.isPopupRequired && triggerServicePopup?.showTriggerPopup
  }

  const isDemoModeForceExitPopupRequired = () => {
    return demo_mode?.is_demo_mode_available && demo_mode?.is_demo_mode_activated && show_demo_force_exit_popup
  }

  return (
    <>
      <Grid container sx={{ overflow: 'hidden' }} height={'100%'}>
        <Grid container padding={0} margin={0} >
          <Paper
            variant="outlined"
            sx={{
              width: '100%',
              marginTop: 2,
              padding: 5,
              backgroundColor: `${backgroundColor} !important`,
              border: 'none',
              opacity: disablePage ? '0.5' : 1,
              borderRadius: 0
            }}>
            {/* First Row of measurement page */}
            <Grid container id={"first_row"} display={'flex'} height={'100%'}>
              {/* Header and additional buttons */}
              <Grid container item
                width={CONTENT_GRID_WIDTH}
                height={VIDEO_HEIGHT}
                ref={previewRef}
              >
                <Grid container item xs={12} height={'15%'} spacing={WORK_AREA_SPACING} marginBottom={WORK_AREA_SPACING}>
                  <Grid item xs={validateCetrificateMode([Certificates.NTEP]) ? 5 : 6} display="flex" alignItems="center">
                    <Typography
                      variant="h2"
                      color={backgroundColor === MeasurementBackgroundColor.FAILED ? 'white' : 'black'}
                    >
                      {/* {JSON.stringify(measurement_state)} */}
                      {t('measurement_page.title')}
                    </Typography>
                  </Grid>
                  <Grid container item xs={validateCetrificateMode([Certificates.NTEP]) ? 7 : 6} display={'flex'} spacing={WORK_AREA_SPACING} justifyContent={'right'} >
                    {
                      Boolean(workflow?.ui_config?.is_show_qr_code_result && isMeasureBoxCompleted && measurement_result?.status) &&
                      <Grid item>
                        <QRPopup disabled={!isMeasureBoxCompleted} />
                      </Grid>
                    }
                    {
                      Boolean(isMeasureBoxCompleted && measurement_result?.data?.measurement?.object_type) &&
                      <Grid item>
                        <ObjectTypeIcon objectType={measurement_result?.data?.measurement?.object_type} />
                      </Grid>
                    }
                    {
                      addon_features.bottle_mode && !validateCetrificateMode([Certificates.NTEP]) &&
                      <Grid item xs>
                        <BottleMode
                          isBottleMode={is_bottle_mode && !validateCetrificateMode([Certificates.NTEP])}
                          onBottleModeChange={handleBottleModeToggle}
                          disabled={
                            disableAdditionalFields ||
                            disablePage ||
                            isReferenceBoxMeasurement
                          }
                        />
                      </Grid>
                    }

                    {
                      (!addon_features.bottle_mode || validateCetrificateMode([Certificates.NTEP])) &&
                      <Grid item xs={'auto'} width={'fit-content'}>
                        <MeasurementDuration disabled={!isMeasureBoxCompleted} />
                      </Grid>
                    }
                  </Grid>
                </Grid>
                <Grid container item spacing={WORK_AREA_SPACING} height={'55%'} paddingBottom={WORK_AREA_SPACING} >
                  <Grid item xs={6} >
                    <DimensionInfoArea />
                  </Grid>
                  <Grid container item xs={6} rowSpacing={WORK_AREA_SPACING}>
                    <Grid item xs={12} height={'50%'}>
                      <WeightInfoArea />
                    </Grid>
                    <Grid container item xs={12} height={'50%'}>
                      {
                        // Show volumetric divisor if dynamic divisor is enabled and box yet to measure
                        Boolean(
                          workflow?.volumetric_config.is_enabled &&
                          !workflow?.volumetric_config?.is_standard_divisor &&
                          !isMeasureBoxCompleted
                        )
                        &&
                        <VolumetricDivisor
                          onVolumetricChange={handleVolumetricChange}
                          volumetricDivisor={volumetricDivisor}
                          error={volumetricDivisorError}
                          disabled={disableAdditionalFields}
                        />
                      }
                      {
                        // Show additional result only after measurement state completed
                        Boolean(
                          (workflow?.volumetric_config.is_enabled &&
                            workflow?.volumetric_config?.is_standard_divisor) ||
                          !workflow?.volumetric_config.is_enabled ||
                          isMeasureBoxCompleted
                          // workflow?.ui_config?.additional_result?.is_enabled &&
                        )
                        &&
                        <AdditionalResultData />
                      }
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container item xs={12} height="12%" >
                  <BarcodeField
                    label={workflow.barcode_config.barcode_text || 'Barcode'}
                    error={barcodeFieldProps.error}
                    showError={barcodeFieldProps.showError}
                    value={barcodeFieldProps.value}
                    disabled={
                      !workflow.barcode_config.is_enabled ||
                      (workflow.measurement_trigger?.source === MeasurementTriggerSrc.BARCODE && !is_barcode_connected) ||
                      disablePage ||
                      measurement_state.currentState > MeasurementState.BARCODE_VALIDATE ||
                      measurement_state.currentState === MeasurementState.BARCODE_VALIDATE && measurement_state.processingState === ProcessingState.IN_PROGRESS
                    }
                    editable={measurement_state.currentState <= MeasurementState.BARCODE_VALIDATE}
                    isHighlighted={(workflow.measurement_trigger?.source !== MeasurementTriggerSrc.REMOTE && isReferenceBoxMeasurement) || highlightedField === 'measurement_barcode_field'}
                    onBarcodeChange={handleBarcodeChange}
                    onBarcodeCompleted={handleBarcodeValidation}
                  />
                </Grid>
                {

                  <Grid container item xs={12} height="15%" paddingTop={WORK_AREA_SPACING}>
                    {
                      Boolean(workflow.ui_config?.custom_fields?.fields?.length) &&
                      <MeasurementPageCustomField
                        values={{}}
                        onValuesChange={handleCustomFieldValueChange}
                        barcodeScan={customFieldBarcodeScan}
                        highlightedField={isReferenceBoxMeasurement ? '' : highlightedField}
                        disabled={disableAdditionalFields || disablePage || isReferenceBoxMeasurement}
                        init={
                          measurement_state.currentState === MeasurementState.INIT &&
                          measurement_state.processingState === ProcessingState.INIT
                        }
                      />
                    }
                  </Grid>
                }
              </Grid>

              <Grid ref={videoRef} container item height={VIDEO_HEIGHT} width={VIDEO_STREAM_GRID_WIDTH} display={'flex'} >
                <Paper ref={videoStreamRef} variant="elevation" elevation={1} sx={{ margin: 'auto', padding: 2, height: '100%', }}>
                  <VideoStream
                    isStreamEnabled={videoStreamProps.isStreamEnabled}
                    isShowExternalImage={videoStreamProps.isShowExternalImage}
                    externalImage={videoStreamProps.externalImage}
                    isWorkareaRect={true}
                    videoStreamBackgroundColour={streamBackgroundColor}
                    defaultSrc={WhiteAnnotatedImage}
                  />
                </Paper>
              </Grid>
            </Grid>

          </Paper >
        </Grid >

        <Grid container item xs={12} display={'flex'} height={'15%'}>
          <Grid container item width={CONTENT_GRID_WIDTH} paddingRight={WORK_AREA_SPACING} overflow={'hidden'}>
            <MeasurementInfo isReferenceBoxMeasurement={isReferenceBoxMeasurement} />
          </Grid>

          <Grid container item width={VIDEO_STREAM_GRID_WIDTH} display={'flex'} justifyContent={'center'}>
            <Grid item width={videoStreamWidth} sx={{ height: '80%' }} marginY={'auto'}>
              {
                // Handled barcode validate on manual mode
                Boolean(workflow.measurement_trigger.source === MeasurementTriggerSrc.MANUAL &&
                  workflow.barcode_config.is_enabled &&
                  measurement_state.currentState <= MeasurementState.BARCODE_VALIDATE
                ) &&
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: '100%', }}
                  onClick={handleBarcodeValidation}
                  disabled={
                    barcodeFieldProps.value === '' ||
                    (measurement_state.currentState === MeasurementState.BARCODE_VALIDATE &&
                      measurement_state.processingState === ProcessingState.IN_PROGRESS)
                  }
                >
                  <Typography variant="body4">
                    {t('measurement_page.button.validate')}
                  </Typography>
                </Button>
              }

              {
                // Start the measurement trigger once the app is ready for measurement
                Boolean(measurement_state.currentState === MeasurementState.READY) &&
                <MeasurementTriggerTimer
                  onMeasurementTiggerTimerComplete={handleMeasurementTriggerTimerComplete}
                  onWaitTriggerTimeout={handleWaitTriggerTimeout}
                />
              }

              {
                Boolean(measurement_state.currentState === MeasurementState.PROCESS_COMPLETED &&
                  !isTriggerServicePopupRequired() &&
                  !isDemoModeForceExitPopupRequired()) &&
                <MeasurementClearTimer
                  isReferenceBoxMeasurement={isReferenceBoxMeasurement}
                  onMeasurementClearComplete={handleMeasurementClear}
                  measurementResultStatus={measurement_result?.status}
                />
              }
            </Grid>
          </Grid>
        </Grid >
      </Grid >
      {
        Boolean(measurement_state.currentState === MeasurementState.MEASUREMENT_DISCARD &&
          measurement_state.processingState <= ProcessingState.IN_PROGRESS &&
          !isReferenceBoxMeasurement
        ) &&
        <MeasurementDiscardTimer
          annotatedImg={videoStreamProps.externalImage}
          onMeasurementDiscardTimerComplete={handleMeasurementDiscardTimerComplete}
        />
      }

      {
        Boolean(measurement_state.currentState === MeasurementState.ADDITIONAL_BARCODE &&
          measurement_state.processingState === ProcessingState.INIT &&
          workflow.additional_barcode.is_enabled
        ) &&
        <AdditionalBarcode
          mainBarcode={barcodeFieldProps.value}
          annotatedImg={videoStreamProps.externalImage}
          barcodeScan={additionalBarcodeFieldProps}
          onSubmit={handleAdditionalBarcodeSubmit}
          onValidationComplete={handleAdditionBarcodeValidationComplete}
        />
      }

      {
        <BarcodeValidationRetry
          onBarcodeRetryCancel={handleBarcodeAPIValidationCancel}
          open={barcodeValidateRetry.open}
          reason={barcodeValidateRetry.reason}
          fieldName={workflow?.barcode_config?.barcode_text}
        />
      }

      {
        <MeasurementUploadRetry
          onMeasurementUploadCancel={handleMeasurementUploadCancel}
          message={measurementUploadRetry.message}
          open={measurementUploadRetry.open}
        />
      }
      {
        Boolean(
          measurement_state?.currentState === MeasurementState.PROCESS_COMPLETED &&
          !isDemoModeForceExitPopupRequired() &&
          isTriggerServicePopupRequired()
        ) &&
        < TriggerServicePopup />
      }
      {
        Boolean(
          measurement_state?.currentState === MeasurementState.PROCESS_COMPLETED &&
          isDemoModeForceExitPopupRequired()
        ) &&
        < DemoModeForceExitPopup open={show_demo_force_exit_popup} reason={"demo_mode_force_exit"} />
      }
    </>
  )
}

export default MeasurementPage;
