import axios, { AxiosResponse } from 'axios';

const getUserSessions = async (): Promise<AxiosResponse> => {
  const response = await axios.get(`http://localhost:3000/user/sessions`, {
    withCredentials: true,
  });
  return response;
};

export default getUserSessions;
