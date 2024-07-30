export const SetUpHeight = {
    AUTO: 0,
    HT_1_1: 1100,
    HT_1_5: 1500,
    HT_2_2: 2200,
}

export const TriggerMode = {
    MANUAL: 'default',
    BARCODE: 'barcode',
    REMOTE: 'remote',
}

export const BarcodeDataCategory = {
    REFERENCE_BOX: 'reference_box',
    SCAN_VALUE: 'scan_value'
}


export const ExternalInputs = {
    ENTER: 'enter',
    SKIP: 'skip',
    NEXT: 'next'
}

export const MeasurementBackgroundColor = {
    // DEFAULT: '#CFCFCF',
    DEFAULT: "#f1f1f1",
    SUCCESS: '#4CAF50',
    FAILED: '#F44336',
    MEASUREMENT_CHECK: '#FFFF2E'
}

export const MeasurementInfoColor = {
    DEFAULT: "#212121",
    SUCCESS: '#4CAF50',
    FAILED: '#F44336',
}


/**
 * State changes:
 * On Start, measurement state will be init. Once we got the barcode value,
 * the state will be changed to BARCODE_VALIDATE. 
 * If barcode validation failed, state will moved to init
 * Once It is ready for validation, it will move to BARCODE_VALIDATE_IN_PROGRESS state.
 * Once validation is completed state will move to READY state.
 * Once Box is ready for measurement, state will move to IN_PROGRESS state.
 * Once measurement completed, state will be move to MEASUREMENT_COMPLETED.
 * If additional barcode is enabled, then automatically state will be move to ADDITIONAL_BARCODE.
 * Once all process it completed it will move to PROCESS_COMPLETED. 
 * Now we wait user/trigger to clear the measurement. After that it wil moved to INIT state.
 * 
 */
export const MeasurementState = {
    INIT: 0,
    BARCODE_VALIDATE: 1,
    READY: 2,
    MEASUREMENT: 3,
    TEST_MEASUREMENT: 4,
    MEASUREMENT_DISCARD: 5,
    ADDITIONAL_BARCODE: 6,
    MEASUREMENT_UPLOAD: 7,
    PROCESS_COMPLETED: 8,
    // No action should be happened in this state.
    //  To avoid INIT operation to start immediate after PROCESS_COMPLETED
    DONE: 9
}

export const MeasurementStateInfoReason = {
    SCAN_REFERENCE_BOX: 'scan_reference_box',
    SCAN_BARCODE: 'scan_barcode',
    CUSTOM_FIELD_REQUIRED: 'custom_field_required',
    VOLUMETRIC_DIVISOR_REQUIRED: 'volumentric_divisor_required',
    CONNECT_BARCODE: 'connect_barcode',
    CONNECT_WEIGHING_SCALE: 'connect_weighing_scale',
    MEASUREMENT_CHECK_REQUIRED: 'measurement_check_required',
    BARCODE_SUCCESS: 'barcode_success',
    BARCODE_FAILED: 'barcode_failure',
    INVALID_REFERENCE_BOX: 'invalid_reference_box',
    CONNECT_WEIGHING_SCALE_TO_PERFORM_MEASUREMENT_CHECK: 'connect_weighing_scale_to_perform_measurement_check',
    REFERENCE_BOX_DOESNOT_ASSIGN_TO_SITE: 'reference_box_doesnot_assign_to_site',
    WAITING_FOR_WEIGHING_SCALE_TRIGGER: 'waiting_for_weighing_scale_trigger',
    OBJECT_WAIT_TIMEOUT: 'object_wait_timeout',
    TEST_MEASUREMENT_COMPLETED: 'test_measurement_completed',
    EXCEPTION_GET_DIMENSION: 'exception_get_dimension',
    WAITING_FOR_VALIDATE_FRAME: 'waiting_for_validate_frame',
    TIMEOUT_FOR_NO_OBJECT_WITHIN_ARENA: 'timeout_for_no_object_within_arena',
    TIMEOUT_FOR_OBJECT_OUT_OF_FRAME: 'timeout_for_object_out_of_frame',
    REGEX_VALIDATION_FAILED: 'regex_validation_failed',
    REGEX_VALIDATION_SUCCEED: 'regex_validation_succeed'
}

