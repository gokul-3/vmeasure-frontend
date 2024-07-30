import React from 'react'
import { Alert as MuiAlert, AlertTitle, Typography } from '@mui/material'
import { Trans } from "react-i18next";
import styled from "styled-components/macro";
import { useTranslation } from 'react-i18next';

const Alert = styled(MuiAlert)` 
.MuiSvgIcon-root {
    font-size:1.4em;
}
`;

function NTEPModeNotes() {

    const { t } = useTranslation()
    return (
        <Alert variant="outlined" severity="info">
            <AlertTitle sx={{ fontSize: '1.4em' }}>{t('configurations.notes')}</AlertTitle>

            <Typography variant="h4" sx={{ color: 'black' }}>
                <Trans
                    i18nKey="configurations.measurements.notes_ntep.line1"
                    components={[
                        <span style={{ color: '#307EC7' }}></span>,
                    ]}
                />
            </Typography>
        </Alert>
    )
}

export default NTEPModeNotes