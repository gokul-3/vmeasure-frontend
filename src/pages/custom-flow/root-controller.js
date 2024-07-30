import React from 'react'
import PreDefinedPageController from './predefined-pages/predefine-controler';
import CustomPageControler from './custom-pages/custom-page-controler';

const RootController = (props) => {
    const {
        pageAttribute,
        pageLayout,
        onMeasureStateChange,
        triggerEventAPI,
        currentPageID,
        showQueueFullDialog,
        showScaleReconnectDialog,
        isConfigPage,
        disableBack,
        handleBackClick
    } = props;
    return (
        <>
            {
                (pageAttribute && pageLayout) &&
                <>
                    {
                        pageAttribute?.pageType?.preDefined
                            ? <PreDefinedPageController
                                onMeasurementStateChange={onMeasureStateChange}
                                pageAttribute={pageAttribute}
                                triggerEventAPI={triggerEventAPI}
                                currentPageID={currentPageID}
                                isQueueFull={showQueueFullDialog}
                                showScaleReconnectDialog={showScaleReconnectDialog}
                            />
                            : <CustomPageControler
                                pageAttribute={pageAttribute}
                                pageLayouts={pageLayout}
                                triggerEventAPI={triggerEventAPI}
                                currentPageID={currentPageID}
                                isConfigPage={isConfigPage}
                                disableBack={disableBack}
                                handleBackClick={handleBackClick}
                            />
                    }
                </>
            }
        </>
    )
}

export default RootController