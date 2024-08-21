import dynamoose from 'dynamoose';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import { decryptData, encryptData } from '../utils/encryption';
import { ValueType } from 'dynamoose/dist/Schema';
const { Schema, model } = dynamoose;

const ClientSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
      default: uuid(),
    },
    clientId: {
      type: String,
      hashKey: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      default: crypto.randomBytes(64).toString('hex'),
      set: (value: ValueType) => encryptData(value as string),
      get: (value: ValueType) => decryptData(value as string),
    },
    grants: {
      type: Array,
      schema: [String],
      required: true,
    },
    scopes: {
      type: Array,
      schema: [String],
      required: true,
    },
    redirectUris: {
      type: Array,
      schema: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const Client = model('Client', ClientSchema);

export default Client;
