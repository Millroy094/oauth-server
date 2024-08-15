import axios, { AxiosResponse } from 'axios';

const authoriseInteraction = async (
  interactionId: string,
): Promise<AxiosResponse> => {
  const response = await axios.post(
    `http://localhost:3000/oidc/interaction/${interactionId}/confirm`,
    {},
    { withCredentials: true },
  );
  return response;
};

export default authoriseInteraction;
