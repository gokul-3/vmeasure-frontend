import React, { useEffect, useState } from "react";
import {
    useTheme,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function BarcodeValidationRetry({ fieldName, open, onBarcodeRetryCancel, reason, }) {

    // Add timer module on timer ends call onMeasurementTimerComplete

    const [isCancelled, setIsCancelled] = useState(false);

    const handleCancelClick = () => {
        onBarcodeRetryCancel(true);
        setIsCancelled(true)
    }

    useEffect(() => {
        if (open) {
            setIsCancelled(false)
        }
    }, [open])

    const theme = useTheme();

    const { t } = useTranslation()

    return (
        <Dialog
            maxWidth={'sm'}
            fullWidth
            open={open}
        >
            <DialogTitle>
                {t('measurement_page.barcode_validation_popup.title', { barcode_field: fieldName })}
            </DialogTitle>
            <DialogContent sx={{ height: '15vh', paddingX: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', rowGap: 5 }}>
                <div>
                    <Typography variant="h3">{t('measurement_page.barcode_validation_popup.retrying')}</Typography>
                </div>
                <div>
                    <LinearProgress sx={{ width: '100%' }} />
                </div>
                <div>
                    <Typography variant="body2">{reason}</Typography>
                </div>
            </DialogContent>
            <DialogActions sx={{ paddingX: 5, paddingBottom: 5 }}>
                <Button
                    variant="contained"
                    name={'measurement_discard_counter'}
                    width={'100%'}
                    text={'common.button.cancel'}
                    onClick={handleCancelClick}
                    disabled={isCancelled}
                >
                    {t('common.button.cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default BarcodeValidationRetry;
