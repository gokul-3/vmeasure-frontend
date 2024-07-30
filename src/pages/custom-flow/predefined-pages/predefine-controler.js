import React, { useEffect, useState } from 'react'
import appState from "../../../redux/reducers/measurement-states"
import PrinterPage from '../../printer-settings'
import MeasurementPage from "../measure-components/measurement-page"
import AdditionalImage from '../../measurement/additional-image-page'
import { PreDefinedPages } from '../../../constants/custom-flow'
import { MeasurementPages } from '../../../constants'
import { useDispatch, useSelector } from 'react-redux'

const PreDefinedPageController = ({ onMeasurementStateChange, pageAttribute, triggerEventAPI, currentPageID, isQueueFull, showScaleReconnectDialog }) => {
    const dispatch = useDispatch()
    const { pageFormData } = useSelector(state => state.customFlow);
    const [barcodeValue, setBarcodeValue] = useState(pageFormData?.barcode ?? "")



    //AFTER SAVING A DEFAULT PRINTER 
    const handleSuccessCallback = () => {
        triggerEventAPI(pageAttribute.onPrintConfigSave)
    }

    //AFTER MEASUREMENT CLEAR
    const handleMeasurementProcessCompleted = async (measureResponse) => {
        dispatch(appState.actions.initMeasurementState());
        if (pageAttribute?.onMeasurementClear) {
            triggerEventAPI(pageAttribute?.onMeasurementClear, { measure_data: measureResponse?.data })
        }
    }

    //AFTER MEASUREMENT SUCCESS/FAILURE
    const handleMeasurementClearStateStart = async (measureResponse) => {
        const status = measureResponse?.status;
        const data = measureResponse?.data

        if (status && pageAttribute?.onMeasurementSuccess) { //SUCCESS
            const url = pageAttribute?.onMeasurementSuccess;
            triggerEventAPI(url, { measure_data: data?.measurement });

        }
        if (!status && pageAttribute?.onMeasurementFailure) { //FAIL
            const url = pageAttribute?.onMeasurementFailure;
            triggerEventAPI(url, { measure_data: data?.measurement });
        }
    }

    const onAdditionalImageAction = (data) => {
        if (pageAttribute?.onAdditionalImageAction) {
            triggerEventAPI(pageAttribute?.onAdditionalImageAction, { additional_image_data: data })
        }
    }

    const onAdditionalImageComplete = (data) => {
        if (pageAttribute?.onAdditionalImageComplete) {
            triggerEventAPI(pageAttribute.onAdditionalImageComplete, { additional_image_data: data })
        }
    }


    useEffect(() => {
        if (currentPageID && pageAttribute?.pageType?.type === PreDefinedPages.MEASUREMENT_PAGE) {
            dispatch(appState.actions.resetMeasurementResult());
            dispatch(appState.actions.initMeasurementState());
            dispatch(appState.actions.updateCurrentMeasurementPage(MeasurementPages.MEASUREMENT_PAGE));
        }
        else if (currentPageID && pageAttribute?.pageType?.type === PreDefinedPages.ADDITIONAL_IMAGE) {
            dispatch(appState.actions.updateCurrentMeasurementPage(MeasurementPages.ADDITIONAL_IMAGE));
        }
        else if (currentPageID && pageAttribute?.pageType?.type === PreDefinedPages.ADDITIONAL_VIDEO) {
            dispatch(appState.actions.updateCurrentMeasurementPage(MeasurementPages.ADDITIONAL_VIDEO));
        }

    }, [currentPageID]);


    useEffect(() => {
        if (pageFormData.barcode) {
            setBarcodeValue(pageFormData.barcode)
        }
    }, [pageFormData?.barcode])

    return (
        <>
            {
                (pageAttribute?.pageType?.type === PreDefinedPages.MEASUREMENT_PAGE && !isQueueFull && !showScaleReconnectDialog) &&
                <MeasurementPage
                    onAction={() => { onMeasurementStateChange() }}
                    dynamicPageData={{}}
                    onMeasurementProcessCompleted={handleMeasurementProcessCompleted}
                    onMeasurementClearStateStarted={handleMeasurementClearStateStart}
                    barcodeValue={barcodeValue ?? ""}
                />
            }
            {
                pageAttribute?.pageType?.type === PreDefinedPages.ADDITIONAL_IMAGE
                && <AdditionalImage
                    onAction={onAdditionalImageAction}
                    onComplete={onAdditionalImageComplete}
                />
            }
            {
                pageAttribute?.pageType?.type === PreDefinedPages.PRINTER_SETTING_PAGE
                && <PrinterPage
                    onAction={() => { }}
                    successCallback={handleSuccessCallback}
                    isCustomWorkflow={true}
                    callbackString={{ error: { message: "custom_service.error_messages.default_printer_not_ready", type: "error" } }}
                    disableBack={true}
                />
            }
        </>
    )
}

export default PreDefinedPageController