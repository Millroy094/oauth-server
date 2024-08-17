import axios, { AxiosResponse } from 'axios';

const isAuthenticated = async (): Promise<AxiosResponse> => {
  const response = await axios.get(
    'http://localhost:3000/user/is-authenticated',
    { withCredentials: true },
  );

  return response;
};

export default isAuthenticated;
