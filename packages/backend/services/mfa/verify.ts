import { Secret, TOTP } from 'otpauth';
import { User } from '../../models';
import OTPService from '../otp';
import getEnv from '../../support/env-config';

export const verifyAppMFA = async (
  userId: string,
  otp: string,
): Promise<void> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  const totp = new TOTP({
    issuer: getEnv('issuer.name'),
    label: getEnv('issuer.name'),
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: Secret.fromUTF8(user.mfa.app.secret),
  });
  if (totp.validate({ token: otp, window: 1 }) === null) {
    throw new Error('Invalid OTP');
  }

  if (!user.mfa.app.verified) {
    user.mfa.app.verified = true;

    user.mfa.preference = user.mfa.preference || 'app';

    await user.save();
  }
};
export const verifySMSMFA = async (
  userId: string,
  otp: string,
): Promise<void> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  if (!OTPService.validateOtp(userId, 'sms', otp)) {
    throw new Error('Invalid OTP');
  }

  if (!user.mfa.sms.verified) {
    user.mfa.sms.verified = true;
    user.mfa.preference = user.mfa.preference || 'sms';
    await user.save();
  }
};

export const verifyEmailMFA = async (
  userId: string,
  otp: string,
): Promise<void> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  if (!OTPService.validateOtp(userId, 'email', otp)) {
    throw new Error('Invalid OTP');
  }

  if (!user.mfa.email.verified) {
    user.mfa.email.verified = true;
    user.mfa.preference = user.mfa.preference || 'email';
    await user.save();
  }
};
