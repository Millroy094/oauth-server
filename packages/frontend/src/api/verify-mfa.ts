import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

type VerifyMFAArgs = {
  type: string;
  otp: string;
};

const verifyMFA = async (args: VerifyMFAArgs): Promise<AxiosResponse> => {
  const { type, otp } = args;
  const response = await axios.post(
    'http://localhost:3000/user/mfa-verify',
    {
      type,
      otp,
    },
    { withCredentials: true },
  );

  return response;
};

export default verifyMFA;
