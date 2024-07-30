import React from 'react'
import { useTranslation } from 'react-i18next'
import SoftwareButton from './sw-button';

function DownloadButton({ canShowConfirmationPopup }) {
    const { t } = useTranslation();
    return (
        <SoftwareButton text={t('software_update_page.button.download')} onClick={() => canShowConfirmationPopup(true)} />
    )
}

export default DownloadButton