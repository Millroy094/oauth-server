import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

type updateUserFields = {
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  mobile?: string;
  isAdmin: boolean;
};

const updateUser = async (
  id: string,
  updatedFields: updateUserFields,
): Promise<AxiosResponse> => {
  const { emailVerified, firstName, lastName, mobile, isAdmin } = updatedFields;
  const response = await axios.put(
    `http://localhost:3000/admin/users/${id}`,
    {
      emailVerified,
      firstName,
      lastName,
      mobile,
      isAdmin,
    },
    { withCredentials: true },
  );

  return response;
};

export default updateUser;
