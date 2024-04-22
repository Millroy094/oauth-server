import axios from "axios";

const login = async (username: string, password: string): Promise<void> => {
  try {
    console.log(import.meta.env)
    const response = await axios.post(import.meta.env.VITE_AUTH_API_ENDPOINT, {
      username,
      password,
    });
    console.log(response);
  } catch (err) {
    console.log("Login was not successful", err);
  }
};

export default login;
