import uniqueId from 'lodash/uniqueId';
import { User } from '../../models';
import { Secret, TOTP } from 'otpauth';
import { sendEmailOtp, sendSMSOtp } from './send';

export const setupAppMFA = async (
  userId: string,
  subscriber: string,
): Promise<{ uri: string }> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  const secret = uniqueId();

  const totp = new TOTP({
    issuer: 'MTech',
    label: 'MTech',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: Secret.fromUTF8(secret),
  });

  user.mfa.app.secret = secret;
  user.mfa.app.subscriber = subscriber;
  await user.save();

  const uri = totp.toString();

  return { uri };
};

export const setupSMSMFA = async (
  userId: string,
  subscriber: string,
): Promise<void> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }

  await sendSMSOtp(userId, subscriber);

  user.mfa.sms.subscriber = subscriber;
  await user.save();
};

export const setupEmailMFA = async (
  userId: string,
  subscriber: string,
): Promise<void> => {
  const user = await User.get(userId);

  if (!user) {
    throw new Error('User does not exist');
  }
  await sendEmailOtp(userId, subscriber);

  user.mfa.email.subscriber = subscriber;
  await user.save();
};
