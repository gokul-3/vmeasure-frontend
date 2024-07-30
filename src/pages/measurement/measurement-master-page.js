import React, { useRef, useEffect, useState } from "react";
import AdditionalImage from "./additional-image-page";
import DynamicPages from "./dynamic-page";
import MeasurementPage from "./measurement-page";
import { useDispatch, useSelector } from "react-redux";
import CalibrationPopup from "./calibration-popup";
import QueueFullPopup from "./queue-full-popup";
import { isMeasurementDataQueueFull, saveAdditionalImage, isMeasurementFlowInprogress, displayScaleReconnectPopup } from "../../services/measurement.service";
import { usePrompt } from "../../hooks/usePrompt";
import { useTranslation } from "react-i18next";
import AdditionalVideo from "./additional-video-page";
import appState from "../../redux/reducers/measurement-states";
import ErrorBoundary from "../../components/error-boundary/error-boundary";
import ScaleReconnectPopup from "../scales/scale-reconnect-popup";
import { MeasurementPageReloadState, MeasurementPages, MeasurementState, ProcessingState } from "../../constants";
import { useLocation } from "react-router-dom";
import { updateCurrentPageChange } from "../../services/utils.service";

function MeasurementMasterPage() {

    const [isAllowNavigation, setIsAllowNavigation] = useState(true);

    const pageCompletedStatus = useRef({
        isAdditionalImgCompleted: false,
        isDynamicPageCompleted: false,
        isMeasurementFlowCompleted: false,
        isAdditionalVideoPageCompleted: false
    });

    const { is_calibration_completed,
        measurement_state,
        is_measurement_check_needed,
        reload_measurement_page,
        current_measurmement_page: currentMeasurementPage,
        additional_video_state
    } = useSelector((state) => state.appState);
    const { is_scale_detected, is_scale_detached, name: weighing_scale, show_reconnect_popup } = useSelector((state) => state.settings.weighing_scale)
    const { workflow, enablePopup } = useSelector((state) => state.workflow);
    const { device_config_popup } = useSelector((state) => state.settings);
    const [dynamicPageData, setDynamicPageData] = useState(null);

    const [isQueueFull, setIsQueueFull] = useState(false);
    const queueFullTimer = useRef()

    const [subPageActions, setSubPageActions] = useState({
        dynamic_pages: false,
        additional_video: false,
        additional_image: false,
        measurement_page: false
    });

    const [showScaleReconnectDialog, setScaleReconnectDialog] = useState(false);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();

    const handleAdditionalImageComplete = (data) => {
        pageCompletedStatus.current.isAdditionalImgCompleted = true;
        handleMeasurementPageComponentChange();
        saveAdditionalImage(data).catch((err) => { })
    }

    const handleDynamicPageComplete = (data) => {
        setDynamicPageData(data);
        pageCompletedStatus.current.isDynamicPageCompleted = true;
        handleMeasurementPageComponentChange();
    }

    const pollForQueueFull = () => {
        if (queueFullTimer.current) {
            return;
        }
        queueFullTimer.current = setInterval(async () => {
            try {
                const result = await isMeasurementDataQueueFull();
                if (result?.status && !result?.data?.is_queue_full) {
                    handleMeasurementPageComponentChange();
                    clearInterval(queueFullTimer.current);
                    queueFullTimer.current = null;
                }
            } catch (error) {

            }
        }, 1000);
    }


    const handleMeasurementPageComponentChange = async () => {
        try {
            if (show_reconnect_popup && !is_calibration_completed) {
                dispatch(appState.actions.updateCurrentMeasurementPage(null));
                return
            }
            if (!is_calibration_completed && isAllowNavigation && !showScaleReconnectDialog) {
                dispatch(appState.actions.updateCurrentMeasurementPage(null));
                return
            }

            const result = await isMeasurementDataQueueFull()

            if (result?.status && result?.data?.is_queue_full) {
                dispatch(appState.actions.updateCurrentMeasurementPage(null));
                setIsQueueFull(true);
                pollForQueueFull();
                dispatch(appState.actions.updateCurrentMeasurementPage(null));
                return
            }

            setIsQueueFull(false);

            pageCompletedStatus.current.isMeasurementFlowCompleted = false;

            if (is_measurement_check_needed) {
                dispatch(appState.actions.initMeasurementState());
                dispatch(appState.actions.updateCurrentMeasurementPage(MeasurementPages.MEASUREMENT_PAGE));
                return
            }

            if (workflow?.ui_config?.dynamic_pages?.length && !pageCompletedStatus.current.isDynamicPageCompleted) {
                dispatch(appState.actions.updateCurrentMeasurementPage(MeasurementPages.DYNAMIC_PAGES));
                // setIsAllowNavigation(false)
                return;
            }

            if (workflow?.additional_image?.is_enabled &&
                workflow?.additional_imagise?.additional_images_titles?.length != 0 &&
                !pageCompletedStatus.current.isAdditionalImgCompleted
            ) {
                dispatch(appState.actions.updateCurrentMeasurementPage(MeasurementPages.ADDITIONAL_IMAGE));
                // setIsAllowNavigation(false)
                return;
            }

            if (workflow?.additional_video?.is_enabled && !pageCompletedStatus.current.isAdditionalVideoPageCompleted) {
                dispatch(appState.actions.updateCurrentMeasurementPage(MeasurementPages.ADDITIONAL_VIDEO));
                // setIsAllowNavigation(false)
                return;
            }

            dispatch(appState.actions.initMeasurementState());

            dispatch(appState.actions.updateCurrentMeasurementPage(MeasurementPages.MEASUREMENT_PAGE));

        } catch (error) {
            console.error(error);
        }

    }

    const resetMeasurementPageComponentStates = () => {
        pageCompletedStatus.current = {
            isAdditionalImgCompleted: false,
            isDynamicPageCompleted: false,
            isMeasurementFlowCompleted: false,
            isAdditionalVideoPageCompleted: false
        }
        setSubPageActions({
            dynamic_pages: false,
            additional_video: false,
            additional_image: false,
            measurement_page: false
        })
        isMeasurementFlowInprogress(false)
        setDynamicPageData(null);
    }

    const handleMeasurementProcessCompleted = async (data) => {

        if (data) {
            resetMeasurementPageComponentStates();
            handleMeasurementPageComponentChange();
        } else {
            const result = await isMeasurementDataQueueFull()

            if (result?.data?.is_queue_full) {
                handleMeasurementPageComponentChange();
                setIsAllowNavigation(true);
            }
        }
        //when clear button is clicked. changing if measure page to false
        displayScaleReconnectPopup(true)
        if (show_reconnect_popup) {
            dispatch(appState.actions.updateCurrentMeasurementPage(null));
            return
        }
    }

    const emptyCurrentMeasurePage = () => {
        dispatch(appState.actions.updateCurrentMeasurementPage(null));
    }


    useEffect(() => {
        handleMeasurementPageComponentChange();
    }, [
        is_calibration_completed,
    ]);

    const [prompt] = usePrompt(
        t('measurement_page.navigate_confirmation_popup.title'),
        t('measurement_page.navigate_confirmation_popup.content'),
        !isAllowNavigation
    );

    const handleAdditionalVideoComplete = () => {
        pageCompletedStatus.current.isAdditionalVideoPageCompleted = true;
        handleMeasurementPageComponentChange();
    }

    const resetMeasurementPageStates = () => {
        // On navigation to other pages, clear the measurement data
        dispatch(appState.actions.clearMeasurementData({
            is_clear_all: true
        }));

        dispatch(appState.actions.resetMeasurementTimer());

        if (workflow?.support_trigger?.is_weighing_scale_trigger_enabled && weighing_scale !== 'none') {
            dispatch(appState.actions.disableWeighingScaleTrigger());
        }


        if (workflow?.support_trigger?.is_measurement_trigger_enabled) {
            dispatch(appState.actions.disableSmartMeasurementTrigger());
        }

        // On navigation to other pages, handle the mandatory calibration
        isMeasurementFlowInprogress(false);
    }


    useEffect(() => {

        dispatch(appState.actions.resetMeasurementTimer());

        return () => {
            resetMeasurementPageStates()
        }

    }, []);

    const handleDynamicPageAction = () => {
        setSubPageActions({
            ...subPageActions,
            dynamic_pages: true
        });
    }

    const handleAdditionalImageAction = () => {
        setSubPageActions({
            ...subPageActions,
            additional_image: true
        });
    }

    const handleAdditionalVideoAction = () => {
        setSubPageActions({
            ...subPageActions,
            additional_video: true
        });
    }

    const handleMeasurementPageAction = () => {
        setSubPageActions({
            ...subPageActions,
            measurement_page: true
        });
    }

    useEffect(() => {

        const blockNavigation =
            subPageActions.dynamic_pages ||
            subPageActions.additional_image ||
            subPageActions.additional_video ||
            subPageActions.measurement_page

        isMeasurementFlowInprogress(blockNavigation)
        setIsAllowNavigation(!blockNavigation);

    }, [subPageActions])

    useEffect(() => {

        dispatch(appState.actions.initMeasurementState());

        return () => {
            if (queueFullTimer.current) {
                clearInterval(queueFullTimer.current);
            }
        }
    }, []);

    const handleMeasurementClearStateStart = (measurementResult) => {
        /**
         * If measurement is succes then allow the naviagtion
         * For failure measurement with additional data page, block the navigation
         */
        if (measurementResult?.status) {
            setIsAllowNavigation(true);
        } else {
            const blockNavigation = subPageActions.dynamic_pages ||
                subPageActions.additional_image ||
                subPageActions.additional_video;
            setIsAllowNavigation(!blockNavigation)
        }
    }

    useEffect(() => {
        if (show_reconnect_popup) {
            setScaleReconnectDialog(true);
            setIsAllowNavigation(true);
            dispatch(appState.actions.updateCurrentMeasurementPage(null));
        }
        if (is_scale_detected || is_scale_detached) {
            dispatch(appState.actions.updateCurrentMeasurementPage(null));
        }

    }, [is_scale_detected, currentMeasurementPage, is_scale_detached, show_reconnect_popup])

    //useEffect used to update measure page status
    useEffect(() => {
        //variable used to only increment and wont decrement
        if (currentMeasurementPage === MeasurementPages.ADDITIONAL_VIDEO) {
            displayScaleReconnectPopup(false)
        } else {
            displayScaleReconnectPopup(true)
        }

        return () => {
            displayScaleReconnectPopup(true)
        }
    }, [currentMeasurementPage, show_reconnect_popup])

    useEffect(() => {

        if (reload_measurement_page === MeasurementPageReloadState.RELOAD_REQUIRED &&
            additional_video_state !== 'start' &&
            (
                measurement_state.currentState < MeasurementState.MEASUREMENT ||
                (measurement_state.currentState === MeasurementState.MEASUREMENT &&
                    measurement_state.processingState == ProcessingState.INIT) ||
                    measurement_state.currentState === MeasurementState.DONE
            )
        ) {

            resetMeasurementPageStates();

            resetMeasurementPageComponentStates();

            dispatch(appState.actions.updateCurrentMeasurementPage(null));
            dispatch(appState.actions.resetRetainableFields())

            handleMeasurementPageComponentChange();

            // During page reload need to indicate pathname
            updateCurrentPageChange(location.pathname);

            dispatch(appState.actions.updateMeasurementReloadState(MeasurementPageReloadState.RELOAD_COMPLETED));

        }

    }, [reload_measurement_page])


    return (
        <ErrorBoundary>

            {
                currentMeasurementPage === MeasurementPages.DYNAMIC_PAGES &&
                <DynamicPages
                    onAction={handleDynamicPageAction}
                    onComplete={handleDynamicPageComplete}
                />
            }
            {
                currentMeasurementPage === MeasurementPages.ADDITIONAL_VIDEO &&
                <AdditionalVideo
                    onAction={handleAdditionalVideoAction}
                    onComplete={handleAdditionalVideoComplete}
                />
            }
            {
                currentMeasurementPage === MeasurementPages.ADDITIONAL_IMAGE &&
                <AdditionalImage
                    onAction={handleAdditionalImageAction}
                    onComplete={handleAdditionalImageComplete}
                />
            }
            {
                currentMeasurementPage === MeasurementPages.MEASUREMENT_PAGE &&
                <MeasurementPage
                    dynamicPageData={dynamicPageData}
                    onMeasurementProcessCompleted={handleMeasurementProcessCompleted}
                    onMeasurementClearStateStarted={handleMeasurementClearStateStart}
                    onAction={handleMeasurementPageAction}
                />
            }
            {
                !device_config_popup && !showScaleReconnectDialog && !is_calibration_completed && isAllowNavigation &&
                <CalibrationPopup />
            }
            {
                isQueueFull &&
                <QueueFullPopup />
            }

            {showScaleReconnectDialog
                && (currentMeasurementPage !== MeasurementPages.ADDITIONAL_VIDEO)
                && (is_scale_detached || is_scale_detected)
                // && (currentMeasurementPage !== MeasurementPages.MEASUREMENT_PAGE || isAllowNavigation)
                && <ScaleReconnectPopup
                    isMeasurePage={true}
                    is_scale_detached={is_scale_detached}
                    is_scale_detected={is_scale_detected}
                    emptyCurrentMeasurePage={emptyCurrentMeasurePage}
                />
            }
            {!showScaleReconnectDialog && prompt}

        </ErrorBoundary >
    )
}

export default MeasurementMasterPage;
