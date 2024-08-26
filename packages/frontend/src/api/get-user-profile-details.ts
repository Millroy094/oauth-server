import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

const getUserProfileDetails = async (): Promise<AxiosResponse> => {
  const response = await axios.get(
    'http://localhost:3000/user/profile-details',
    {
      withCredentials: true,
    },
  );
  return response;
};

export default getUserProfileDetails;
