import React, { useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CardLayout from "./layouts/card.layout";
import FormLayout from './layouts/form.layout';
import TableLayout from './layouts/table.layout';
import usePermission from '../../../hooks/usePermission';
import customFlowReducer from "../../../redux/reducers/custom-workflow";
import { LayoutTypes } from '../../../constants/custom-flow';
import { PermissionModules } from "../../../constants"
import { useDispatch, useSelector } from "react-redux";

const LayoutController = ({
    layout,
    layoutType,
    isConfigPage,
    isFullWidth,
    gridStyle,
    schema,
    uiSchema,
    focus,
    onPageSubmit,
    triggerEventAPI,
    onBarcodeTrigger
}) => {

    const dispatch = useDispatch()
    const [hasPermission] = usePermission(PermissionModules.CUSTOM_CONFIGURATION_UPDATE);
    const isInitialRender = useRef(true);
    const { pageFormData, customServiceInfo, currentPageID } = useSelector(state => state.customFlow);
    const { value: barcodeValue, counter: barcodeCounter } = useSelector(state => state.barcodeScan);

    const handlerLayoutClick = () => {
    }

    const onRJSFFormChange = async ({ formData }, id) => {
        if (id) {
            //reset messages on ui change
            dispatch(customFlowReducer.actions.resetMessage());
            const [layoutId, fieldId] = id?.split('|');
            const fieldFormData = formData[fieldId]?.value ?? formData[fieldId]
            const requestURL = formData[fieldId]?.URL
            const updatedFormData = { ...pageFormData[layout], [fieldId]: fieldFormData };
            if (layoutId && fieldId) {
                dispatch(customFlowReducer.actions.updatePageFormData({ updatedFormData, layoutId }));
                if (requestURL) {
                    triggerEventAPI(requestURL)
                }
            }
        }
    }

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        if (barcodeValue && onBarcodeTrigger && barcodeCounter) {
            triggerEventAPI(onBarcodeTrigger, { barcodeValue, barcodeCounter })
        }
    }, [barcodeValue, barcodeCounter])

    const { isCustomSettingsEnabled, defaultConfigurationPage } = customServiceInfo
    const disableActions = (isConfigPage && isCustomSettingsEnabled && currentPageID != defaultConfigurationPage && !hasPermission) ? { pointerEvents: "none" } : {}
    return (
        <Box component={Paper} overflow={'auto'} display={'flex'} sx={{ placeItems: "center", ...gridStyle, ...disableActions }} onClick={handlerLayoutClick}>
            {
                (schema && layoutType === LayoutTypes.FORM && uiSchema) &&
                <FormLayout
                    schema={schema}
                    uiSchema={uiSchema}
                    onSubmit={onPageSubmit}
                    onFormChange={onRJSFFormChange}
                    layoutId={layout}
                    triggerEventAPI={triggerEventAPI}
                    layoutFormData={pageFormData[layout]}
                    isFullWidth={isFullWidth}
                    focus={focus}
                />

            }
            {
                (schema && layoutType === LayoutTypes.TABLE && uiSchema) &&
                <TableLayout
                    headerContent={schema?.header}
                    footerContent={schema?.footer}
                    title={schema?.title}
                    uiSchema={uiSchema}
                    layoutId={layout}
                    formData={pageFormData[layout]}
                    tableHeader={schema?.tableHeader}
                    tableData={schema?.tableData}
                    triggerEventAPI={triggerEventAPI}
                    focus={focus}
                />
            }
            {
                (schema && layoutType === LayoutTypes.CARD && uiSchema) &&
                <CardLayout
                    schema={schema}
                    uiSchema={uiSchema}
                    formData={pageFormData}
                    layoutId={layout}
                    triggerEventAPI={triggerEventAPI}
                />
            }
        </Box>

    )
}

export default LayoutController