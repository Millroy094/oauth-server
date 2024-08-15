import axios, { AxiosResponse } from 'axios';

type validateCredentialsArgs = {
  email: string;
  password: string;
  interactionId: string;
};

const authenicateInteraction = async (
  args: validateCredentialsArgs,
): Promise<AxiosResponse> => {
  const { email, password, interactionId } = args;
  const response = await axios.post(
    `http://localhost:3000/oidc/interaction/${interactionId}/login`,
    {
      email,
      password,
    },
    { withCredentials: true },
  );
  return response;
};

export default authenicateInteraction;
