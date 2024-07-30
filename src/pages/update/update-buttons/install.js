import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { SoftwareUpdateState } from '../../../constants/sw-update';
import { useSelector } from 'react-redux';
import SoftwareButton from './sw-button';
import { RestartTimer } from '../update-utils/restart-timer';

function InstallButton({ onInstallLater }) {

    const { t } = useTranslation();
    const [showRebootTimer, setShowRebootTimer] = useState(false);
    const { software_update_state } = useSelector((state) => state.softwareUpdate);


    const installNow = () => {
        setShowRebootTimer(true)
    }

    return (
        <>
            {
                <>
                    {
                        software_update_state != SoftwareUpdateState.REBOOT_PENDING_AFTER_SUCCESS &&
                        <SoftwareButton variant='outlined' text={t('software_update_page.button.install_later')} onClick={onInstallLater} />
                    }
                    <SoftwareButton text={t('software_update_page.button.install_now')} onClick={installNow} />
                </>
            }
            <RestartTimer open={showRebootTimer} reason={'software_update'} />
        </>
    )
}

export default InstallButton;