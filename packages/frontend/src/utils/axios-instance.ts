import axios from 'axios';
import globalRouter from './global-router';
import logoutUser from '../api/logout-user';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response.status == 401 &&
      error?.response?.data?.error ===
        'Authenication failed, please check if you are still logged in' &&
      globalRouter.navigate
    ) {
      await logoutUser();
      globalRouter.navigate('/login');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
