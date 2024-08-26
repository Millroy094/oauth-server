import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

const getClients = async (): Promise<AxiosResponse> => {
  const response = await axios.get(`http://localhost:3000/admin/clients`, {
    withCredentials: true,
  });
  return response;
};

export default getClients;
