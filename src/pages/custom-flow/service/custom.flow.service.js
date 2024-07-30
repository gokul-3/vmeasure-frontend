import customFlowInstance from "../utils/interceptor";
import httpStatus from "http-status";

export const getFirstPage = async () => {
    try {
        const { data } = await customFlowInstance.get("/page/first-page");
        return { status: true, data: data }
    } catch (err) {
        return Promise.resolve({ status: false, error: { errorMessage: "API Failed in API Failed" } })
    }
}

export const getConfigPage = async () => {
    try {
        const { data } = await customFlowInstance.get("/page/config-page");
        return { status: true, data: data?.configPage }
    } catch (err) {
        return Promise.resolve({ status: false, error: { errorMessage: "Unable to communicate with custom service" } })
    }
}
export const loadPage = async (page_id) => {
    try {
        const { data } = await customFlowInstance.get(`/page/schema/${page_id}`);
        return { status: true, data: data, error: null }
    } catch (err) {
        return { status: false, data: null, error: { errorMessage: "Unable to communicate with custom service" } }
    }
}


export const eventAPI = async (url, metaData, additionalInfo) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await customFlowInstance.post(url, { metaData, additionalInfo });
            return resolve({ status: result?.status === httpStatus.OK, data: result?.data ?? result?.error })

        } catch (err) {
            console.error(err)
            return resolve({ status: false, error: { errorMessage: "Unable to communicate with custom service" } })
        }
    });
}

export const handleFlowInterrupt = async (arg) => {
    try {
        const { data } = await customFlowInstance.post("/utils/on-flow-interupt", { data: arg });
        return { status: true, data: data?.configPage }
    } catch (err) {
        return Promise.resolve({ status: false, error: { errorMessage: "Unable to communicate with custom service" } })
    }
}

