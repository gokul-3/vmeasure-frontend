import React from 'react'
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';

function DownloadFailed({ headerProps = {}, contentProps = {} }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const { additional_info } = useSelector((state) => state.softwareUpdate);

    return (
        <>
            <Typography variant="h3" color={theme.palette.error.main} {...headerProps}>
                {t("software_update_page.errors.download_failed")}
            </Typography>
            <Typography variant="h4" color={theme.palette.error.main} {...contentProps}>
                {
                    t(`software_update_page.errors.${additional_info?.error_message ?? 'network_error'}`) !==
                        `software_update_page.errors.${additional_info?.error_message ?? 'network_error'}`
                        ?
                        t(`software_update_page.errors.${additional_info?.error_message ?? 'network_error'}`)
                        :
                        additional_info?.error_message

                }
            </Typography>
        </>
    )
}

export default DownloadFailed