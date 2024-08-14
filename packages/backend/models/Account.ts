import dynamoose from 'dynamoose';

const { Schema, model } = dynamoose;

const AccountSchema = new Schema(
  {
    userId: {
      type: String,
      hashKey: true,
    },
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
const Account = model('Account', AccountSchema);

export default Account;
