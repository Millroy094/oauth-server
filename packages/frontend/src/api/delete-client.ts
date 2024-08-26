import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

const deleteClient = async (id: string): Promise<AxiosResponse> => {
  const response = await axios.delete(
    `http://localhost:3000/admin/clients/${id}`,
    {
      withCredentials: true,
    },
  );
  return response;
};

export default deleteClient;
