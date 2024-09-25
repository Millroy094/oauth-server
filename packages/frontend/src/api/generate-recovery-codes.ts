import { AxiosResponse } from "axios";
import axios from "../utils/axios-instance";

const generateRecoveryCodes = async (): Promise<AxiosResponse> => {
  const response = await axios.get(
    "http://localhost:3000/user/generate-recovery-codes",
    {
      withCredentials: true,
    }
  );
  return response;
};

export default generateRecoveryCodes;