export const ProcessingState = {
    INIT: 0,
    IN_PROGRESS: 1,
    SUCCEED: 2,
    FAILED: 3
}

export const DeviceAppAuth = {
    APPROVED: 'approved',
    DENIED: 'denied',
    AUTO_LOGIN_SCCESS: 'auto_login_sccess',
    AUTO_LOGIN_FAILED: 'auto_login_failed'
}

export const NetworkEnterpriseData = {
    wifiSecurityList: ['WPA & WPA2 Enterprise'],
    authenticationList: ['Protected EAP (PEAP)'],
    innerAuthenticationList: ['MSCHAPv2', 'MD5', 'GTC'],
    peapVersionList: ['Automatic', 'version1', 'version2']
}

export const NetworkError = {
    UNABLE_TO_FETCH_IP: "unable_to_fetch_ip_address_from_router"
}

export const NetworkMode = {
    STATIC: "static",
    DHCP: "dhcp"
}

export const NetworkPortStatus = {
    SUCCESS: "success",
    FAILURE: "failure",
    LOADING: "loading",
    MBPS: "Mbps"
}

export const NetworkType = {
    'OPEN': 0,
    'SECURED': 1,
    'ENTERPRISES': 2,
    'ENTERPRISES_WEB': 3
}

export const NetworkErrorCode = {
    'NO_WIFI_ADAPTOR': 701,
}

export const MasterService = "app_comp";

export const TimerForDeviceAPIAuthConfirmation = 60;

export const SwUpdateErrorCodes = {
    CHECK_FOR_UPDATE_FAILED: 3000,
    SUBSCRIPTION_EXPIRED: 1021,
    SYSTEM_SUSPENDED: 1022,
    OPERATOR_SUSPENDED: 1028,
    INTERNET_NOT_AVAILABLE: 3001,
    DOWNLOAD_FAILED: 916
}


export const SwUpdateErrorMsgs = {
    CHECK_FOR_UPDATE_FAILED: "software_update_page.errors.check_for_update",
    SUBSCRIPTION_EXPIRED: "software_update_page.errors.subscription_end|software_update_page.errors.redirect_login",
    SYSTEM_SUSPENDED: "software_update_page.errors.system_suspended|software_update_page.errors.redirect_login",
    OPERATOR_SUSPENDED: "software_update_page.errors.operator_suspended|software_update_page.errors.redirect_login",
    INTERNET_NOT_AVAILABLE: "software_update_page.errors.internet_not_available|software_update_page.errors.redirect_login",
    DOWNLOAD_FAILED: "software_update_page.errors.download_failed|software_update_page.errors.download_failed2"
}

export const SwUpdateErrorStates = {
    UPDATE_CHECK: "UPDATE_CHECK",
    DOWNLOADING: "DOWNLOADING",
}

export const UserTypes = {
    CUSTOMER_ADMIN: "customer_admin",
    APP_ADMIN: "app_admin",
    CUSTOMER_USER: "customer_user ",
    SUPERVISOR: "supervisor",
    OPERATOR: "operator",
    DEBUG_USER: "debug_user ",
    SUPPORT_USER: "support_user"
}


export const DimensionUnit = {
    CM: 'cm',
    IN: 'in',
    MM: 'mm'
}

export const WeightUnit = {
    KG: 'kg',
    GRAM: 'g',
    LB: 'lb',
    LB_OZ: 'lb-oz',
    OZ : 'oz'
}

export const Certificates = {
    NTEP: "NTEP"
}

export const NTEPDefaults = {
    DEPTH_REF: 'Legacy',
    ZERO_WEIGHT_CHECK: true,
    STRICT_MODE: true
}

export const NTEPSupportModes = [
    1500
]
export const NTEPSupportModesInInch = {
    [SetUpHeight.HT_1_5]: 59
}

export const WeighingScaleReqType = {
    ALL_SCALE: "all_scale",
    CERTIFICATE_BASED: "certificate_based",
    METROLOGICAL_SETTING_BASED: "metrological_setting_based"
}

