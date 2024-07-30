import React from 'react';
import Box from "@mui/material/Box";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import LayoutController from "./layout.controller";
import { UIProps } from '../../../constants/custom-flow';
import { useTranslation } from 'react-i18next';


const CustomPageControler = ({ pageLayouts, pageAttribute, triggerEventAPI, currentPageID, isConfigPage, disableBack, handleBackClick }) => {
    const { t } = useTranslation();

    const onPageSubmit = async () => {
        const url = pageAttribute?.onSubmit;
        if (url) { triggerEventAPI(url) }
    }

    return (
        <>
            <Header pageTitle={isConfigPage ? t('configurations.custom_settings.page_title') : pageAttribute?.title} handleBackButton={handleBackClick} isBackNavEnabled={isConfigPage} disabled={disableBack} />
            <Box sx={{
                ...UIProps.DefaultStyles.customLayoutContainer,
                ...pageAttribute?.style,
                gridTemplateColumns: `repeat(${pageAttribute?.grid?.column}, 1fr)`,
                gridTemplateRows: `repeat(${pageAttribute?.grid?.row}, 1fr)`,
            }} >
                {Object.keys(pageLayouts).map((layout) => (
                    <LayoutController
                        key={layout}
                        layout={layout}
                        isConfigPage={isConfigPage}
                        isFullWidth={pageLayouts?.[layout]?.isFullWidth}
                        layoutType={pageLayouts?.[layout]?.layoutType}
                        gridStyle={pageLayouts?.[layout]?.style}
                        schema={pageLayouts?.[layout].schema}
                        uiSchema={pageLayouts?.[layout].uiSchema}
                        focus={pageAttribute?.focus}
                        onPageSubmit={onPageSubmit}
                        triggerEventAPI={triggerEventAPI}
                        onBarcodeTrigger={pageAttribute?.onBarcodeTrigger}
                    />
                ))}
            </Box>
            <Footer pageControls={pageAttribute?.pageControls} triggerEventAPI={triggerEventAPI} currentPageID={currentPageID} isConfigPage={isConfigPage} />
        </>
    )
}

export default CustomPageControler