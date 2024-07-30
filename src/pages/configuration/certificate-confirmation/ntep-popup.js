import React from 'react'
import { useTranslation, Trans } from "react-i18next";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Typography, DialogContentText } from '@mui/material';

function NTEPConfirmation({ open, closeHandler }) {
    const { t } = useTranslation();
    return (
        <Dialog
            open={open}
            maxWidth={'xl'}
            fullWidth
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ sx: { padding: 4 } }}
        >

            <DialogTitle id="alert-dialog-title">
                {t('configurations.measurements.ntep.popup.title')}
            </DialogTitle>

            <DialogContent>

                <Typography variant="h4" sx={{ color: 'black' }}>
                    {t('configurations.measurements.ntep.popup.description')}
                </Typography>

                <DialogContentText id="alert-dialog-description" mt={10}>
                    <Alert severity="info" icon={false}>
                        <Typography mt={5} variant="h4" sx={{ color: 'black' }}>
                            {t('configurations.measurements.ntep.popup.point1')}
                        </Typography>
                        <Typography mt={5} variant="h4" sx={{ color: 'black' }}>
                            {t('configurations.measurements.ntep.popup.point2')}
                        </Typography>
                        <Typography mt={5} variant="h4" sx={{ color: 'black' }}>
                            {
                                <Trans
                                    i18nKey="configurations.measurements.ntep.popup.point3"
                                    components={[
                                        <span style={{ color: '#000' }}></span>
                                    ]}
                                />
                            }
                        </Typography>
                        <Typography mt={5} variant="h4" sx={{ color: 'black' }}>
                            {
                                <Trans
                                    i18nKey="configurations.measurements.ntep.popup.point4"
                                    components={[
                                        <span style={{ color: '#000' }}></span>
                                    ]}
                                />
                            }
                        </Typography>
                        <Typography mt={5} variant="h4" sx={{ color: 'black' }}>
                            {t('configurations.measurements.ntep.popup.point5')}
                        </Typography>
                        <Typography mt={5} variant="h4" sx={{ color: 'black' }}>
                            {t('configurations.measurements.ntep.popup.point6')}
                        </Typography>
                    </Alert>
                </DialogContentText>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={(e) => closeHandler(false)}
                    variant='outlined'
                    sx={{ width: '7em', fontSize: '2.6em', marginRight: 4 }}
                >
                    {t('common.button.cancel')}
                </Button>

                <Button
                    onClick={(e) => closeHandler(true)}
                    autoFocus
                    variant="contained"
                    sx={{ width: '7em', fontSize: '2.6em' }}
                >
                    {t('common.button.confirm')}
                </Button>

            </DialogActions>
        </Dialog>
    )
}

export default NTEPConfirmation