import dynamoose from 'dynamoose';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
const { Schema, model } = dynamoose;

const AccountSchema = new Schema(
  {
    userId: {
      type: String,
      hashKey: true,
      default: uuid(),
    },
    email: {
      type: String,
      required: true,
      rangeKey: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
      set: async (value) => {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = bcrypt.hash(value as string, salt);
        return encryptedPassword;
      },
    },
  },
  {
    timestamps: true,
  },
);
const Account = model('Account', AccountSchema);

export default Account;
