import React from "react";
import Grid from "@mui/material/Grid";
import appState from "../../redux/reducers/measurement-states";
import applicationState from "../../redux/reducers/application-state"
import externalInput from "../../redux/reducers/external-input";
import RootController from "./root-controller";
import LoaderContainer from "./components/utils/loader-container";
import appStateReducer from "../../redux/reducers/measurement-states"
import ServiceNotFound from "./components/utils/service-not-found";
import CalibrationPopup from "../measurement/calibration-popup";
import customFlowReducer from "../../redux/reducers/custom-workflow";
import ScaleAndQueuePopupHandler from "./components/utils/popup-handler";
import { useNavbar } from "../../hooks/useNavbar";
import { usePrompt } from "../../hooks/usePrompt";
import { useNetwork } from '../../hooks/useNetwork'
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux";
import { MessageType, PreDefinedPages, UIProps } from "../../constants/custom-flow";
import { updateMetaDataOnFormChange } from "./utils/common";
import { useEffect, useRef, useState } from "react";
import { displayScaleReconnectPopup, isMeasurementDataQueueFull } from "../../services/measurement.service";
import { MeasurementState, MeasurementPageReloadState } from "../../constants";
import * as customServiceAPI from "./service/custom.flow.service"

const CustomFlowMasterController = ({ isConfigPage = false }) => {

  const { t } = useTranslation();
  const queueFullTimer = useRef(null)
  const metaDataRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [networkStatus] = useNetwork()
  const [disabledNavBar, enabledNavBar] = useNavbar();

  const { pageAttribute, pageLayout, pageFormData, currentPageID, blockPopupsAfterMeasureStart, loader } = useSelector(state => state.customFlow);
  const { is_scale_detected, is_scale_detached, name: weighing_scale, show_reconnect_popup } = useSelector((state) => state.settings.weighing_scale)
  const { is_calibration_completed, measurement_state, reload_measurement_page } = useSelector((state) => state.appState);
  const { workflow } = useSelector((state) => state.workflow);

  const [showPopups, setShowPopups] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [showScaleReconnectDialog, setScaleReconnectDialog] = useState(false);
  const [showQueueFullDialog, setQueueFullDialog] = useState(false);
  const [disableBack, setDisableBack] = useState(false);
  const [isCustomServiceResponding, setIsCustomServiceResponding] = useState(true);
  const [firstPageInfo, setFirstPageInfo] = useState({ popup_default_page: null, firstPage: null });

  //utils functions
  const setFooterMessage = (messageString, messageType,) => {
    dispatch(customFlowReducer.actions.setMessage({ messageType, messageString }));
  }

  const updateCurrentPageId = (currentPageID) => {
    dispatch(customFlowReducer.actions.setCurrentPageId(currentPageID));
  }

  const updatePreviousPageId = (previousPageId) => {
    dispatch(customFlowReducer.actions.setPreviousPageId(previousPageId));
  }

  const updateBlockPopupsAfterMeasureStart = (status) => {
    dispatch(customFlowReducer.actions.setBlockPopupsAfterMeasureStart(status));
  }

  const showButtons = () => {
    dispatch(customFlowReducer.actions.setDisablePageAction(false))
    isConfigPage && setDisableBack(false)
  }

  const hideButtons = () => {
    dispatch(customFlowReducer.actions.setDisablePageAction(true))
    isConfigPage && setDisableBack(true)
  }

  const showLoader = () => {
    dispatch(customFlowReducer.actions.showLoader())
    isConfigPage && setDisableBack(true)
  }

  const hideLoader = () => {
    dispatch(customFlowReducer.actions.hideLoader())
    isConfigPage && setDisableBack(false)
  }

  const handleBackClick = () => {
    if (pageAttribute?.onBack) {
      triggerEventAPI(pageAttribute?.onBack)
    }
  }

  const stopWeighingScaleTrigger = () => {
    if (workflow?.support_trigger?.is_weighing_scale_trigger_enabled && weighing_scale !== 'none') {
      dispatch(appState.actions.disableWeighingScaleTrigger());
    }
  }

  const handleOnPageEntryEvent = () => {
    if (currentPageID) {
      triggerEventAPI(pageAttribute?.onEntry)
    }
  }

  const setWorkflowUpdatePopup = (isShowPopups) => {
    dispatch(customFlowReducer.actions.updateWorkflowPopup(isShowPopups));
  }

  const isBarcodeEnabled = () => {
    return workflow?.barcode_config?.is_enabled
  }

  const isMeasurementStarted = ({ currentState }) => {
    if (isBarcodeEnabled()) {
      return currentState >= MeasurementState.READY
    } else {
      return currentState > MeasurementState.READY
    }
  }

  const onCustomServiceExit = () => {
    activatePageControls({ enableNav: true });
    stopWeighingScaleTrigger()
    displayScaleReconnectPopup(true)
    setWorkflowUpdatePopup(false);
    updateBlockPopupsAfterMeasureStart(false);
    clearInterval(queueFullTimer.current);
    dispatch(customFlowReducer.actions.setCurrentPageId(null));
    dispatch(customFlowReducer.actions.resetMessage());
    dispatch(customFlowReducer.actions.updatePageAttribute(null));
    dispatch(customFlowReducer.actions.updatePageLayout(null));
    dispatch(customFlowReducer.actions.setPageFormData(null));
    customServiceAPI.handleFlowInterrupt()
  }

  const handleMeasurementStateChange = () => {
    setShowPrompt(canShowPrompt());
  }

  /** Function that determind whethere workflow update and weighing scale popup can be shown */
  const canShowPopups = () => {
    return (
      isConfigPage ||
      currentPageID === firstPageInfo?.popup_default_page ||
      pageAttribute?.pageType?.isCycleComplete ||
      pageAttribute?.pageLoadActions?.canShowPopups ||
      pageAttribute?.pageType?.type === PreDefinedPages.MEASUREMENT_PAGE
    )
  }

  /** Function that take decision for navigation prompt based on the current page type, and measurement states */
  const canShowPrompt = () => {
    //no prompt required, if the current page is starting page or page is custom config
    if (currentPageID === firstPageInfo?.firstPage) {
      //if first page is measurement page show prompt after measirement trigger
      if (pageAttribute?.pageType?.type === PreDefinedPages.MEASUREMENT_PAGE) {
        return isMeasurementStarted(measurement_state)
      }
      //if first page is not a measure page
      return false
    }

    // if the current page is meaurement page but not first page then the prompt is required by default
    if (pageAttribute?.pageType?.type == PreDefinedPages.MEASUREMENT_PAGE) {
      return true;
    }

    //for all other page propmpt is required if preventPromptOnExit not set in custom serice
    return !pageAttribute?.pageLoadActions?.preventPromptOnExit
  }

  /** Function to check the available popups */
  const startCheckingStandardPopups = async () => {
    const isShowPopups = canShowPopups(); //checking for popups can be shown
    if (isShowPopups) {
      const { status, data } = await isMeasurementDataQueueFull();
      if (status && data?.is_queue_full) {
        setQueueFullDialog(true);
        setShowPopups(false); // make hide other popups
        pollForQueueFull();
        return
      }
    }
    setShowPopups(isShowPopups);
  }

  //** Is blocking popup triggered */
  const updateIsBlockingPopupOpenStatus = (popup_status) => {
    dispatch(applicationState.actions.updateIsBlockingPopupOpened(popup_status))
  }

  /** Function to check the queue size every one sec after popup appear in frontend  */
  const pollForQueueFull = () => {
    if (queueFullTimer.current) {
      return;
    }
    queueFullTimer.current = setInterval(async () => {
      try {
        const result = await isMeasurementDataQueueFull();
        if (result?.status && !result?.data?.is_queue_full) {
          setQueueFullDialog(false);
          updateIsBlockingPopupOpenStatus(false);
          clearInterval(queueFullTimer.current);
          queueFullTimer.current = null;
        }
      } catch (error) {

      }
    }, 1000);
  }

  /** Function that handle all state and props updates on each page render and event triggers as well */
  const updatePageUI = async (schema, formData, meta, currentPageID, errorMessage = null, successMessage = null) => {
    const { attribute = {}, layout = {} } = schema;
    //reset success/error messages when an action occurs to avoid retention when null
    dispatch(customFlowReducer.actions.resetMessage());
    dispatch(externalInput.actions.emitExternalInputValue({ value: "" }));

    metaDataRef.current = meta;
    dispatch(customFlowReducer.actions.updatePageAttribute(attribute));
    dispatch(customFlowReducer.actions.updatePageLayout(layout));
    dispatch(customFlowReducer.actions.setPageFormData(formData));
    updateCurrentPageId(currentPageID)

    //Handle Prompt and Navbar
    setShowPrompt(canShowPrompt());
    if (!attribute?.pageLoadActions?.disableNavbar) { enabledNavBar() }

    //Footer Message Handler
    if (successMessage) { setFooterMessage(successMessage, MessageType.SUCCESS) }
    if (errorMessage) { setFooterMessage(errorMessage, MessageType.ERROR) }
  }

  /** Function to handle navbar, buttons, loader toggles  */
  const activatePageControls = ({ enableNav }) => {
    hideLoader();
    showButtons();
    if (enableNav) { enabledNavBar() }
  }

  /** Function to get a new page from custom service. For Each navigation this function will be called with next page id */
  const renderNewPage = async (nextPageId) => {
    const { status, error, data } = await customServiceAPI.loadPage(nextPageId);
    if (!status) {
      activatePageControls({ enableNav: true })
      setFooterMessage(error?.errorMessage || "Unable to obtain page information", MessageType.ERROR)
      return
    }

    const { pageSchema, metaData, formData } = data;
    if (!pageSchema || !metaData || !formData) {
      activatePageControls({ enableNav: true })
      setFooterMessage("Unable to process page schema", MessageType.ERROR)
      return;
    }

    dispatch(externalInput.actions.emitExternalInputValue({ value: "" }));
    updatePageUI(pageSchema, formData, metaData, nextPageId, null, null);

    if (pageSchema?.attribute?.pageType?.isCycleComplete && blockPopupsAfterMeasureStart) {
      updateBlockPopupsAfterMeasureStart(false) //popup block/release
    }
  }

  /** Function That start loading first page into current route */
  const loadFirstPage = async () => {
    showLoader();
    disabledNavBar();

    const { data, status, error } = await customServiceAPI.getFirstPage();
    if (!status || !data.firstPage) {
      setFooterMessage(error?.errorMessage || "Something went wrong in custom service. Please contact site admin!", MessageType.ERROR);
      setIsCustomServiceResponding(false)
      activatePageControls({ enableNav: true });
      return
    }

    setFirstPageInfo(data)
    setIsCustomServiceResponding(true);
    await renderNewPage(data.firstPage);
    activatePageControls({ enableNav: false });
  }

  //load configuration setting page
  const loadConfigPage = async () => {
    showLoader();

    const { data, status, error } = await customServiceAPI.getConfigPage();
    if (!status || !data) {
      setIsCustomServiceResponding(false)
      activatePageControls({ enableNav: true });
      setFooterMessage(error?.errorMessage || "something went wrong on configFirstPage", MessageType.ERROR);
      return
    }

    setIsCustomServiceResponding(true)
    await renderNewPage(data)
    hideLoader();
  }

  /**Function that send event apis call to custom service */
  const sendEventCall = async (url, pageId, metaData, additionalInfo) => {
    const additionalInformations = { ...additionalInfo, isNetworkAvailable: networkStatus() }
    const { data, status } = await customServiceAPI.eventAPI(url, metaData, additionalInformations);

    //if axios error
    if (!status) {
      setFooterMessage("Unable to communicate with custom service", MessageType.ERROR);
      activatePageControls({ enableNav: true });
      return false;
    }

    //if handled error 
    if (!data?.status) {
      updatePageUI(data.pageSchema, data.formData, data.metaData, pageId, data?.error?.errorMessage, null);
      activatePageControls({ enableNav: false })
      return false;
    }

    //if schema missing
    if (!data?.pageSchema?.attribute || !data?.pageSchema?.layout || !data.metaData) {
      setFooterMessage("Unable to process page schema", MessageType.ERROR);
      activatePageControls({ enableNav: true });
      return false;
    }

    //handler navigation. if navigate?.path exist need to redirect 
    //Either to a custom page using renderNewPage or predefined page using navigate
    if (data?.navigate?.path) {
      if (data?.navigate?.isPredefined) {
        updateCurrentPageId(null)
        activatePageControls({ enableNav: true });
        navigate(data.navigate?.path);
      } else {
        updatePreviousPageId(currentPageID); //set current page as previos page before navigate to new page
        updateCurrentPageId(null)
        await renderNewPage(data.navigate?.path);
        activatePageControls({ enableNav: false });
      }
      return
    }

    //After success update local Refs and global redux states
    updatePageUI(data.pageSchema, data.formData, data.metaData, pageId, null, data?.success?.successMessage);
    activatePageControls({ enableNav: false });
    return
  }

  /**Funtion that initiate events to custom service */
  const triggerEventAPI = (url, additionalInfo = {}) => {
    if (!url || showQueueFullDialog || showScaleReconnectDialog) { return }
    hideButtons();
    disabledNavBar();
    setTimeout(() => { sendEventCall(url, currentPageID, metaDataRef.current, additionalInfo) }, 0);
  }




  /* useEffect which trigger very initial call */
  useEffect(() => {
    isConfigPage ? loadConfigPage() : loadFirstPage();
    displayScaleReconnectPopup(false)
    return onCustomServiceExit
  }, []);


  /* used to reload page on workflow update */
  useEffect(() => {
    if (reload_measurement_page === MeasurementPageReloadState.RELOAD_REQUIRED) {
      dispatch(appStateReducer.actions.initMeasurementState());
      dispatch(appStateReducer.actions.updateMeasurementReloadState(MeasurementPageReloadState.RELOAD_COMPLETED));
      if (pageAttribute?.pageType?.preDefined && pageAttribute?.pageType?.type === PreDefinedPages.MEASUREMENT_PAGE) {
        navigate('/menu') //redirect to menu page if workflow update popup emerged in measurement page with proper notification
      }
    }
  }, [reload_measurement_page]);


  /* Trigger required action on new page */
  useEffect(() => {
    if (currentPageID) {
      dispatch(appStateReducer.actions.initMeasurementState());
      startCheckingStandardPopups();
      setShowPrompt(canShowPrompt());
      handleOnPageEntryEvent()
    }
  }, [currentPageID]);


  /* update local meta data ref on each form on-change event */
  useEffect(() => {
    if (pageFormData && currentPageID && metaDataRef.current) {
      metaDataRef.current = updateMetaDataOnFormChange(metaDataRef.current, currentPageID, pageFormData);
    }
  }, [pageFormData, currentPageID]);


  /* If Custom Service crashed in between need to enable navebar */
  useEffect(() => {
    if (!isCustomServiceResponding) {
      enabledNavBar();
      setShowPrompt(false);
    }
  }, [isCustomServiceResponding]);


  /* show/hide prompt and popups based on measurement state change */
  useEffect(() => {
    setShowPrompt(canShowPrompt());
    if (isMeasurementStarted(measurement_state)) {
      updateBlockPopupsAfterMeasureStart(true);
      setShowPopups(false);
      return
    }
  }, [measurement_state]);


  /**popup conditions */
  useEffect(() => {
    const isMeasurementInProgress = isMeasurementStarted(measurement_state);
    const weighingScalePopupConditionPass = showPopups && !isMeasurementInProgress && show_reconnect_popup && (is_scale_detached || is_scale_detected)
    const workflowUpdatePopupConditionPass = showPopups && !isMeasurementInProgress && !weighingScalePopupConditionPass

    setScaleReconnectDialog(weighingScalePopupConditionPass);
    setWorkflowUpdatePopup(workflowUpdatePopupConditionPass);
    updateIsBlockingPopupOpenStatus(weighingScalePopupConditionPass || workflowUpdatePopupConditionPass)
  }, [showPopups, measurement_state, show_reconnect_popup, is_scale_detached, is_scale_detected]);


  /** monitor scale detach / attach events only if the measurement staus not in progress*/
  useEffect(() => {
    const startMonitorScaleEvents = !isMeasurementStarted(measurement_state) && !blockPopupsAfterMeasureStart && showPopups;
    if (startMonitorScaleEvents) {
      displayScaleReconnectPopup(startMonitorScaleEvents)
    };
  }, [showPopups, measurement_state, blockPopupsAfterMeasureStart]);


  useEffect(() => {
    if (measurement_state.currentState === MeasurementState.INIT) {
      updateBlockPopupsAfterMeasureStart(false);
      setShowPopups(true);
    }
  }, [measurement_state])


  //prompt to warn operator on page exit 
  const [prompt] = usePrompt(
    t('measurement_page.navigate_confirmation_popup.title'),
    t('measurement_page.navigate_confirmation_popup.content'),
    showPrompt &&
    is_calibration_completed &&
    !isConfigPage &&
    !showQueueFullDialog &&
    !showScaleReconnectDialog
  );

  const showCalibrationPopup = (!showScaleReconnectDialog && !isConfigPage && !is_calibration_completed);

  return (
    <>
      <Grid container sx={UIProps.DefaultStyles.masterGrid} >
        <LoaderContainer isConfigPage={isConfigPage} />
        {
          showCalibrationPopup
            ? <CalibrationPopup />
            : !isCustomServiceResponding && !loader.active
              ? <ServiceNotFound />
              : <Grid item xs={12} sx={UIProps.DefaultStyles.mainContainer}  >
                <RootController
                  pageAttribute={pageAttribute}
                  pageLayout={pageLayout}
                  currentPageID={currentPageID}
                  showQueueFullDialog={showQueueFullDialog}
                  showScaleReconnectDialog={showScaleReconnectDialog}
                  isConfigPage={isConfigPage}
                  disableBack={disableBack}
                  handleBackClick={handleBackClick}
                  triggerEventAPI={triggerEventAPI}
                  onMeasureStateChange={handleMeasurementStateChange}
                />
              </Grid>
        }
        <ScaleAndQueuePopupHandler isQueueFilled={showQueueFullDialog} isScaleReconnect={showScaleReconnectDialog} />
        {prompt}
      </Grid>

    </>
  )
}

export default CustomFlowMasterController;