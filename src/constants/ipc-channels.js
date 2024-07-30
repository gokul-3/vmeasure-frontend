exports.IPC_Channel = {
  GET_OPERATORS: 'get_operators',
  VALIDATE_PIN: 'validate_pin',
  LOGOUT_OPERATOR: 'logout_operator',

  HANDLE_PAGE_CHANGE: 'handle_page_change',

  GET_MEASUREMENT_RECORDS: 'get_measurement_records',
  GET_CALIBRATION_RECORDS: 'get_calibration_records',
  GET_TEST_MEASUREMENT_RECORDS: 'get_test_measurement_records',
  GET_BARCODE_VALIDATION_LOGS: 'get_barcode_validation_logs',
  GET_SYS_CONFIG_LOG_RECORDS: 'get_sys_config_log_records',

  GET_MEASUREMENT_IS_QUEUE_FULL: 'get_measurement_is_queue_full',
  GET_CALIBRATION_IS_QUEUE_FULL: 'get_calibration_is_queue_full',
  GET_CALIBRATION_DATA: 'get_calibration_data',
  SET_IS_MEASUREMENT_FLOW_INPROGRESS: 'set_is_measurement_flow_inprogress',

  GET_MEASUREMENT_ANNOTATION_IMAGE: 'get_measurement_annotation_image',

  GET_SYSTEM_INFO: 'get_system_info',
  GET_SYSTEM_VERSION: 'get_system_version',
  GET_SYSTEM_CONFIG: 'get_system_config',
  GET_SYSTEM_SERIAL_NUMBER: 'get_system_serial_number',
  GET_MEASUREMENT_RANGE: 'get_measurement_range',
  GET_DIMENSION_PYRAMID: 'get_dimension_pyramid',
  START_LOG_DOWNLOAD: 'start_log_download',
  GET_LIST_OF_USB: 'get_list_of_usb',

  DOWNLOAD_AND_GET_WORKFLOW: 'download_and_get_workflow',
  RESET_WORKFLOW: 'reset_workflow',

  GET_SCALE_LIST: 'get_scale_list',
  GET_SELECTED_SCALE: 'get_selected_scale',
  SET_SCALE: 'get_scale',
  GET_SCALE_SUPPORTED_UNIT: 'get_scale_supported_unit',
  GET_WEIGHING_SCALE_ENABLE_STATUS: 'get_weighing_scale_enable_status',
  DISPLAY_SCALE_RECONNECT_POPUP: 'display_scale_reconnect_popup',

  GET_UPDATE_INFO: 'get_update_info',

  GET_BARCODE_LIST: 'get_barcode_list',
  GET_SELECTED_BARCODE: 'get_selected_barcode',
  SET_BARCODE: 'set_barcode',

  GET_SELECTED_UNIT: 'get_selected_unit',
  SET_UNIT: 'set_unit',

  GET_REFERENCE_BOX_LIST: 'get_reference_box_list',
  GET_REFERENCE_BOX_MEASURE_COUNT_DATA: 'get_reference_box_measure_count_data',

  GET_METRO_LOGICAL_SETTINGS: 'get_metro_logical_settings',
  SET_METRO_LOGICAL_SETTINGS: 'set_metro_logical_settings',

  GET_CALIBRATION_SETTINGS: 'get_calibration_settings',
  SET_CALIBRATION_SETTINGS: 'set_calibration_settings',

  GET_TIMEZONE_LIST: 'get_timezone_list',
  GET_CURRENT_TIMEZONE: 'get_current_timezone',
  SET_TIMEZONE: 'set_timezone',

  LOAD_LANGUAGE_SETTIGNS: 'load_language_settings',
  GET_LANGUAGE_SETTINGS: 'get_language_settings',
  SET_LANGUAGE_SETTINGS: 'set_language_settings',

  SYNC_DEVICE_CONFIG: 'sync_device_config',

  /**
   * Measurement Page
   */
  VALIDATE_BARCODE: 'validate_barcode',
  VALIDATE_REFERENCE_BOX_BARCODE: 'validate_reference_box_barcode',
  CANCEL_VALIDATE_BARCODE: 'cancel_validate_barcode',
  MEASURE_REFERENCE_BOX: 'measure_reference_box',
  MEASURE_BOX: 'measurement_box',
  SAVE_MEASUREMENT: 'save_measurement',
  CANCEL_MEASUREMENT_UPLOAD: 'cancel_measurement_upload',

  ADD_ADDITIONAL_IMAGES: 'add_additional_images',

  GET_FRAME: 'get_frame',
  GET_CAPTURED_IMAGE: 'get_captured_image',
  GET_ANNOTATED_IMAGE: 'get_annotated_image',
  VALIDATE_ADDITIONAL_BARCODE: 'validate_additional_barcode',
  CLEAR_MEASUREMENT_DATA: 'clear_measurement_data',

  CALIBRATE_CAMERA: 'calibrate_camera',
  GET_MOMENT: 'get_moment',
  ADD_ADDITIONAL_VIDEO: 'add_additional_video',
  DELETE_ADDITIONAL_VIDEO: 'delete_additional_video',

  ENABLE_WEIGING_SCALE_TRIGGER: 'enable_weighing_scale_trigger',
  DISABLE_WEIGING_SCALE_TRIGGER: 'disable_weighing_scale_trigger',

  CANCEL_MEASUREMENT: 'cancel_measurement',


  /**
   * device api
   */
  DEVICE_API_AUTH_RESPONSE: 'device_api_auth_response',
  DEVICE_API_AUTO_LOGIN_RESPONSE: 'device_api_auto_login_response',
  GET_DEVICE_APP_PREVIOUS_PAIR_STATUS: 'get_device_app_previous_pair_status',
  FORCE_UNPAIR_DEVICE_APP: 'force_unpair_device_app',
  /**
   * network page
   */
  GET_MAC_DETAILS: 'get_mac_details',
  GET_ETHERNET_IP_DETAILS: 'get_ethernet_ip_details',
  GET_WIFI_IP_DETAILS: 'get_wifi_ip_details',

  GET_ETHERNET_CONFIGS: 'get_ethernet_configs',
  SET_ETHERNET_CONFIGS: 'set_ethernet_configs',

  GET_WIFI_CONFIGS: 'get_wifi_ip_configs',
  SET_WIFI_IP_CONFIGS: 'set_wifi_ip_configs',
  GET_WIFI_NETWORK_LIST: 'get_wifi_network_list',
  SET_WIFI_CONFIG: 'set_wifi_config',
  FORGET_WIFI_CONNECTION: 'forget_wifi_connection',
  SET_WIFI_STATE: 'set_wifi_state',
  GET_WIFI_CONNECTION_STATUS: 'get_wifi_connection_status',
  GET_CURRENT_SSID: 'get_current_ssid',
  /**
   * software updates
   */


  START_DOWNLOADING_UPDATES: 'start_downloading_updates',
  REBOOT_DEVICE: 'reboot_device',
  CHECK_FOR_UPDATES: 'check_for_updates',


  /**
   * Network Port Validation
   */
  CHECK_FOR_CONNECTION_AVAILABILITY: 'check_for_connection_availability',
  CHECK_FOR_INTERNET_AVAILABILITY: 'check_for_internet_availability',
  CHECK_FOR_FORGE_COMMUNICATION: 'check_for_forge_communication',
  CHECK_FOR_WEBSOCKET_COMMUNICATION: 'check_for_websocket_communication',
  CHECK_FOR_DOWNLOAD_SPEED: 'check_for_download_speed',
  CHECK_FOR_UPLOAD_SPEED: 'check_for_upload_speed',

  OPEN_VIRTUAL_KEYBOARD: 'open_virtual_keyboard',
  CLOSE_VIRTUAL_KEYBOARD: 'close_virtual_keyboard',
  TOGGLE_VIRTUAL_KEYBOARD: 'toggle_virtual_keyboard',
  KEY_PRESS: 'key_press',

  CHECK_REFBOX_CONDITION: 'check_refbox_condition',
  CHECK_TIMESYNC_STATUS: 'check_timesync_status',

  DISCARD_MEASUREMENT_DATA: 'discard_measurement_data',

  DISABLE_SMART_MEASUREMENT_TRIGGER: 'disable_smart_measurement_trigger',
  ENABLE_SMART_MEASUREMENT_TRIGGER: 'enable_smart_measurement_trigger',

  //NTP-server
  GET_NTP_SERVER_LIST: "get_ntp_server_list",
  SET_NTP_SERVER: "set_ntp_server",

  /**
   * Printer Configuration page
   */
  GET_PRINTER_CONFIGURED_LIST: "get_configured_list",
  GET_PRINTER_AVAILABLE_LIST: "get_available_list",
  GET_PRINTER_MANUFACTURER: "get_manufacturer",
  GET_PRINTER_DRIVER: "get_driver",
  ADD_LOCAL_PRINTER: "add_local_printer",
  ADD_NETWORK_PRINTER: "add_network_printer",
  GET_PRINTING_OPTION: "get_printing_option",
  SET_PRINTING_OPTION: "set_printering_option",
  PRINT_TEST_PAGE: "print_test_page",
  PRINT_PAGE: "print_page",
  GET_PRINTER_ACTIVE_JOBS: "get_active_jobs",
  DELETE_PRINTER: "delete_printer",
  CANCEL_ALL_PRINTER_JOB: "cancel_all_job",
  CANCEL_SINGLE_PRINTER_JOB: "cancel_single_job",
  GET_DEFAULT_PRINTER: "get_default_printer",
  SET_DEFAULT_PRINTER: "set_default_printer",
  GET_ADDITIONAL_PRINTING_OPTIONS: 'get_additional_printing_options',
  SET_ADDITIONAL_PRINTING_OPTIONS: 'set_additional_printing_options',

  /**
   * Title Bar Network Indicator
   */
  GET_WIFI_NETWORK_SIGNAL: 'get_wifi_network_signal',

  /**
   * Proxy settings
   */
  GET_PROXY_SERVER: 'get_proxy_server',
  SET_PROXY_SERVER: 'set_proxy_server',

  /**
   * Volume Control and adjustment
   */
  PLAY_AUDIO: 'play_audio',


  /**
   * Demo mode configs
   */
  GET_DEMO_MODE_CONFIGS:'get_demo_mode_configs',
  REVOKE_DEMO_MODE:'revoke_demo_mode',
  ACTIVATE_DEMO_MODE:'activate_demo_mode'
}
