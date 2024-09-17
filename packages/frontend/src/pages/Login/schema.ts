import * as yup from "yup";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
    mfaType: yup.string(),
    otp: yup.string().when("mfaType", (mfaType, schema) => {
      const [type] = mfaType;
      return type ? schema.required().min(6) : schema;
    }),
  })
  .required();

export default schema;
