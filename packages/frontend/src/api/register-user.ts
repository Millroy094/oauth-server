import axios, { AxiosResponse } from 'axios';

type registerUserArgs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile?: string;
};

const registerUser = async (args: registerUserArgs): Promise<AxiosResponse> => {
  const { email, password, firstName, lastName, mobile } = args;
  const response = await axios.post(
    'http://localhost:3000/user/register',
    {
      email,
      password,
      firstName,
      lastName,
      mobile,
    },
    { withCredentials: true },
  );

  return response;
};

export default registerUser;
