import * as yup from 'yup';

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
    mfaType: yup.string(),
    otp: yup
      .string()
      .when('mfaType', (mfaType) =>
        mfaType ? yup.string().required().min(6) : yup.string(),
      ),
  })
  .required();

export default schema;
