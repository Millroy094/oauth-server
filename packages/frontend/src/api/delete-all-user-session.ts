import axios, { AxiosResponse } from 'axios';

const deleteAllUserSession = async (): Promise<AxiosResponse> => {
  const response = await axios.delete('http://localhost:3000/user/sessions', {
    withCredentials: true,
  });
  return response;
};

export default deleteAllUserSession;
