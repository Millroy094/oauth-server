import axios, { AxiosResponse } from 'axios';

type UpdateClientArgs = {
  scopes: string[];
  grants: string[];
  redirectUris: string[];
};

const updateClient = async (
  id: string,
  args: UpdateClientArgs,
): Promise<AxiosResponse> => {
  const { scopes, grants, redirectUris } = args;
  const response = await axios.put(
    `http://localhost:3000/admin/clients/${id}`,
    {
      scopes,
      grants,
      redirectUris,
    },
    { withCredentials: true },
  );

  return response;
};

export default updateClient;
