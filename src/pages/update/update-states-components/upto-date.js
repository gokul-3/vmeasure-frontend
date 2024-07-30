import React from 'react'
import UpdateSuccessCheck from "../../../components/success-check/success-check";
import { useTheme } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

function UpToDate() {
    const theme = useTheme();
    const { t } = useTranslation();
    return (
        <>
            <UpdateSuccessCheck />
            <Typography variant="h3" align="center" color={theme.palette.success.main} mt={5}>
                {t("software_update_page.already_upto_date")}
            </Typography>
        </>
    )
}

export default UpToDate