import dynamoose from 'dynamoose';

const { Schema, model } = dynamoose;

const OIDCStoreSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
  },
  {
    timestamps: true,
  },
);
const OIDCStore = model('OIDCStore', OIDCStoreSchema);

export default OIDCStore;
