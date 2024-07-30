import React from 'react'
import { Alert as MuiAlert, AlertTitle, Typography } from '@mui/material'
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components/macro";

const Alert = styled(MuiAlert)` 
.MuiSvgIcon-root {
    font-size:1.4em;
}
`;

function RawModeNotes() {
    const { t } = useTranslation();

    return (
        <Alert variant="outlined" severity="info">
            <AlertTitle sx={{ fontSize: '1.4em' }}>{t('configurations.notes')}</AlertTitle>
            <Typography variant="h4" sx={{ color: 'black' }}>1.{" "}
                <Trans
                    i18nKey="configurations.measurements.notes_raw.line1"
                    components={[
                        <span style={{ color: '#307EC7' }}></span>,
                    ]}
                />
            </Typography>
            <Typography variant="h4" sx={{ color: 'black' }}>2.{" "}
                <Trans
                    i18nKey="configurations.measurements.notes_raw.line2"
                    components={[
                        <span style={{ color: '#307EC7' }}></span>,
                    ]}
                />
            </Typography>
            <Typography variant="h4" sx={{ color: 'black' }}>3.{" "}
                <Trans
                    i18nKey="configurations.measurements.notes_raw.line3"
                    components={[
                        <span style={{ color: '#307EC7' }}></span>,
                    ]}
                />
            </Typography>
        </Alert>
    )
}

export default RawModeNotes