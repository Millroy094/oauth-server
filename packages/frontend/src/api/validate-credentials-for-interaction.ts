import axios from 'axios';

type validateCredentialsArgs = {
  email: string;
  password: string;
  interactionId: string;
};

const validateCredentialsForInteraction = async (
  args: validateCredentialsArgs,
): Promise<void> => {
  const { email, password, interactionId } = args;
  const response = await axios.post(
    `http://localhost:3000/interaction/${interactionId}/login`,
    {
      email,
      password,
    },
    { withCredentials: true },
  );
  window.location.href = response.data.redirect;
};

export default validateCredentialsForInteraction;
