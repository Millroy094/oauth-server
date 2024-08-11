import axios from 'axios';

const getAuthenticationStatus = async (
  interactionId: string,
): Promise<void> => {
  const response = await axios.get(
    `http://localhost:3000/interaction/${interactionId}/status`,
    {
      withCredentials: true,
    },
  );
  return response.data.status;
};

export default getAuthenticationStatus;
