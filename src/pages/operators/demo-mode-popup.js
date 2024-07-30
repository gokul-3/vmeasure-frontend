import React, { useState } from 'react'
import PopupButton from '../../components/button/popup-button'
import applicationState from "../../redux/reducers/application-state";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Box } from '@mui/material'
import { useTranslation, Trans } from 'react-i18next'
import { useDispatch } from "react-redux"
import * as demoService from "../../services/demo.service";

const DemoModeConfirmation = ({ maxMeasurement }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [buttonClicked, setButtonClicked] = useState(false);

    const handleClose = async (event, isDemoModeConfirmed = false) => {
        setButtonClicked(true);
        if (!isDemoModeConfirmed) {
            await demoService.revokeDemoMode();
            dispatch(applicationState.actions.updatedDemoModeActiveStatus(false))
            dispatch(applicationState.actions.updateDemoModeConfirmationPopup(false));
            return;
        }
        await demoService.acceptDemoMode();
        dispatch(applicationState.actions.updatedDemoModeActiveStatus(true));
        dispatch(applicationState.actions.updateDemoModeConfirmationPopup(false));
    };



    const content = <>
        <Box my={10}>
            <Typography variant="h3" sx={{ color: 'black' }}>
                {t('demo_mode.content')}
            </Typography>
            <Box mt={5}>
                <Typography variant='body1' fontSize={'1em'} fontWeight={"bold"} mt={2} sx={{ color: 'black' }}>1.{" "}
                    <Trans
                        i18nKey="demo_mode.notes.line1"
                        components={[
                            <span style={{ color: '#307EC7' }}></span>,
                        ]}
                    />
                </Typography>
                <Typography variant='body1' fontSize={'1em'} fontWeight={"bold"} mt={2} sx={{ color: 'black' }}>2.{" "}
                    <Trans
                        i18nKey="demo_mode.notes.line2"
                        components={[
                            <span style={{ color: '#307EC7' }}></span>,
                        ]}
                        values={{ measurement_count: maxMeasurement }}
                    />
                </Typography>
                <Typography variant='body1' fontSize={'1em'} fontWeight={"bold"} mt={2} sx={{ color: 'black' }}>3.{" "}
                    <Trans
                        i18nKey="demo_mode.notes.line3"
                        components={[
                            <span style={{ color: '#307EC7' }}></span>,
                        ]}
                        values={{ measurement_count: maxMeasurement }}
                    />
                </Typography>
                <Typography variant='body1' fontSize={'1em'} fontWeight={"bold"} mt={2} sx={{ color: 'black' }}>4.{" "}
                    <Trans
                        i18nKey="demo_mode.notes.line4"
                    />
                </Typography>
                <Typography variant='body1' fontSize={'1em'} fontWeight={"bold"} mt={2} sx={{ color: 'black' }}>5.{" "}
                    <Trans
                        i18nKey="demo_mode.notes.line5"
                    />
                </Typography>
                <Typography variant='body1' fontSize={'1em'} fontWeight={"bold"} mt={2} sx={{ color: 'black' }}>6.{" "}
                    <Trans
                        i18nKey="demo_mode.notes.line6"
                    />
                </Typography>
            </Box>
        </Box>
    </>

    return (
        <Dialog
            open={true}
            maxWidth={'xl'}
            fullWidth
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ sx: { padding: 4 } }}
        >
            <DialogTitle id="alert-dialog-title">
                <Typography variant="h3" sx={{ color: 'black' }}>
                    {t('demo_mode.title')}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <PopupButton
                    buttonVariant='outlined'
                    onClick={handleClose}
                    text={t('demo_mode.button_deny')}
                    disable={buttonClicked}
                />

                <PopupButton
                    onClick={(e) => handleClose(e, true)}
                    text={t('demo_mode.button_accept')}
                    mr={'0.2em'}
                    disable={buttonClicked}
                />
            </DialogActions>
        </Dialog>
    )
}

export default DemoModeConfirmation