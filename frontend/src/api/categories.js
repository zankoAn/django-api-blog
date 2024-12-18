import Axios from "./axiosinstance";

export const GetCategories = async (params, onProgress) => {
    const url = "/categories/"
    const response = await Axios.get(url, {
        params,
        onDownloadProgress: (progressEvent) => {
            const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length');
            if (totalLength) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / totalLength);
                onProgress(percentCompleted);
            }
        }
    });
    return response.data;
};