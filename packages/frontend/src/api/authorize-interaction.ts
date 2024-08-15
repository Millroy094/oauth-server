import axios, { AxiosResponse } from 'axios';

const authorizeInteraction = async (
  interactionId: string,
): Promise<AxiosResponse> => {
  const response = await axios.post(
    `http://localhost:3000/oidc/interaction/${interactionId}/authorize`,
    {},
    { withCredentials: true },
  );
  return response;
};

export default authorizeInteraction;
