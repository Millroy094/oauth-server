import axios from 'axios';

const authoriseLogin = async (interactionId: string): Promise<void> => {
  const response = await axios.post(
    `http://localhost:3000/interaction/${interactionId}/confirm`,
    {},
    { withCredentials: true },
  );
  window.location.href = response.data.redirect;
};

export default authoriseLogin;
