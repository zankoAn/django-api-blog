import Axios from "./axiosinstance";

export const GetArticles = async (params, onProgress) => {
    const url = '/articles/'
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


export const GetArticle = async (article_id, onProgress) => {
    const url = `/articles/${article_id}/`
    const response = await Axios.get(url,
        {
            onDownloadProgress: (progressEvent) => {
                const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length');
                if (totalLength) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / totalLength);
                    onProgress(percentCompleted);
                }
            }
        }
    );
    return response.data;
};