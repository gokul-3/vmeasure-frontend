import customWorkflowAPI from "../pages/custom-flow/utils/interceptor";
import { addTranslation } from "../utils/translation-addresource";

export const saveMeasurement = async (measurementResult) => {
    try {
        const { data } = await customWorkflowAPI.post("/utils/upload-measurement-data", measurementResult)
        return data;
    } catch (error) {
        console.error("Error in custom save measurement:", JSON.stringify(error))
        return {
            status: false,
            error: { message: 'custom_service_unavailable' }
        };
    }
}


export const addCustomFlowTranslation = (translationData) => {
    const translationDataKeys = Object.keys(translationData)
    translationDataKeys.forEach((language) => {
        const args = {
            language,
            translationObject: { custom_service: translationData[language] }
        }
        addTranslation(args)
    })
}