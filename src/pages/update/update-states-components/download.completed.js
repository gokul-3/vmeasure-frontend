import React from 'react'
import usePermission from '../../../hooks/usePermission';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@emotion/react';
import { PermissionModules } from '../../../constants';

function DownloadCompletes({ headerProps = {}, contentProps = {} }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [hasPermission] = usePermission(PermissionModules.SOFTWARE_UPDATE);
    return (
        <>
            <Typography variant={"h3"} align="center" color={theme.palette.success.main} {...headerProps}  >
                {t("software_update_page.success.download_success1")}
            </Typography>
            <Typography variant="h4" align="center" color={theme.palette.success.main} {...contentProps} >
                {
                    hasPermission
                        ? t("software_update_page.success.download_success2")
                        : t("software_update_page.success.download_success_without_permission")
                }
            </Typography>
        </>
    )
}

export default DownloadCompletes