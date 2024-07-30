import React from 'react'
import { useTranslation } from "react-i18next";
import { LogsDownloadStates } from "../../../../constants/constants";
import { Grid, Typography, Chip } from "@mui/material";

function DialogHeader({ currentState, usb }) {
    const { t } = useTranslation();
    return (
        <Grid container item xs={12} justifyContent={'space-between'} alignItems={'center'}>
            <Grid item >
                <Typography variant='body3' fontSize={'1em'} fontWeight={'bold'}>
                    {t('logs_page.download.title')}
                </Typography>
            </Grid>
            {
                (currentState === LogsDownloadStates.INIT && usb.availSize && usb.diskSize) &&
                <Grid item >
                    <Chip
                        label={`${t('logs_page.download.info.disk_size')} : ${usb.availSize} / ${usb.diskSize}`}
                        sx={{ fontSize: "0.7em", minWidth: "20vw", height: "5vh", padding: 3, background: usb.availSize?.toString() === '0' ? '#ff174455' : '#4caf5055' }}
                    />
                </Grid>
            }
        </Grid>
    )
}

export default DialogHeader;