import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

const getMFALoginConfiguration = async (
  email: string,
): Promise<AxiosResponse> => {
  const response = await axios.get(
    `http://localhost:3000/user/get-mfa-login-configuration`,
    {
      params: { email },
      withCredentials: true,
    },
  );
  return response;
};

export default getMFALoginConfiguration;
