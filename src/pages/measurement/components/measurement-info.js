import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
} from "@mui/material";
import { MeasurementInfoColor, MeasurementState, MeasurementStateInfoReason, MeasurementTriggerSrc, ProcessingState, TimeoutStateInfoReason, UploadModes } from "../../../constants";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { addEllipsis } from "../../../utils/string-operation";
import ErrorBoundary from "../../../components/error-boundary/error-boundary";

const BlinkState = {
  NONE: 0,
  STARTED: 1,
  COMPLETED: 2
}

function MeasurementInfo({ isReferenceBoxMeasurement }) {

  const {
    measurement_state,
    is_measurement_retring,
    retry_count,
    measurement_result,
    weighing_scale_trigger,
    smart_measurement_trigger
  } = useSelector((state) => state.appState);

  const infoMessageRef = useRef({});
  const { workflow } = useSelector((state) => state.workflow);
  const [infoMessage, setInfoMessage] = useState({
    primary: '',
    primary_color: '',
    primary_style_components: [],
    secondary: '',
    secondary_color: '',
    message_params: {},
  });

  const [blinkState, setBlinkState] = useState(BlinkState.NONE);

  const handleMeasurementInitStateInfo = () => {
    const infoMsg = {};
    // Measurement is in init state without any processing state
    if (measurement_state.processingState === ProcessingState.INIT ||
      measurement_state.processingState === ProcessingState.SUCCEED ||
      measurement_state.processingState === ProcessingState.IN_PROGRESS
    ) {
      if (workflow?.barcode_config?.is_enabled) {
        infoMsg.primary_color = MeasurementInfoColor.DEFAULT;
        infoMsg.secondary_color = MeasurementInfoColor.DEFAULT;
        infoMsg.message_params = {
          barcode_field: addEllipsis(workflow.barcode_config.barcode_text, 13, false),
        }
        if (isReferenceBoxMeasurement) {
          infoMsg.primary = 'measurement_notes.measurement_init.measurement_check_required';
          infoMsg.secondary = 'measurement_notes.measurement_init.measurement_check_barcode_scan';
          infoMsg.primary_color = MeasurementInfoColor.FAILED;
        } else if (workflow?.measurement_trigger.source === MeasurementTriggerSrc.BARCODE) {
          infoMsg.primary = 'measurement_notes.measurement_init.scan_barcode_trigger';
        } else if (workflow?.measurement_trigger.source === MeasurementTriggerSrc.MANUAL) {
          infoMsg.primary = 'measurement_notes.measurement_init.scan_barcode_manual';
        }
      }


    } else if (measurement_state.processingState === ProcessingState.FAILED) {

      if (measurement_state?.additionalInfo?.reason == MeasurementStateInfoReason.CONNECT_BARCODE) {
        infoMsg.primary = 'measurement_notes.measurement_init.connect_barcode';
        infoMsg.primary_color = MeasurementInfoColor.FAILED;
      } else if (measurement_state?.additionalInfo?.reason == MeasurementStateInfoReason.CONNECT_WEIGHING_SCALE) {
        infoMsg.primary = 'measurement_notes.measurement_init.connect_weighing_scale';
        infoMsg.primary_color = MeasurementInfoColor.FAILED;
      } else if (measurement_state?.additionalInfo?.reason == MeasurementStateInfoReason.VOLUMETRIC_DIVISOR_REQUIRED) {
        infoMsg.primary = 'measurement_notes.measurement_init.volumentric_divisor_required';
        infoMsg.primary_color = MeasurementInfoColor.FAILED;
      } else if (measurement_state?.additionalInfo?.reason == MeasurementStateInfoReason.CUSTOM_FIELD_REQUIRED) {
        infoMsg.primary = 'measurement_notes.measurement_init.custom_fields_required';
        infoMsg.primary_color = MeasurementInfoColor.FAILED;
      } else if (measurement_state?.additionalInfo?.reason === MeasurementStateInfoReason.BARCODE_FAILED) {
        if (measurement_state?.additionalInfo?.error === 'api_validation_failed' &&
          measurement_state?.additionalInfo?.isDisplayMessage
        ) {
          infoMsg.primary = measurement_state?.additionalInfo?.displayMessage;
        } else {
          infoMsg.primary = 'measurement_notes.measurement_barcode_validate.' + measurement_state?.additionalInfo?.error
        }

        infoMsg.primary_color = MeasurementInfoColor.FAILED;
        infoMsg.secondary = 'measurement_notes.measurement_init.scan_barcode_again';
        infoMsg.message_params = {
          barcode_field: addEllipsis(workflow.barcode_config.barcode_text, 13, false),
          message: measurement_state?.additionalInfo?.displayMessage,
          minimum_charcters: workflow?.barcode_config?.min_length,
          maximum_charcters: workflow?.barcode_config?.max_length
        }
        infoMsg.secondary_color = MeasurementInfoColor.DEFAULT;
      } else if (measurement_state?.additionalInfo?.reason === MeasurementStateInfoReason.MEASUREMENT_CHECK_REQUIRED) {
        infoMsg.primary = 'measurement_notes.measurement_init.measurement_check_required'
        infoMsg.primary_color = MeasurementInfoColor.FAILED;
        infoMsg.secondary = 'measurement_notes.measurement_init.invalid_reference_box';
        infoMsg.secondary_color = MeasurementInfoColor.FAILED;
      } else if (measurement_state?.additionalInfo?.reason === MeasurementStateInfoReason.CONNECT_WEIGHING_SCALE_TO_PERFORM_MEASUREMENT_CHECK) {
        infoMsg.primary = 'measurement_notes.measurement_init.connect_weighing_scale_to_perform_measurement_check_primary'
        infoMsg.secondary = 'measurement_notes.measurement_init.connect_weighing_scale_to_perform_measurement_check_secondary'
        infoMsg.primary_color = MeasurementInfoColor.FAILED;
        infoMsg.secondary_color = MeasurementInfoColor.DEFAULT;
      } else if (measurement_state?.additionalInfo?.reason === MeasurementStateInfoReason.REFERENCE_BOX_DOESNOT_ASSIGN_TO_SITE) {
        infoMsg.primary = 'measurement_notes.measurement_init.reference_box_doesnot_assign_to_site_primary'
        infoMsg.secondary = 'measurement_notes.measurement_init.reference_box_doesnot_assign_to_site_secondary'
        infoMsg.primary_color = MeasurementInfoColor.FAILED;
        infoMsg.secondary_color = MeasurementInfoColor.DEFAULT;
      } else if (measurement_state?.additionalInfo?.reason === MeasurementStateInfoReason.REGEX_VALIDATION_FAILED) {
        infoMsg.primary = 'measurement_notes.measurement_init.regex_validation_failed'
        infoMsg.primary_color = MeasurementInfoColor.FAILED;
        infoMsg.message_params = { custom_field:  measurement_state?.additionalInfo?.regexField}
      }
    }

    if (infoMessageRef.current.primary === infoMsg.primary &&
      infoMessageRef.current.secondary === infoMsg.secondary &&
      blinkState !== BlinkState.STARTED
    ) {
      setBlinkState(BlinkState.STARTED);
    }

    infoMessageRef.current = infoMsg;

  }


  const handleBarcodeValidateStateInfo = () => {

    const infoMsg = {};

    if (measurement_state.processingState === ProcessingState.INIT) {
      if (workflow?.measurement_trigger.source === MeasurementTriggerSrc.MANUAL &&
        workflow?.barcode_config?.is_enabled
      ) {
        infoMsg.primary = 'measurement_notes.measurement_init.scan_barcode_manual';
        infoMsg.message_params = { barcode_field: addEllipsis(workflow.barcode_config.barcode_text, 13, false) }
        infoMsg.primary_color = MeasurementInfoColor.DEFAULT;
      }
    } else if (measurement_state.processingState === ProcessingState.IN_PROGRESS) {
      infoMsg.primary = 'measurement_notes.measurement_barcode_validate.validation_in_progress';
      infoMsg.primary_color = MeasurementInfoColor.DEFAULT;
    }

    infoMsg.message_params = {
      barcode_field: addEllipsis(workflow.barcode_config.barcode_text, 13, false),
    }

    // For barcode failure state, measurementState will moved to (INIT, FAILED, barcode_failure)
    // For barcode success state, measurementState will moved to (READY, INIT, barcode_success)

    infoMessageRef.current = infoMsg;
  }


  const handleMeasurementReadyStateInfo = () => {

    infoMessageRef.current = {};
    infoMessageRef.current.secondary = ''
    infoMessageRef.current.secondary_color = MeasurementInfoColor.DEFAULT;

    if (measurement_state?.additionalInfo?.reason === MeasurementStateInfoReason.WAITING_FOR_WEIGHING_SCALE_TRIGGER) {
      infoMessageRef.current.primary =
        workflow?.measurement_trigger?.source === MeasurementTriggerSrc.REMOTE ?
          'measurement_notes.measurement_ready.wait_for_weighing_scale_trigger_timeout' :
          'measurement_notes.measurement_ready.wait_for_weighing_scale_trigger';
      infoMessageRef.current.primary_color = MeasurementInfoColor.DEFAULT;

      if (measurement_state?.additionalInfo.status_code !== 0 && measurement_state?.additionalInfo?.error_msg) {
        infoMessageRef.current.secondary = 'measurement_notes.measurement_result.' + measurement_state?.additionalInfo?.error_msg;
        infoMessageRef.current.secondary_color = MeasurementInfoColor.FAILED;
      } else {
        infoMessageRef.current.secondary = ''
        infoMessageRef.current.secondary_color = MeasurementInfoColor.DEFAULT;
      }

      return;
    }

    if (measurement_state?.additionalInfo?.reason === MeasurementStateInfoReason.WAITING_FOR_VALIDATE_FRAME) {
      if (workflow?.measurement_trigger?.source === MeasurementTriggerSrc.REMOTE) {
        infoMessageRef.current.primary = 'measurement_notes.measurement_ready.wait_for_validate_frame_timeout';
        infoMessageRef.current.primary_color = MeasurementInfoColor.DEFAULT;
      }
      return;
    }

    if (measurement_state?.additionalInfo?.reason == MeasurementStateInfoReason.BARCODE_SUCCESS) {
      infoMessageRef.current.primary_color = MeasurementInfoColor.SUCCESS;

      /**
       * For API validation, proceed measurement additional info -> error will be
       * api_validation_failed. If there is display message show it or show default messages
       */

      if (measurement_state?.additionalInfo?.isDisplayMessage) {
        infoMessageRef.current.primary = measurement_state?.additionalInfo?.displayMessage;
      } else {
        infoMessageRef.current.primary =
          measurement_state?.additionalInfo?.error === 'api_validation_failed'
            ?
            'measurement_notes.measurement_barcode_validate.api_validation_failed'
            :
            'measurement_notes.measurement_barcode_validate.validation_success'
      }

      infoMessageRef.current.message_params = {
        barcode_field: addEllipsis(workflow.barcode_config.barcode_text, 13, false),
        message: '',
      }

      infoMessageRef.current.primary_color = measurement_state?.additionalInfo?.error !== 'api_validation_failed'
        ?
        MeasurementInfoColor.SUCCESS
        :
        MeasurementInfoColor.FAILED

    } else {
      infoMessageRef.current.primary = 'measurement_notes.measurement_ready.system_ready'
      infoMessageRef.current.primary_color = MeasurementInfoColor.DEFAULT;
    }

    if (workflow?.measurement_trigger.source === MeasurementTriggerSrc.MANUAL) {
      infoMessageRef.current.secondary = 'measurement_notes.measurement_ready.note';
      infoMessageRef.current.secondary_color = MeasurementInfoColor.DEFAULT;
    } else if (workflow?.measurement_trigger?.source === MeasurementTriggerSrc.REMOTE) {
      if (isReferenceBoxMeasurement) {
        infoMessageRef.current.primary = 'measurement_notes.measurement_init.measurement_check_required';
        infoMessageRef.current.primary_color = MeasurementInfoColor.FAILED;
      } else {
        infoMessageRef.current.secondary = 'measurement_notes.measurement_ready.note';
        infoMessageRef.current.secondary_color = MeasurementInfoColor.DEFAULT;
      }
    }

  }

  const handleMeasurementStateInfo = () => {

    const infoMsg = {};
    infoMsg.secondary = ''
    infoMsg.secondary_color = MeasurementInfoColor.DEFAULT;
    if (measurement_state.processingState === ProcessingState.INIT) {
      if (workflow?.measurement_trigger?.source === MeasurementTriggerSrc.MANUAL) {
        infoMsg.primary = 'measurement_notes.measurement_init.system_state';
        infoMsg.secondary = 'measurement_notes.measurement_init.measurement_instruction';
        infoMsg.primary_color = MeasurementInfoColor.DEFAULT;
        infoMsg.secondary_color = MeasurementInfoColor.DEFAULT;
      }
    } else if (measurement_state.processingState === ProcessingState.IN_PROGRESS) {
      infoMsg.primary = is_measurement_retring ?
        'measurement_notes.measuring_state.measurement_retry' :
        'measurement_notes.measuring_state.measurement_in_progress';
      infoMsg.message_params = { retry_count: retry_count }
      infoMsg.primary_color = MeasurementInfoColor.DEFAULT;
    } else if (measurement_state.processingState === ProcessingState.SUCCEED) {
      infoMsg.primary_color = MeasurementInfoColor.SUCCESS;
      if (measurement_result?.data?.capture4K?.is_enabled) {
        if (measurement_result.data.capture4K.status) {
          infoMsg.primary = 'measurement_notes.measurement_result.captured_4k_successfully'
        } else {
          infoMsg.primary = 'measurement_notes.measurement_result.capture_4k_failed'
        }
      } else {
        infoMsg.primary = 'measurement_notes.measurement_result.success';
      }
    } else if (measurement_state.processingState === ProcessingState.FAILED) {
      infoMsg.primary = 'measurement_notes.measurement_result.' + measurement_result?.error?.reason;
      infoMsg.primary_color = MeasurementInfoColor.FAILED;
    }

    infoMessageRef.current = {
      ...infoMessageRef.current,
      ...infoMsg,
    };
  }

  const handleTestMeasurementStateInfo = () => {

    let infoMsg = {};
    if (measurement_state.processingState === ProcessingState.INIT) {
      if (workflow?.measurement_trigger?.source === MeasurementTriggerSrc.MANUAL) {
        infoMsg = infoMessageRef.current;
      }
    } else if (measurement_state.processingState === ProcessingState.IN_PROGRESS) {
      infoMsg.primary = is_measurement_retring ?
        'measurement_notes.measuring_state.measurement_retry' :
        'measurement_notes.measuring_state.measurement_in_progress';
      infoMsg.message_params = {
        retry_count: retry_count
      }
      infoMsg.primary_color = MeasurementInfoColor.DEFAULT;
    } else if (measurement_state.processingState === ProcessingState.SUCCEED) {
      infoMsg.primary = 'measurement_notes.test_measurement_result.success';
      infoMsg.primary_color = MeasurementInfoColor.SUCCESS;
    } else if (measurement_state.processingState === ProcessingState.FAILED) {
      infoMsg.primary = 'measurement_notes.measurement_result.' + measurement_result?.error?.reason;
      infoMsg.message_params = {
        barcode_field: addEllipsis(workflow.barcode_config.barcode_text, 13, false),
      }
      infoMsg.primary_color = MeasurementInfoColor.FAILED;
    }

    infoMessageRef.current = {
      ...infoMsg
    };
  }

  const handleMeasurementDiscardStateInfo = () => {
    if (measurement_state.processingState === ProcessingState.SUCCEED) {
      const infoMsg = {};
      infoMsg.secondary = 'measurement_notes.measurement_discard.measurement_discarded';
      infoMsg.secondary_color = MeasurementInfoColor.FAILED;
      infoMessageRef.current = {
        ...infoMessageRef.current,
        ...infoMsg
      };
    }
  }


  const handleMeasurementUploadStateInfo = () => {

    const infoMsg = {};

    if (measurement_state.processingState === ProcessingState.IN_PROGRESS) {
      infoMsg.secondary = 'measurement_notes.measurement_upload.uploading';
      infoMsg.secondary_color = MeasurementInfoColor.DEFAULT;
    } else if (measurement_state.processingState === ProcessingState.FAILED) {
      infoMsg.secondary = 'measurement_notes.measurement_upload.' + measurement_state?.additionalInfo?.displayMessage;
      infoMsg.secondary_color = MeasurementInfoColor.FAILED;
    } else if (measurement_state.processingState === ProcessingState.SUCCEED) {
      infoMsg.secondary = 'measurement_notes.measurement_upload.' + measurement_state?.additionalInfo?.displayMessage;
      infoMsg.secondary_color = MeasurementInfoColor.SUCCESS;
    }

    if (measurement_result?.error?.reason == MeasurementStateInfoReason.EXCEPTION_GET_DIMENSION) {
      infoMsg.secondary = 'measurement_notes.measurement_upload.retake_measurement';
      infoMsg.secondary_color = MeasurementInfoColor.SUCCESS;
    }

    infoMessageRef.current = {
      ...infoMessageRef.current,
      ...infoMsg
    };

  }


  const handleAdditionalBarcodeStateInfo = () => {

  }


  const handleMeasurementProcessCompleteStateInfo = () => {

    const infoMsg = {};

    if (workflow?.support_trigger?.is_measurement_trigger_enabled) {
      infoMsg.primary = `measurement_notes.measurement_upload.${TimeoutStateInfoReason[smart_measurement_trigger.status_code]}`;
      infoMsg.primary_color = MeasurementInfoColor.FAILED;
      infoMsg.secondary = '';
      infoMsg.secondary_color = MeasurementInfoColor.FAILED;
    } else if (workflow?.support_trigger?.is_weighing_scale_trigger_enabled) {
      infoMsg.primary = `measurement_notes.measurement_upload.${TimeoutStateInfoReason[weighing_scale_trigger.status_code]}`;
      infoMsg.primary_color = MeasurementInfoColor.FAILED;
      infoMsg.secondary = '';
      infoMsg.secondary_color = MeasurementInfoColor.FAILED;
    }

    infoMessageRef.current = {
      ...infoMessageRef.current,
      ...infoMsg
    };

  }

  const handleMeasurementStateChange = () => {


    switch (measurement_state.currentState) {

      case MeasurementState.INIT:
        handleMeasurementInitStateInfo();
        break;

      case MeasurementState.BARCODE_VALIDATE:
        handleBarcodeValidateStateInfo();
        break;

      case MeasurementState.READY:
        handleMeasurementReadyStateInfo();
        break;

      case MeasurementState.MEASUREMENT:
        handleMeasurementStateInfo();
        break;

      case MeasurementState.TEST_MEASUREMENT:
        handleTestMeasurementStateInfo();
        break;

      case MeasurementState.MEASUREMENT_DISCARD:
        handleMeasurementDiscardStateInfo();
        break;
      case MeasurementState.MEASUREMENT_UPLOAD:
        handleMeasurementUploadStateInfo();
        break;

      case MeasurementState.PROCESS_COMPLETED:
        handleMeasurementProcessCompleteStateInfo();
        break;
    }
    // Set the state just to refresh the component
    // setmsg(JSON.stringify(infoMessageRef.current));
    setInfoMessage(infoMessageRef.current);
  }

  useEffect(() => {
    try {
      handleMeasurementStateChange();
    } catch (error) {
      console.error('Error in measurement state change in measurement info : ', error);
    }

  }, [measurement_state, is_measurement_retring, retry_count, isReferenceBoxMeasurement])

  const { t } = useTranslation();

  useEffect(() => {
    if (blinkState === BlinkState.STARTED) {
      setBlinkState(BlinkState.COMPLETED);
    }

  }, [blinkState])

  return (
    <ErrorBoundary>
      <div style={{ width: "63vw", margin: 'auto', visibility: blinkState === BlinkState.STARTED ? 'hidden' : 'visible' }}>
        <div style={{ width: "100%", height: '50%' }}>
          <Typography fontSize={34} fontWeight={500} textOverflow={'ellipsis'} color={infoMessage?.primary_color} overflow={'hidden'} whiteSpace={'nowrap'}>
            <Trans
              i18nKey={infoMessage?.primary || ''}
              values={{ ...infoMessage.message_params }}
              components={[<span style={{ "color": "red" }} ></span>]}
            />
          </Typography>
        </div>
        <div style={{ width: "100%", height: '50%' }}>
          {
            infoMessage?.secondary &&
            <Typography fontSize={34} fontWeight={500} color={infoMessage.secondary_color}>
              <Trans
                i18nKey={infoMessage.secondary}
                values={{
                  ...infoMessage.message_params,
                  barcode_field: addEllipsis(workflow.barcode_config.barcode_text, 13, false),
                }}
              />
            </Typography>}
        </div>

      </div>
    </ErrorBoundary>

  )
}

export default MeasurementInfo;

