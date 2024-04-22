import axios from "axios";

const login = async (username: string, password: string): Promise<void> => {
  try {
    const response = await axios.post(import.meta.env.VITE_AUTH_API_ENDPOINT, {
      username,
      password,
    });
    console.log(response);
  } catch (err) {
    console.log("Login was not successful");
  }
};

export default login;
