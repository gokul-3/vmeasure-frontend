exports.UploadModes = {
    ASYNC: "asynchronous",
    SYNC: "synchronous",
}

exports.OperatingMode = {
    MASTER: 'master',
    SLAVE: 'slave'
}

exports.SyncRetryMode = {
    SCHEDULED_RETRY: "scheduled_retry",
    CONTINUOUS_RETRY: "continuous_retry"
}

exports.MeasurementTriggerSrc = {
    MANUAL: 'default',
    BARCODE: 'barcode',
    REMOTE: 'remote',
    DEVICE_API: 'device-api'
}

exports.NavigationBarcodes = {
    NAVIGATION_NEXT: '<<next>>',
    NAVIGATION_SKIP: '<<skip>>',
    IMAGE_CAPTURE: '<<capture>>'
}

exports.BarcodeValueCategory = {
    DATA: 'data',
    COMMAND: 'command'
}
