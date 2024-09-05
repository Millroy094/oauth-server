import { AxiosResponse } from "axios";
import axios from "../utils/axios-instance";

const getMFASettings = async (): Promise<AxiosResponse> => {
  const response = await axios.get("http://localhost:3000/user/mfa", {
    withCredentials: true,
  });
  return response;
};

export default getMFASettings;
