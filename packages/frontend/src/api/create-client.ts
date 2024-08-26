import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

type CreateClientArgs = {
  clientId: string;
  clientName: string;
  scopes: string[];
  grants: string[];
  redirectUris: string[];
};

const createClient = async (args: CreateClientArgs): Promise<AxiosResponse> => {
  const { clientId, clientName, scopes, grants, redirectUris } = args;
  const response = await axios.post(
    'http://localhost:3000/admin/clients/new',
    {
      clientId,
      clientName,
      scopes,
      grants,
      redirectUris,
    },
    { withCredentials: true },
  );

  return response;
};

export default createClient;
