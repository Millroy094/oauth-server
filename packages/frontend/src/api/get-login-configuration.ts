import { AxiosResponse } from "axios";
import axios from "../utils/axios-instance";

const getLoginConfiguration = async (email: string): Promise<AxiosResponse> => {
  const response = await axios.get(
    `http://localhost:3000/user/get-login-configuration`,
    {
      params: { email },
      withCredentials: true,
    }
  );
  return response;
};

export default getLoginConfiguration;
