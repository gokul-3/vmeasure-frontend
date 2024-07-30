export const SoftwareCheckState = {
    CHECKING_SOFTWARE_UPDATE: 'checking_software_update',
    CHECK_FOR_UPDATE_FAILED:'check_for_update_failed',
    UPTO_DATE: 'upto_date',
    UPDATE_AVAILABLE: 'update_available',
    DOWNLOADING: 'downloading',
    READY_TO_UPDATE: 'ready_to_update',
    FAILED: 'failed'
}

export const SoftwareUpdateState = {
    PREPARING: 'preparing',
    DOWNLOADING_YML_SOURCE: 'downloading_yml_source',
    DOWNLOADING_APPLICATION: 'downloading_application',
    DOWNLOADING_SERVICES: 'downloading_service',
    VALIDATING: 'validating',
    COPY_ULTIMA_APP: 'copy_ultima_app',
    INSTALL_DEPENDENCIES: 'install_dependencies',
    READY_TO_UPDATE: 'ready_to_update',
    UPTO_DATE: 'upto_date',
    FAILED: 'failed',
    REINIT:'reinit',
    REBOOT_PENDING_AFTER_SUCCESS:'reboot_pending_after_success'
}