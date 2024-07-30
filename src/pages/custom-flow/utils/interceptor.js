import axios from "axios";
import formData from "form-data";
import { NetworkStatusErrorCodes } from "../../../constants";
import { CustomServicePort } from "../../../constants/custom-flow";

const baseURL = `http://localhost:${CustomServicePort}/api`;
const instance = axios.create({
    baseURL: baseURL,
    timeout: 60000,
});

instance.interceptors.request.use(
    async (request) => {
        if (request.data instanceof formData) {
            Object.assign(request.headers, {
                "Content-Type": "multipart/form-data",
            });
        }
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        if (NetworkStatusErrorCodes.indexOf(error.code) !== -1 ||
            NetworkStatusErrorCodes.indexOf(error?.response?.data?.code) !== -1
        ) {
            error.message = 'network_error'
        }

        return Promise.reject(error);
    }
);

export default instance;
