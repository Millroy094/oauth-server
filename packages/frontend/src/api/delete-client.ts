import axios, { AxiosResponse } from 'axios';

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
