import axios, { AxiosResponse } from 'axios';

const getInteractionStatus = async (
  interactionId: string,
): Promise<AxiosResponse> => {
  const response = await axios.get(
    `http://localhost:3000/oidc/interaction/${interactionId}/status`,
    {
      withCredentials: true,
    },
  );
  return response;
};

export default getInteractionStatus;