export const PermissionModules = {
    UNITS_UPDATE: 'units_update',
    SCALE_UPDATE: 'scale_update',
    SOFTWARE_UPDATE: 'software_update',
    BARCODE_UPDATE: 'barcode_update',
    CONFIGURATION_METROLOGICAL_UPDATE :"configuration_metrological_update",
    CONFIGURATION_CALIBRATION_UPDATE :"configuration_calibration_update",
    CONFIGURATION_TIMEZONE_UPDATE :"configuration_timezone_update",
    CONFIGURATION_SYSTEM_UPDATE :"configuration_system_update",
    CUSTOM_CONFIGURATION_UPDATE:'custom_configuration_update'
}

export const ObjectType = {
    REGULAR: "regular",
    IRREGULAR: "irregular"
}

export const calibrationMethod = {
    MANUAL: "manual",
    AUTO: "auto"
}

export const calibrationMode = {
    HT_1_1_E: "1.1E",
    HT_1_1: "1.1",
    HT_1_5_E: "1.5E",
    HT_1_5: "1.5",
    HT_2_2: "2.2",
}

export const WeighingScaleTriggerState = {
    WAIT_FOR_TRIGGER: 1,
    WEIGHT_TRIGGERED: 2
}

export const LanguageValues = {
    en: 'english',
    es: 'spanish'
}

export const FontSize = {
    DEFAULT: "Default",
    LARGE: "Large"
}

export const LogsDownloadStates = {
    NONE: 'none',
    INIT: 'init',
    IN_PROGRESS: 'in_progress',
    SUCCESS: 'success',
    FAILED: 'failed'
}

export const DownloadLogTypes = {
    MEASUREMENT: 'Measurement',
    CALIBRATION: 'Calibration',
    CONFIGURATION: 'Configuration',
}

export const USBError = {
    INTERNET_REQUIRED: "internet_required",
    LOG_TYPE_REQUIRED: "log_type_required",
    LOW_USB_STORAGE: "low_usb_storage",
    USB_REQUIRED:  "usb_required",
    UNKNOWN_ERROR:  "unknown_error",
    NO_ERROR:  "no_error"
}

export const SmartMeasurementTriggerState = {
    WAIT_FOR_SMART_MEASUREMENT_TRIGGER: 1,
    TRIGGERED: 2
}

export const NetworkStatusErrorCodes = [
    'EHOSTUNREACH',
    'ECONNREFUSED',
    'ECONNABORTED',
    'ENOTFOUND',
    'EAI_AGAIN',
]
export const MeasurementPageReloadState = {
    RELOAD_NOT_REQUIRED: 0,
    RELOAD_REQUIRED: 1,
    RELOAD_COMPLETED: 2,
}

export const MeasurementPages = {
    ROOT: 'root',
    DYNAMIC_PAGES: 'dynamic_pages',
    ADDITIONAL_IMAGE: 'additional_image',
    MEASUREMENT_PAGE: 'measurement_page',
    ADDITIONAL_VIDEO: 'additional_video',
}

export const timeoutErrorCode = {
    TIMEOUT_FOR_NO_OBJECT_WITHIN_ARENA: 424,
    TIMEOUT_FOR_OBJECT_OUT_OF_FRAME: 426,

    TIMEOUT_FOR_SCALE_INCORRECT_WEIGHT: 501,
    TIMEOUT_FOR_NEGATIVE_WEIGHT: 507,
    TIMEOUT_FOR_SCALE_STATUS_CHECK_FAILED: 508,
    TIMEOUT_FOR_WEIGHT_NOT_STABLE: 513,
    
    TIMEOUT_FOR_PARSE_WEIGHT_FAILED: 503,
    TIMEOUT_FOR_READ_FAILED: 506,
    TIMEOUT_FOR_EXCEPTION_GET_WEIGHT: 512,
    TIMEOUT_FOR_JSON_PARSE_ERROR: 514,
    TIMEOUT_FOR_WRITE_FAILED: 505,
    
    TIMEOUT_FOR_ZERO_WEIGHT: 0
}

