import React from "react";
import {
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function MeasurementUploadRetry({ open, message, onMeasurementUploadCancel}) {

    // Add timer module on timer ends call onMeasurementTimerComplete

    const handleCancelClick = () => {
        onMeasurementUploadCancel();
    }

    const { t } = useTranslation()

    return (
        <Dialog
            maxWidth={'sm'}
            fullWidth
            open={open}
        >
            <DialogTitle>{t('measurement_page.upload_retry_dialog.title')}</DialogTitle>
            <DialogContent sx={{ height: '15vh', paddingX: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', rowGap: 5 }}>
                <div>
                    <Typography variant="h3">{t(message)}</Typography>
                </div>
                <div>
                    <LinearProgress sx={{ width: '100%' }} />
                </div>
            </DialogContent>
            <DialogActions sx={{ paddingX: 5, paddingBottom: 5 }}>
                <Button
                    variant="contained"
                    name={'measurement_discard_counter'}
                    width={'100%'}
                    text={'common.button.cancel'}
                    onClick={handleCancelClick}
                >
                    {t('common.button.cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MeasurementUploadRetry;
