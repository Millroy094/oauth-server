import axios from 'axios';

type registerUserArgs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile?: string;
};

const registerUser = async (args: registerUserArgs): Promise<void> => {
  const { email, password, firstName, lastName, mobile } = args;
  await axios.post(
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
};

export default registerUser;
