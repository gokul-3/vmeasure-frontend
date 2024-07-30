import React, { useEffect } from 'react'
import softwareUpdateState from "../../../redux/reducers/software-update";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SoftwareUpdateState } from '../../../constants/sw-update';
import SoftwareButton from './sw-button';

function CloseButton({ enabledNavBar, redirectFromUpdatePage, closePopup = () => { } }) {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { software_update_state, } = useSelector((state) => state.softwareUpdate);


    const close = () => {
        // enabledNavBar();

        if (software_update_state === SoftwareUpdateState.READY_TO_UPDATE) {
            dispatch(softwareUpdateState.actions.updateSoftwareUpdateState({ update_state: SoftwareUpdateState.REBOOT_PENDING_AFTER_SUCCESS }));
        } else if (software_update_state !== SoftwareUpdateState.REBOOT_PENDING_AFTER_SUCCESS) {
            dispatch(softwareUpdateState.actions.updateSoftwareUpdateState({ update_state: SoftwareUpdateState.REINIT }));
        }

        if (redirectFromUpdatePage) {
            navigate('/menu')
        } else {
            closePopup()
        }
    }

    return (
        <SoftwareButton onClick={close} text={t('common.button.close')} />
    )
}

export default CloseButton;