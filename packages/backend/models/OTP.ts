import dynamoose from "dynamoose";
import { v4 as uuid } from "uuid";
import { ValueType } from "dynamoose/dist/Schema";
import { decryptData, encryptData } from "../utils/encryption";

const { Schema, model } = dynamoose;

const OTPSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
      default: uuid(),
    },
    otp: {
      type: String,
      set: (value: ValueType) => encryptData(value as string),
      get: (value: ValueType) => decryptData(value as string),
      default: Math.floor(100000 + Math.random() * 900000),
    },
    type: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const OTP = model("OTP", OTPSchema, {
  expires: {
    ttl: 300,
    attribute: "expiresAt",
    items: {
      returnExpired: false,
    },
  },
});

export default OTP;
