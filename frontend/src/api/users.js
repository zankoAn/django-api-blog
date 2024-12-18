import Axios from './axiosinstance';

export const GetUser = async (user_id) => {
    const url = `/users/${user_id}/`
    const response = await Axios.get(url);
    return response.data;
};