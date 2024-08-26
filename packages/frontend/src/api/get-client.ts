import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

const getClient = async (id: string): Promise<AxiosResponse> => {
  const response = await axios.get(
    `http://localhost:3000/admin/clients/${id}`,
    {
      withCredentials: true,
    },
  );
  return response;
};

export default getClient;
