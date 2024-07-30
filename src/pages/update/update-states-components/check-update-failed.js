import React from 'react';
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next';
import { useTheme } from '@emotion/react';


function CheckUpdateFailed({ error }) {
    const { t } = useTranslation();
    const theme = useTheme()
    return (
        <>
            <Typography color={theme.palette.error.main} variant="h3" align="center">
                {
                    t(error.message) !== error.message 
                    ? 
                    t(error.message)
                    :
                    t(`software_update_page.check_for_update.errors.unable_to_check`) + error?.cause
                }
            </Typography>
        </>
    )
}

export default CheckUpdateFailed