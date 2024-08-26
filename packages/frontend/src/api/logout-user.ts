import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

const logoutUser = async (): Promise<AxiosResponse> => {
  const response = await axios.get('http://localhost:3000/user/logout', {
    withCredentials: true,
  });

  return response;
};

export default logoutUser;
