import { AxiosResponse } from 'axios';
import axios from '../utils/axios-instance';

type updateUserFields = {
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  mobile?: string;
  roles: string[];
};

const updateUser = async (
  id: string,
  updatedFields: updateUserFields,
): Promise<AxiosResponse> => {
  const { emailVerified, firstName, lastName, mobile, roles } = updatedFields;
  const response = await axios.put(
    `http://localhost:3000/admin/users/${id}`,
    {
      emailVerified,
      firstName,
      lastName,
      mobile,
      roles,
    },
    { withCredentials: true },
  );

  return response;
};

export default updateUser;
