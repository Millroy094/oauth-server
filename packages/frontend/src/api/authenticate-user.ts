import { AxiosResponse } from "axios";
import axios from "../utils/axios-instance";

type AuthenticateUserArgs = {
  email: string;
  password: string;
  otp?: string;
};

const authenticateUser = async (
  args: AuthenticateUserArgs
): Promise<AxiosResponse> => {
  const { email, password, otp } = args;
  const response = await axios.post(
    "http://localhost:3000/user/login",
    {
      email,
      password,
      otp,
    },
    { withCredentials: true }
  );
  return response;
};

export default authenticateUser;