export const TimeoutErrors = {
    TIMEOUT_FOR_NO_OBJECT_WITHIN_ARENA:"timeout_for_no_object_within_arena",
    TIMEOUT_FOR_OBJECT_OUT_OF_FRAME: "timeout_for_object_out_of_frame",
    TIMEOUT_FOR_INCORRECT_WEIGHT: "timeout_for_incorrect_weight",
    TIMEOUT_FOR_UNABLE_TO_GET_WEIGHT: "timeout_for_unable_to_get_weight",
    TIMEOUT_FOR_ZERO_WEIGHT: "timeout_for_zero_weight",
}

export const TimeoutStateInfoReason = {
        [timeoutErrorCode.TIMEOUT_FOR_NO_OBJECT_WITHIN_ARENA]: TimeoutErrors.TIMEOUT_FOR_NO_OBJECT_WITHIN_ARENA,
        [timeoutErrorCode.TIMEOUT_FOR_OBJECT_OUT_OF_FRAME]: TimeoutErrors.TIMEOUT_FOR_OBJECT_OUT_OF_FRAME,
        
        [timeoutErrorCode.TIMEOUT_FOR_SCALE_INCORRECT_WEIGHT]: TimeoutErrors.TIMEOUT_FOR_INCORRECT_WEIGHT,
        [timeoutErrorCode.TIMEOUT_FOR_NEGATIVE_WEIGHT]: TimeoutErrors.TIMEOUT_FOR_INCORRECT_WEIGHT,
        [timeoutErrorCode.TIMEOUT_FOR_SCALE_STATUS_CHECK_FAILED]: TimeoutErrors.TIMEOUT_FOR_INCORRECT_WEIGHT,
        [timeoutErrorCode.TIMEOUT_FOR_WEIGHT_NOT_STABLE]: TimeoutErrors.TIMEOUT_FOR_INCORRECT_WEIGHT,
       
        [timeoutErrorCode.TIMEOUT_FOR_PARSE_WEIGHT_FAILED]: TimeoutErrors.TIMEOUT_FOR_UNABLE_TO_GET_WEIGHT,
        [timeoutErrorCode.TIMEOUT_FOR_READ_FAILED]: TimeoutErrors.TIMEOUT_FOR_UNABLE_TO_GET_WEIGHT,
        [timeoutErrorCode.TIMEOUT_FOR_EXCEPTION_GET_WEIGHT]: TimeoutErrors.TIMEOUT_FOR_UNABLE_TO_GET_WEIGHT,
        [timeoutErrorCode.TIMEOUT_FOR_JSON_PARSE_ERROR]: TimeoutErrors.TIMEOUT_FOR_UNABLE_TO_GET_WEIGHT,
        [timeoutErrorCode.TIMEOUT_FOR_WRITE_FAILED]: TimeoutErrors.TIMEOUT_FOR_UNABLE_TO_GET_WEIGHT,
       
        [timeoutErrorCode.TIMEOUT_FOR_ZERO_WEIGHT]: TimeoutErrors.TIMEOUT_FOR_ZERO_WEIGHT,
}

export const ProxyMode = {
    DISABLED: 'disabled',
    MANUAL: 'manual',
    AUTO: 'auto'
}

export const ProxyInfoObject = {
    PROXY_MODE: 'proxy_mode',
    HTTP_PROXY: 'http_proxy',
    HTTPS_PROXY: 'https_proxy',
    IS_HTTP_PROXY_PROTECTED: 'is_http_proxy_protected',
    IS_HTTPS_PROXY_PROTECTED: 'is_https_proxy_protected',
    HTTP_PROXY_USERNAME: 'http_proxy_username',
    HTTP_PROXY_PASSWORD: 'http_proxy_password',
    HTTPS_PROXY_USERNAME: 'https_proxy_username',
    HTTPS_PROXY_PASSWORD:  'https_proxy_password'
}

export const ProxyErrorMsg = {
    NO_PROXY_FOUND: 'No Proxy Found',
    AUTHENTICATION_FAILED: 'Authentication Failed',
    UNABLE_TO_CONNECT_WITH_FORGE: 'Unable To Connect With Forge'
}

export const VolumeLevel = {
    DEFAULT: 100
}

export const AudioStatus = {
    SUCCESS: 'success',
    FAILURE: 'failure'
}