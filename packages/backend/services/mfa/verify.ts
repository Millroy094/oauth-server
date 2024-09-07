import { Secret, TOTP } from 'otpauth';
import { User } from '../../models';
import OTPService from '../otp';

export const verifyAppMFA = async (
  userId: string,
  otp: string,
): Promise<void> => {
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
    secret: Secret.fromUTF8(user.mfa.app.secret),
  });

  if (!totp.validate({ token: otp, window: 1 })) {
    throw new Error('Invalid OTP');
  }

  if (!user.mfa.app.verified) {
    user.mfa.app.verified = true;
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

  if (!OTPService.validateOtp(userId, 'SMS', otp)) {
    throw new Error('Invalid OTP');
  }

  if (!user.mfa.sms.verified) {
    user.mfa.sms.verified = true;
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

  if (!OTPService.validateOtp(userId, 'EMAIL', otp)) {
    throw new Error('Invalid OTP');
  }

  if (!user.mfa.email.verified) {
    user.mfa.email.verified = true;
    await user.save();
  }
};
