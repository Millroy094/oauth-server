import * as yup from 'yup';

const schema = yup
  .object({
    email: yup.string().email().required(),
    emailSent: yup.boolean().required(),
    otp: yup
      .string()
      .required('OTP is Required')
      .matches(/^\d*$/, 'OTP must be number')
      .min(6, 'OTP must be 6 digits')
      .max(6, 'OTP must be 6 digits'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Must Contain 8 Characters')
      .matches(/^(?=.*[a-z])/, 'Must Contain One Lowercase Character')
      .matches(/^(?=.*[A-Z])/, 'Must Contain One Uppercase Character')
      .matches(/^(?=.*[0-9])/, 'Must Contain One Number Character')
      .matches(
        /^(?=.*[!@#\$%\^&\*])/,
        'Must Contain  One Special Case Character',
      ),
    confirmPassword: yup
      .string()
      .required('Password confirmation is required')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })
  .required();

export default schema;
