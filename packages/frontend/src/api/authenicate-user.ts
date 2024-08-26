import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

type AuthenticateUserArgs = {
  email: string;
  password: string;
};

const authenicateUser = async (
  args: AuthenticateUserArgs,
): Promise<AxiosResponse> => {
  const { email, password } = args;
  const response = await axios.post(
    'http://localhost:3000/user/login',
    {
      email,
      password,
    },
    { withCredentials: true },
  );
  return response;
};

export default authenicateUser;
