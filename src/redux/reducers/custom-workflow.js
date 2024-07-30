import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    customServiceInfo: {
        enabled: false,
        isAvailable: false,
        customFlowName: "",
        version: "",
        isCustomSettingsEnabled: false,
        defaultConfigurationPage: ""
    },
    currentPageID: null,
    previousPageId: null,
    disablePageAction: false,
    blockPopupsAfterMeasureStart: false,
    loader: { active: false, text: null },
    message: { messageString: null, messageType: null },
    showWorkflowUpdatePopup: false,
    pageAttribute: {},
    pageLayout: {},
    pageFormData: {},
}

const CustomWorkflowSlice = createSlice({
    name: 'custom-workflow',
    initialState,
    reducers: {
        setDisablePageAction: (state, { payload }) => {
            state.disablePageAction = payload;
        },
        showLoader: (state, { payload }) => {
            state.loader = { active: true, text: payload };
        },
        hideLoader: (state) => {
            state.loader = { active: false, text: null };
        },
        setCurrentPageId: (state, { payload }) => {
            state.currentPageID = payload
        },
        setPreviousPageId: (state, { payload }) => {
            state.previousPageId = payload
        },
        setBlockPopupsAfterMeasureStart: (state, { payload }) => {
            state.blockPopupsAfterMeasureStart = payload
        },
        updateCustomServiceInfo: (state, { payload }) => {
            state.customServiceInfo = payload?.data?.custom_service_app_details
        },
        updateWorkflowPopup: (state, { payload }) => {
            state.showWorkflowUpdatePopup = payload
        },
        updatePageAttribute: (state, { payload }) => {
            state.pageAttribute = payload
        },
        updatePageLayout: (state, { payload }) => {
            state.pageLayout = payload
        },
        updatePageFormData: (state, { payload }) => {
            state.pageFormData = { ...state.pageFormData, [payload.layoutId]: payload.updatedFormData }
        },
        resetPageFormData: (state) => {
            state.pageFormData = {};
        },
        setPageFormData: (state, { payload }) => {
            state.pageFormData = payload;
        },
        setMessage: (state, { payload }) => {
            state.message.messageType = payload.messageType
            state.message.messageString = payload.messageString
        },
        resetMessage: (state) => {
            state.message.messageType = null
            state.message.messageString = null
        }
    }
})

const data = {
    actions: CustomWorkflowSlice.actions,
    reducers: CustomWorkflowSlice.reducer
}

export default data;