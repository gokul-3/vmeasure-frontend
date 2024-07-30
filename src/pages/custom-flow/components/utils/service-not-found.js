import React from 'react'
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@emotion/react';

const ServiceNotFound = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    return (
        <Typography variant='h2' color={theme.palette.error.main} textAlign={'center'} m={10}>
            {t('custom_flow_common_text.service_unavailable')}
        </Typography>
    )
}

export default ServiceNotFound