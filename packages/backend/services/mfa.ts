import omit from 'lodash/omit';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import crypto from 'crypto';
import { TOTP } from 'otpauth';

import { User } from '../models';
import generateOtp from '../utils/generate-otp';
import OTPService from './otp';
import { sendEmail, sendSMS } from '../utils/notification';

const setupAppMFA = async (
  userId: string,
  subscriber: string,
): Promise<{ uri: string }> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  const secret = crypto.randomBytes(32).toString('base64');

  const totp = new TOTP({
    issuer: 'MTech',
    label: 'MTech',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  });

  user.mfa.app.secret = secret;
  user.mfa.app.subscriber = subscriber;
  await user.save();

  const uri = totp.toString();

  return { uri };
};

const setupSMSMFA = async (
  userId: string,
  subscriber: string,
): Promise<void> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  const otp = generateOtp();
  await OTPService.storeOtp(userId, 'SMS', otp);
  await sendSMS(subscriber, `Here's your OTP ${otp} to login`);

  user.mfa.sms.subscriber = subscriber;
  await user.save();
};

const setupEmailMFA = async (
  userId: string,
  subscriber: string,
): Promise<void> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  const otp = generateOtp();
  await OTPService.storeOtp(userId, 'EMAIL', otp);
  await sendEmail(subscriber, 'Login OTP', `Here's your OTP ${otp} to login`);

  user.mfa.email.subscriber = subscriber;
  await user.save();
};

const verifyAppMFA = async (userId: string, otp: string): Promise<void> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  const totp = new TOTP({
    issuer: 'MTech',
    label: 'MTech',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: user.mfa.app.secret,
  });

  if (!totp.validate({ token: otp, window: 1 })) {
    throw new Error('Invalid OTP');
  }

  if (!user.mfa.app.verified) {
    user.mfa.app.verified = true;
    await user.save();
  }
};
const verifySMSMFA = async (userId: string, otp: string): Promise<void> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  if (!OTPService.validateOtp(userId, 'SMS', otp)) {
    throw new Error('Invalid OTP');
  }

  if (!user.mfa.sms.verified) {
    user.mfa.sms.verified = true;
    await user.save();
  }
};
const verifyEmailMFA = async (userId: string, otp: string): Promise<void> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  if (!OTPService.validateOtp(userId, 'EMAIL', otp)) {
    throw new Error('Invalid OTP');
  }

  if (!user.mfa.email.verified) {
    user.mfa.email.verified = true;
    await user.save();
  }
};

class MFAService {
  public static async getMFASetting(userId: string): Promise<{
    types: { subscriber: string; verified: boolean }[];
    preference: string;
  }> {
    const userAccountMfaSetting = await User.get(userId, {
      attributes: ['mfa'],
    });

    if (isEmpty(userAccountMfaSetting)) {
      throw new Error('User does not exists');
    }

    return {
      types: map(
        omit(userAccountMfaSetting.mfa, 'preference'),
        ({ subscriber, verified }, type) => ({ type, subscriber, verified }),
      ),
      preference: userAccountMfaSetting.mfa.preference,
    };
  }

  public static async setupMFA(
    userId: string,
    type: 'APP' | 'SMS' | 'EMAIL',
    subscriber: string,
  ): Promise<void | {
    uri: string;
  }> {
    const setup = { APP: setupAppMFA, SMS: setupSMSMFA, EMAIL: setupEmailMFA };
    const response = await setup[type](userId, type);
    return response;
  }

  public static async verifyMFA(
    userId: string,
    type: 'APP' | 'SMS' | 'EMAIL',
    otp: string,
  ): Promise<void> {
    const verify = {
      APP: verifyAppMFA,
      SMS: verifySMSMFA,
      EMAIL: verifyEmailMFA,
    };
    await verify[type](userId, otp);
  }
}

export default MFAService;
