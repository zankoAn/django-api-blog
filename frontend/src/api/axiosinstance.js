import axios from 'axios';

import { API_URL } from '../configs/settings';

const Axios = axios.create({
    baseURL: API_URL,
  });

export default Axios;