import lodash from "lodash";

export const updateMetaDataOnFormChange = (metaData, currentPageId, currentFormData) => {
    const metaDataClone = lodash.cloneDeep(metaData);
    metaDataClone[currentPageId] = currentFormData
    return metaDataClone
}