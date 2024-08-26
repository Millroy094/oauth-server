import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

const deleteUserSession = async (sessionId: string): Promise<AxiosResponse> => {
  const response = await axios.delete(
    `http://localhost:3000/user/sessions/${sessionId}`,
    {
      withCredentials: true,
    },
  );
  return response;
};

export default deleteUserSession;
