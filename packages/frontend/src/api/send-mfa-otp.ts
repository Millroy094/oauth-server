import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

interface ISendMFAOtpArgs {
  type: string;
  userId: string;
}

const sendMFAOtp = async (args: ISendMFAOtpArgs): Promise<AxiosResponse> => {
  const { type, userId } = args;
  const response = await axios.post(
    'http://localhost:3000/user/mfa-send-otp',
    {
      type,
      userId,
    },
    { withCredentials: true },
  );

  return response;
};

export default sendMFAOtp;
