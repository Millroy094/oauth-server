import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

const resetMfa = async (type: string): Promise<AxiosResponse> => {
  const response = await axios.post(
    'http://localhost:3000/user/mfa-reset',
    {
      type,
    },
    { withCredentials: true },
  );

  return response;
};

export default resetMfa;
