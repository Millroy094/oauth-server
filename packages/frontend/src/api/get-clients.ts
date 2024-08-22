import axios, { AxiosResponse } from 'axios';

const getClients = async (): Promise<AxiosResponse> => {
  const response = await axios.get(`http://localhost:3000/admin/clients`, {
    withCredentials: true,
  });
  return response;
};

export default getClients;
