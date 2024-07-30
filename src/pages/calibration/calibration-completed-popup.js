import {
    Dialog,
    DialogContent,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import CalibrationCompleted from './components/calibration-completed';
import appState from '../../redux/reducers/measurement-states';
import { useSelector, useDispatch } from 'react-redux';

export default function CalibrationCompletedPopup() {

    const { is_open_calibration_completed_popup } = useSelector((state) => state.appState);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handlePopupClose = () => {
        dispatch(appState.actions.updateCalibrationSuccess(false));
    }

    const navigateToMeasurePage = () => {
        navigate('/measurement');
        handlePopupClose();
    }

    return (

        <Dialog
            open={is_open_calibration_completed_popup}
            aria-labelledby="calibrate-dialog"
            aria-describedby="calibrate-desc"
            maxWidth={'xl'}
        >
            <DialogContent
                id="alert-dialog-description"
                sx={{ display: 'flex', height: '35vh', width: '50vw', justifyContent: 'center', alignItems: 'center', }}
            >
                <CalibrationCompleted
                    goToMeasure={navigateToMeasurePage}
                    handleClose={handlePopupClose}
                />

            </DialogContent>
        </Dialog>

    );
}