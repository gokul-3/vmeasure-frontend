import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import deviceAPI from "../../redux/reducers/device-api"
import { useSelector, useDispatch } from "react-redux";
import { DeviceAppAuth, TimerForDeviceAPIAuthConfirmation } from '../../constants';
import { sendDeviceAuthResponse } from '../../services/device-api.service';
import { useTranslation,Trans } from "react-i18next";

function DeviceAPIAuthPopup() {

    const { t } = useTranslation();
    const { showConfirmation, pairedStatus } = useSelector((state) => state.deviceAPI);
    const dispatch = useDispatch();

    const [counter, setCount] = useState(TimerForDeviceAPIAuthConfirmation);
    const [buttonDisable, setButtonDisable] = useState(false);
    const [timer, setTimer] = useState(null)

    const startTimer = () => {
        if (showConfirmation) {
            setButtonDisable(false);
            setCount(TimerForDeviceAPIAuthConfirmation);
            console.log("INTERVAL STARTED");
            const timeLoop = setInterval(() => {
                setCount(prevCounter => {
                    if (prevCounter === 0) {
                        clearTimer();
                        pairCloseWithNegative();
                        console.log("INTERVAL CLEARED");
                        return prevCounter
                    } else {
                        console.log("INTERVAL RUNNING", prevCounter - 1);
                        return prevCounter - 1;
                    }
                });
            }, 1000);
            setTimer(timeLoop);
        } else {
            clearTimer();
        }
    }

    const clearTimer = () => {
        setButtonDisable(true);
        if (timer) {
            clearInterval(timer);
            console.log("INTERVAL CLEARED");
            setTimer(null);
        }
    }

    useEffect(() => {
        startTimer();
        return clearTimer
    }, [showConfirmation]);


    const pairCloseWithNegative = () => {
        setButtonDisable(true);
        dispatch(deviceAPI.actions.closeConfirmation({
            showConfirmation: false,
            lastAction: DeviceAppAuth.DENIED,
            pairedStatus: pairedStatus
        }));
        sendDeviceAuthResponse(DeviceAppAuth.DENIED)
    };

    const pairCloseWithPositive = () => {
        setButtonDisable(true);
        dispatch(deviceAPI.actions.closeConfirmation({
            pairingConfirmationOpen: false,
            lastAction: DeviceAppAuth.APPROVED,
            pairedStatus: true,
        }));
        sendDeviceAuthResponse(DeviceAppAuth.APPROVED)
    };

    return (
        <Dialog
            open={showConfirmation}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="lg"

        >
            <DialogTitle
                id="alert-dialog-title"
                sx={{ margin: "0px 20px" }}
                component="span"
            >
                <Typography variant="h3" mt={5}>
                    {t('desktop_app.pair_request_popup.title')}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ margin: "20px" }}>
                <DialogContentText id="alert-dialog-description" component="span">
                    <Typography variant="h4">
                        {t('desktop_app.pair_request_popup.confirmation_text')}
                    </Typography>

                    <Typography variant="body2" component="h1" fontSize={'1em'} mt={10}>
                        <Trans
                            i18nKey="desktop_app.pair_request_popup.timer_text"
                            components={[<b></b>,]}
                            values={{ counter }}
                        />
                    </Typography>

                    <Typography variant="body2" component="h1" fontSize={'1em'} mt={2}>
                        <Trans
                            i18nKey="desktop_app.pair_request_popup.note_text"
                            components={[<b></b>,]}
                        />
                    </Typography>
                </DialogContentText>

            </DialogContent>
            <DialogActions sx={{ margin: "2%" }}>
                <Button
                    disabled={buttonDisable}
                    onClick={pairCloseWithNegative}
                    style={{
                        fontSize: "2.5em",
                        margin: "0",
                    }}
                >
                    {t("desktop_app.pair_request_popup.dont_allow")}
                </Button>
                <Button
                    disabled={buttonDisable}
                    variant="contained"
                    style={{
                        fontSize: "2.5em",
                        marginRight: "0.5vw",
                    }}
                    onClick={pairCloseWithPositive}
                    autoFocus
                >
                    {t("desktop_app.pair_request_popup.allow")}
                </Button>

            </DialogActions>
        </Dialog>
    )
}

export default DeviceAPIAuthPopup