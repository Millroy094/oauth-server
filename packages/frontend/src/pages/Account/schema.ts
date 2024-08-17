import * as yup from 'yup';

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    emailVerified: yup.boolean().required(),
    mobile: yup.string(),
  })
  .required();

export default schema;
