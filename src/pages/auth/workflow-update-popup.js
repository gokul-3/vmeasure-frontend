import React, { useState, useEffect, useRef } from "react";
import {
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    DialogContentText
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import workflow from '../../redux/reducers/workflow'
import applicationState from "../../redux/reducers/application-state";
import customWorkflow from "../../redux/reducers/custom-workflow";
import { downloadWorkflow } from "../../services/workflow.service";
import WorkflowDownloadDialog from "./workflow-download";
import appState from "../../redux/reducers/measurement-states";
import { MeasurementPageReloadState, MeasurementPages, MeasurementState, ProcessingState } from "../../constants";
import PopupButton from "../../components/button/popup-button";
import { PreDefinedPages } from "../../constants/custom-flow";

const WorkFlowUpdatedPopup = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { enablePopup, status: workflowDownloadStatus, restricted_features } = useSelector((state) => state.workflow)
    const { current_measurmement_page, measurement_state, start_measurement_timer } = useSelector((state) => state.appState);
    const { showWorkflowUpdatePopup: workflowUpdatePopupFlagFromCustomService, customServiceInfo, pageAttribute } = useSelector(state => state.customFlow);

    const [showWorkflowPopup, setShowWorkflowPopup] = useState(false);
    const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const workflowDataRef = useRef(null);

    useEffect(() => {
        if (enablePopup &&
            (location.pathname !== '/measurement' ||
                (
                    current_measurmement_page === MeasurementPages.DYNAMIC_PAGES ||
                    ( !customServiceInfo.isAvailable && current_measurmement_page === MeasurementPages.ADDITIONAL_IMAGE) ||
                    (
                        current_measurmement_page === MeasurementPages.MEASUREMENT_PAGE &&
                        !start_measurement_timer &&
                        measurement_state?.currentState < MeasurementState.MEASUREMENT &&
                        !customServiceInfo.isAvailable
                    )
                ) || workflowUpdatePopupFlagFromCustomService
            )
        ) {
            setShowWorkflowPopup(true);
        }

    }, [enablePopup, current_measurmement_page, measurement_state, location.pathname, workflowUpdatePopupFlagFromCustomService])

    const handleWorkflowSuccess = () => {
        dispatch(workflow.actions.onWorkflowDonwloadSuccess(workflowDataRef.current));
        dispatch(applicationState.actions.updateDeviceModeAndPermission(workflowDataRef.current));
        dispatch(customWorkflow.actions.updateCustomServiceInfo(workflowDataRef.current));
        if (location.pathname === '/measurement') {
            dispatch(appState.actions.updateMeasurementReloadState(MeasurementPageReloadState.RELOAD_REQUIRED));
        }
        setWorkflowDialogOpen(false);
    }

    const handleWorkflowDownloadSuccess = (workflowData) => {

        // Reset volumetric divisor retainable value after successful workflow download
        dispatch(appState.actions.resetRetainableFields())

        // If there is any restricted features, we need to show the warning to user
        // So avoid the popup close
        if (workflowData?.data?.resticted_features?.length) {
            dispatch(workflow.actions.onWorkflowRestrictedConflicts(workflowData?.data?.resticted_features));
        } else {
            handleWorkflowSuccess();
        }
    }

    const handleWorkflowClose = () => {
        dispatch(workflow.actions.clearWorkflow())
        setWorkflowDialogOpen(false);
        navigate('/');
    }

    const handleWorkflowDownloadFailure = (workflowData) => {
        dispatch(workflow.actions.onWorkflowDownloadFailure(workflowData));
        dispatch(applicationState.actions.resetDeviceModeAndPermission());
    }

    const downloadUpdatedWorkflow = async () => {
        try {
            setShowWorkflowPopup(false);
            setIsLoading(true);
            setWorkflowDialogOpen(true);
            const workflowResponse = await downloadWorkflow();
            workflowDataRef.current = { ...workflowResponse }

            if (workflowResponse.status) {
                handleWorkflowDownloadSuccess(workflowResponse);
            } else {
                handleWorkflowDownloadFailure(workflowResponse)
            }

            dispatch(workflow.actions.openWorkflowUpdatePopup(false));
            setIsLoading(false);
        } catch (error) {
            console.error('here it errr : ', error); //console.error to send logs to application log
            const errorData = error?.response?.data?.message ? error.response.data.message : error.message
            handleWorkflowDownloadFailure(errorData);
            dispatch(workflow.actions.openWorkflowUpdatePopup(false));
        }
    }

    const handleClosePopup = () => {
        setShowWorkflowPopup(false);
        dispatch(workflow.actions.openWorkflowUpdatePopup(false));
    }

    return (
        <Grid container height={'100%'}>
            <Dialog
                maxWidth={'md'}
                fullWidth
                open={showWorkflowPopup}
                PaperProps={{ sx: { padding: 4 } }}
            >
                <DialogTitle id="alert-dialog-title">
                    {t('workflow_update_popup.title')}
                </DialogTitle>
                <DialogContent id="alert-dialog-description"
                >
                    <DialogContentText id="alert-dialog-description">
                        {
                            location.pathname !== '/measurement' ?
                                t('workflow_update_popup.content')
                                :
                                t('workflow_update_popup.content_measurement_reset')
                        }
                        {workflowUpdatePopupFlagFromCustomService && pageAttribute?.pageType?.type === PreDefinedPages.MEASUREMENT_PAGE &&
                            <>
                                <br />
                                <Typography variant="body3" sx={{ paddingTop: 5, color: '#f44336' }}>
                                    <Trans
                                        i18nKey="custom_flow_common_text.custom_workflow_content"
                                        components={[<b></b>,]}
                                    />
                                </Typography>
                            </>
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ paddingBottom: 4 }}>
                    <PopupButton
                        buttonVariant='outlined'
                        onClick={handleClosePopup}
                        text={t('workflow_update_popup.later')}
                    />
                    <PopupButton
                        onClick={downloadUpdatedWorkflow}
                        text={t('workflow_update_popup.yes')}
                    />
                </DialogActions>
            </Dialog>
            <WorkflowDownloadDialog
                open={workflowDialogOpen}
                isLoading={isLoading}
                onClose={handleWorkflowClose}
                handleWorkflowSuccess={handleWorkflowSuccess}
                restrictedFeatures={restricted_features}
                isSuccess={workflowDownloadStatus}
            />
        </Grid>
    )
}

export default WorkFlowUpdatedPopup;
