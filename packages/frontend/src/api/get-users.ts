import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

const getUsers = async (): Promise<AxiosResponse> => {
  const response = await axios.get(`http://localhost:3000/admin/users`, {
    withCredentials: true,
  });
  return response;
};

export default getUsers;
