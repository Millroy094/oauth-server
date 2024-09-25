import { AxiosResponse } from "axios";
import axios from "../utils/axios-instance";

type validateCredentialsArgs = {
  email: string;
  password: string;
  otp?: string;
  interactionId: string;
};

const authenticateInteraction = async (
  args: validateCredentialsArgs
): Promise<AxiosResponse> => {
  const { email, password, otp, interactionId } = args;
  const response = await axios.post(
    `http://localhost:3000/oidc/interaction/${interactionId}/authenticate`,
    {
      email,
      password,
      otp,
    },
    { withCredentials: true }
  );
  return response;
};

export default authenticateInteraction;
